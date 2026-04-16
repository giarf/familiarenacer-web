import type { APIRoute } from 'astro';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const SESSION_COOKIE = 'renacer_admin';

function getExpectedToken() {
  const user = import.meta.env.ADMIN_USER ?? 'admin';
  const pass = import.meta.env.ADMIN_PASS ?? '';
  return `${user}::${pass}`;
}

function toSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verificar sesión
  const session = cookies.get(SESSION_COOKIE);
  if (session?.value !== getExpectedToken()) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nombre = String(data.nombre ?? '').trim();
  if (!nombre) {
    return new Response(JSON.stringify({ error: 'El nombre es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slug = String(data.slug || '').trim() || toSlug(nombre);
  const filePath = join(process.cwd(), 'src', 'content', 'programas', `${slug}.yaml`);

  const content = {
    nombre,
    estado: data.estado ?? 'Activo',
    bajada: data.bajada ?? '',
    detalle: data.detalle ?? '',
    icono: data.icono ?? 'HeartHandshake',
    orden: Number(data.orden) || 99,
    tienePagina: data.tienePagina !== false,
    externalHref: data.externalHref ?? '',
    kicker: data.kicker ?? nombre,
    titulo: data.titulo ?? '',
    lead: data.lead ?? '',
    parrafos: Array.isArray(data.parrafos) ? data.parrafos.filter(Boolean) : [],
    stats: Array.isArray(data.stats) ? data.stats : [],
    textoApoyo: data.textoApoyo ?? '',
    imagen: '',
    galeria: [],
  };

  try {
    mkdirSync(join(process.cwd(), 'src', 'content', 'programas'), { recursive: true });
    writeFileSync(filePath, yaml.dump(content, { lineWidth: 80, forceQuotes: false }), 'utf8');
    return new Response(JSON.stringify({ ok: true, slug, path: filePath }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
