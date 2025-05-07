import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DraftOrderCreateFromOrderInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required")
});

type DraftOrderCreateFromOrderInput = z.infer<typeof DraftOrderCreateFromOrderInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderCreateFromOrder = {
  name: "draft-order-create-from-order",
  description: "Create a draft order from an existing order",
  schema: DraftOrderCreateFromOrderInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderCreateFromOrderInput) => {
    const query = gql`
      mutation draftOrderCreateFromOrder($orderId: ID!) {
        draftOrderCreateFromOrder(orderId: $orderId) {
          draftOrder {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { orderId: input.orderId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.draftOrderCreateFromOrder;
    } catch (error) {
      console.error("Error creating draft order from order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderCreateFromOrder };