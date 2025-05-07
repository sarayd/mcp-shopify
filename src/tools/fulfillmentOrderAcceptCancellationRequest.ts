import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderAcceptCancellationRequestInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  message: z.string().optional()
});
type FulfillmentOrderAcceptCancellationRequestInput = z.infer<typeof FulfillmentOrderAcceptCancellationRequestInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderAcceptCancellationRequest = {
  name: "fulfillment-order-accept-cancellation-request",
  description: "Accept a cancellation request for a fulfillment order",
  schema: FulfillmentOrderAcceptCancellationRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderAcceptCancellationRequestInput) => {
    const query = gql`
      mutation fulfillmentOrderAcceptCancellationRequest($input: FulfillmentOrderAcceptCancellationRequestInput!) {
        fulfillmentOrderAcceptCancellationRequest(input: $input) {
          fulfillmentOrder {
            id
            status
            requestStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id,
        message: input.message
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderAcceptCancellationRequest;
    } catch (error) {
      console.error("Error accepting fulfillment order cancellation request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderAcceptCancellationRequest };