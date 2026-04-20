import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Admin Renacer',
    },
  },
  collections: {
    programas: collection({
      label: 'Programas',
      slugField: 'nombre',
      path: 'src/content/programas/*',
      format: { data: 'yaml' },
      schema: {
        nombre: fields.slug({
          name: { label: 'Nombre del programa' },
          slug: { label: 'Slug (URL)' },
        }),

        // ── Tarjeta en el landing ─────────────────────────────────────
        estado: fields.select({
          label: 'Estado',
          options: [
            { label: 'Activo', value: 'Activo' },
            { label: 'Vacaciones', value: 'Vacaciones' },
            { label: 'Anual', value: 'Anual' },
            { label: 'Temporada', value: 'Temporada' },
            { label: 'En planificación', value: 'En planificación' },
          ],
          defaultValue: 'Activo',
        }),
        bajada: fields.text({
          label: 'Resumen corto (opcional)',
          description: 'Campo editorial secundario. Ya no se muestra en la tarjeta pública.',
        }),
        detalle: fields.text({
          label: 'Descripción breve',
          description: 'Texto que sí aparece en la tarjeta del landing, bajo el título.',
          multiline: true,
          validation: { isRequired: true },
        }),
        icono: fields.select({
          label: 'Icono de la tarjeta',
          description: 'Se muestra dentro del círculo de la tarjeta del programa.',
          options: [
            { label: 'Manos y apoyo', value: 'HeartHandshake' },
            { label: 'Alimentación', value: 'UtensilsCrossed' },
            { label: 'Canasta / apoyo', value: 'Package' },
            { label: 'Vestimenta', value: 'Shirt' },
            { label: 'Naturaleza', value: 'Sprout' },
            { label: 'Regalo / campaña', value: 'Gift' },
            { label: 'Juego e infancia', value: 'Puzzle' },
            { label: 'Comunidad', value: 'Users' },
            { label: 'Inclusión', value: 'HandHelping' },
          ],
          defaultValue: 'HeartHandshake',
        }),
        orden: fields.integer({
          label: 'Orden en landing',
          description: 'Número de posición (menor = primero). Ej: 1, 2, 3…',
          defaultValue: 99,
          validation: { isRequired: true },
        }),

        // ── Configuración de página ───────────────────────────────────
        tienePagina: fields.checkbox({
          label: '¿Tiene página propia?',
          description: 'Desmarcar para programas en planificación sin página',
          defaultValue: true,
        }),
        externalHref: fields.text({
          label: 'URL externa o personalizada (opcional)',
          description: 'Déjalo vacío para usar automáticamente /programas/slug/.',
        }),

        // ── Contenido de la página ────────────────────────────────────
        kicker: fields.text({
          label: 'Kicker (nombre corto para la página)',
          description: 'Aparece sobre el título principal',
        }),
        titulo: fields.text({
          label: 'Título de la página',
          description: 'Título largo y descriptivo',
        }),
        lead: fields.text({
          label: 'Párrafo introductorio (lead)',
          description: 'Párrafo destacado que aparece bajo el título',
          multiline: true,
        }),
        parrafos: fields.array(
          fields.text({ label: 'Párrafo', multiline: true }),
          {
            label: 'Párrafos del cuerpo',
            description: 'Agrega los párrafos del contenido principal',
            itemLabel: (props) => {
              const val = props.value ?? '';
              return val.length > 60 ? val.slice(0, 60) + '…' : val || 'Párrafo vacío';
            },
          }
        ),
        stats: fields.array(
          fields.object({
            valor: fields.text({ label: 'Valor o cifra' }),
            etiqueta: fields.text({ label: 'Descripción' }),
          }),
          {
            label: 'Estadísticas (idealmente 4)',
            description: 'Datos clave del programa en formato cifra + descripción',
            itemLabel: (props) => props.fields.valor.value || 'Estadística',
          }
        ),
        textoApoyo: fields.text({
          label: 'Texto de apoyo / cómo colaborar',
          description: 'Texto que aparece en la sección final de la página',
          multiline: true,
        }),
        imagen: fields.image({
          label: 'Imagen principal (opcional)',
          description: 'Portada del hero. Si subes un video, este campo se ignora.',
          directory: 'public/uploads/programas',
          publicPath: '/uploads/programas/',
        }),
        videoHero: fields.file({
          label: 'Video principal (opcional)',
          description: 'Si subes un video (MP4, WebM), reemplaza la imagen en el hero.',
          directory: 'public/uploads/programas',
          publicPath: '/uploads/programas/',
        }),
        galeria: fields.array(
          fields.image({
            label: 'Imagen de galería',
            directory: 'public/uploads/programas',
            publicPath: '/uploads/programas/',
          }),
          {
            label: 'Galería (opcional)',
            description: 'Imágenes secundarias para mostrar debajo del contenido',
            itemLabel: (props) => props.value?.split('/').pop() ?? 'Imagen',
          }
        ),
      },
    }),
  },
});
