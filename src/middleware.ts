import { defineMiddleware } from 'astro:middleware';

const SESSION_COOKIE = 'renacer_admin';

function getExpectedToken() {
  const user = import.meta.env.ADMIN_USER ?? 'admin';
  const pass = import.meta.env.ADMIN_PASS ?? '';
  return `${user}::${pass}`;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;
  const path = url.pathname;

  // Solo protege rutas del panel admin y su API
  // Excluye /admin-login y /admin-logout (páginas públicas de auth)
  const isProtected =
    path.startsWith('/keystatic') ||
    path.startsWith('/api/keystatic') ||
    (path.startsWith('/admin') && !path.startsWith('/admin-'));

  if (!isProtected) {
    return next();
  }

  const session = cookies.get(SESSION_COOKIE);
  if (session?.value === getExpectedToken()) {
    return next();
  }

  // Sin sesión válida → redirige al login
  const loginUrl = new URL('/admin-login', url.origin);
  loginUrl.searchParams.set('redirect', path);
  return context.redirect(loginUrl.toString());
});
