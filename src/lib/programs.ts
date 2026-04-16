import { createReader } from '@keystatic/core/reader';
import { imageSize } from 'image-size';
import keystaticConfig from '../../keystatic.config';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const reader = createReader(process.cwd(), keystaticConfig);

type RawProgram = NonNullable<Awaited<ReturnType<typeof reader.collections.programas.read>>>;
type ProgramImage = { src: string; width: number; height: number };

function normalizeName(nombre: RawProgram['nombre']) {
  return typeof nombre === 'string' ? nombre : nombre.name;
}

function getExternalHref(program: RawProgram) {
  return typeof program.externalHref === 'string' ? program.externalHref.trim() : '';
}

function getImageMetadata(src: string): ProgramImage | null {
  if (!src.startsWith('/uploads/')) return null;

  const filePath = join(process.cwd(), 'public', src.replace(/^\/+/, ''));
  if (!existsSync(filePath)) return null;

  const dimensions = imageSize(readFileSync(filePath));
  if (!dimensions.width || !dimensions.height) return null;

  return {
    src,
    width: dimensions.width,
    height: dimensions.height,
  };
}

function getImages(program: RawProgram): ProgramImage[] {
  const primary =
    typeof program.imagen === 'string' && program.imagen.trim().length > 0
      ? [program.imagen.trim()]
      : [];
  const gallery = Array.isArray(program.galeria)
    ? program.galeria.filter(
        (image): image is string => typeof image === 'string' && image.trim().length > 0
      )
    : [];

  return [...primary, ...gallery]
    .map((image) => getImageMetadata(image))
    .filter((image): image is ProgramImage => Boolean(image));
}

function getIcon(program: RawProgram) {
  return typeof program.icono === 'string' && program.icono.trim().length > 0
    ? program.icono.trim()
    : 'HeartHandshake';
}

export async function listPrograms() {
  const slugs = await reader.collections.programas.list();
  const programs = await Promise.all(
    slugs.map(async (slug) => {
      const program = await reader.collections.programas.read(slug);
      if (!program) return null;

      const dynamicHref = `/programas/${slug}/`;
      const externalHref = getExternalHref(program);
      const href = program.tienePagina ? externalHref || dynamicHref : undefined;

      return {
        slug,
        ...program,
        icono: getIcon(program),
        nombreNormalizado: normalizeName(program.nombre),
        dynamicHref,
        href,
        imagenes: getImages(program),
      };
    })
  );

  return programs
    .filter((program): program is NonNullable<typeof program> => Boolean(program))
    .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
}

export async function getProgramBySlug(slug: string) {
  const program = await reader.collections.programas.read(slug);
  if (!program) return null;

  return {
    slug,
    ...program,
    icono: getIcon(program),
    nombreNormalizado: normalizeName(program.nombre),
    dynamicHref: `/programas/${slug}/`,
    externalHrefNormalizado: getExternalHref(program),
    imagenes: getImages(program),
  };
}
