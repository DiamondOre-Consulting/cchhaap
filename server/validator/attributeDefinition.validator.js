import {z} from "zod"





export const createAttributeDefinitionSchema = z.object({
      category: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ID format" }),
      attributes: z.array(z.object({
        name: z.string(),
        options: z.array(z.string())
      }))
})