/**
 * @schema AdminOrderChangeAction
 * type: object
 * description: The action's details.
 * x-schemaName: AdminOrderChangeAction
 * properties:
 *   order_change:
 *     $ref: "#/components/schemas/AdminOrderChange"
 *   id:
 *     type: string
 *     title: id
 *     description: The action's ID.
 *   order_change_id:
 *     type: string
 *     title: order_change_id
 *     description: The ID of the order change this action belongs to.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the associated order.
 *   reference:
 *     type: string
 *     title: reference
 *     description: The name of the table this action applies on.
 *     enum:
 *       - claim
 *       - exchange
 *       - return
 *       - order_shipping_method
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of the record in the referenced table.
 *   action:
 *     type: string
 *     title: action
 *     description: The applied action.
 *   details:
 *     type: object
 *     description: The action's details.
 *     example:
 *       reference_id: 123
 *       quantity: 1
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed only by admin users.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the order change action was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the order change action was updated.
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the associated return.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The ID of the associated claim.
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The ID of the associated exchange.
 *   order:
 *     $ref: "#/components/schemas/BaseOrder"
 * required:
 *   - order_change
 *   - id
 *   - order_change_id
 *   - order_id
 *   - reference
 *   - reference_id
 *   - action
 *   - details
 *   - internal_note
 *   - created_at
 *   - updated_at
 *   - return_id
 *   - claim_id
 *   - exchange_id
 *   - order
 * 
*/

