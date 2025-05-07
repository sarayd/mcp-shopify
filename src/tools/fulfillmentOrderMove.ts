import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderMoveInputSchema = z.object({
  fulfillmentOrderId: z.string().min(1, "Fulfillment order ID is required"),
  destinationLocationId: z.string().min(1, "Destination location ID is required")
});
type FulfillmentOrderMoveInput = z.infer<typeof FulfillmentOrderMoveInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderMove = {
  name: "fulfillment-order-move",
  description: "Move a fulfillment order to a new location",
  schema: FulfillmentOrderMoveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderMoveInput) => {
    const query = gql`
      mutation fulfillmentOrderMove($fulfillmentOrderId: ID!, $destinationLocationId: ID!) {
        fulfillmentOrderMove(
          fulfillmentOrderId: $fulfillmentOrderId
          destinationLocationId: $destinationLocationId
        ) {
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
    const variables = {
      fulfillmentOrderId: input.fulfillmentOrderId,
      destinationLocationId: input.destinationLocationId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderMove;
    } catch (error) {
      console.error("Error moving fulfillment order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderMove };