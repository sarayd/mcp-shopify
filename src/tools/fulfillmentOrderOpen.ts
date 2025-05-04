import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderOpenInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
});
type FulfillmentOrderOpenInput = z.infer<typeof FulfillmentOrderOpenInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderOpen = {
  name: "fulfillment-order-open",
  description: "Opens a closed fulfillment order",
  schema: FulfillmentOrderOpenInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderOpenInput) => {
    const query = gql`
      mutation fulfillmentOrderOpen($id: ID!) {
        fulfillmentOrderOpen(id: $id) {
          fulfillmentOrder {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderOpen;
    } catch (error) {
      console.error("Error opening fulfillment order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderOpen };