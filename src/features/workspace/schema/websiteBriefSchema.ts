import { z } from "zod";

export const websiteBriefSchema = z.object({
  businessName: z
    .string()
    .min(2, "Introduce el nombre del negocio."),

  contactName: z
    .string()
    .min(2, "Introduce un nombre."),

  email: z
    .email("Email no válido."),

  phone: z.string().optional(),
});

export type WebsiteBriefForm = z.infer<typeof websiteBriefSchema>;