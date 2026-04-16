import { defineCollection, z } from 'astro:content';

const programas = defineCollection({
  type: 'data',
  schema: z.object({
    nombre: z.string(),
    estado: z.string(),
    bajada: z.string(),
    detalle: z.string(),
    icono: z.string().optional().default('HeartHandshake'),
    orden: z.number(),
    tienePagina: z.boolean(),
    externalHref: z.string().optional().default(''),
    kicker: z.string().optional().default(''),
    titulo: z.string().optional().default(''),
    lead: z.string().optional().default(''),
    parrafos: z.array(z.string()).optional().default([]),
    stats: z
      .array(
        z.object({
          valor: z.string(),
          etiqueta: z.string(),
        })
      )
      .optional()
      .default([]),
    textoApoyo: z.string().optional().default(''),
    imagen: z.string().optional().default(''),
    galeria: z.array(z.string()).optional().default([]),
  }),
});

export const collections = {
  programas,
};
