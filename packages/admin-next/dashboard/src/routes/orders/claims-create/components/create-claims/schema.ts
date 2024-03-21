import * as zod from "zod"

export const CreateReturnSchema = zod.object({
  returnable_items: zod.object({}),

  location: zod.string(),
  shipping: zod.string(),
  send_notification: zod.boolean().optional(),

  enable_custom_refund: zod.boolean().optional(),
  enable_custom_shipping_price: zod.boolean().optional(),

  custom_refund: zod.number().optional(),
  custom_shipping_price: zod.number().optional(),
})
