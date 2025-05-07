import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for cancelling an order
const OrderCancelInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  reason: z.enum(["CUSTOMER", "DECLINED", "FRAUD", "INVENTORY", "OTHER", "STAFF"]),
  refund: z.boolean(),
  restock: z.boolean(),
  notifyCustomer: z.boolean(),
  staffNote: z.string().optional()
});
type OrderCancelInput = z.infer<typeof OrderCancelInputSchema>;

let shopifyClient: GraphQLClient;

const orderCancel = {
  name: "cancel-order",
  description: "Cancel an order",
  schema: OrderCancelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderCancelInput) => {
    const query = gql`
      mutation cancelOrder($orderId: ID!, $reason: OrderCancelReason!, $refund: Boolean!, $restock: Boolean!, $notifyCustomer: Boolean!, $staffNote: String) {
        orderCancel(
          orderId: $orderId,
          reason: $reason,
          refund: $refund,
          restock: $restock,
          notifyCustomer: $notifyCustomer,
          staffNote: $staffNote
        ) {
          job { id }
          orderCancelUserErrors { field message }
          userErrors { field message }
        }
      }
    `;
    const variables = {
      orderId: input.orderId,
      reason: input.reason,
      refund: input.refund,
      restock: input.restock,
      notifyCustomer: input.notifyCustomer,
      staffNote: input.staffNote
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderCancel;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderCancel };
