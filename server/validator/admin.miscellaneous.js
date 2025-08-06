import {z} from "zod"


export const getSingleUserForAdminParamsSchema = z.object({
      userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
})

export const getSalesDataParamsData = z.object({
    limit:z.string().min(1,"Limit is missing"),
    page:z.string().min(1,"page number is missing")
})

export const getSalesDataQuerySchema = z.object({
    orderStatus: z.string().optional(),
})



export const getLineChartSalesDataQuerySchema = z.object({
  year: z.coerce.number().int().gte(2024, "Year must be >= 2024"),
});