import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for closing an order
const OrderCloseInputSchema = z.object({
  id: z.string().min(1, "Order ID is required")
});
type OrderCloseInput = z.infer<typeof OrderCloseInputSchema>;

let shopifyClient: GraphQLClient;

const orderClose = {
  name: "close-order",
  description: "Close an open order",
  schema: OrderCloseInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderCloseInput) => {
    const query = gql`
      mutation closeOrder($input: OrderCloseInput!) {
        orderClose(input: $input) {
          order {
            canMarkAsPaid
            cancelReason
            cancelledAt
            clientIp
            confirmed
            customer {
              displayName
              email
            }
            discountCodes
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderClose;
    } catch (error) {
      console.error("Error closing order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderClose };
