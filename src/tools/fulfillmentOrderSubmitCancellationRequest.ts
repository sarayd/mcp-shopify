import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderSubmitCancellationRequestInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  message: z.string().optional()
});
type FulfillmentOrderSubmitCancellationRequestInput = z.infer<typeof FulfillmentOrderSubmitCancellationRequestInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderSubmitCancellationRequest = {
  name: "fulfillment-order-submit-cancellation-request",
  description: "Submit a cancellation request for a fulfillment order",
  schema: FulfillmentOrderSubmitCancellationRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderSubmitCancellationRequestInput) => {
    const query = gql`
      mutation fulfillmentOrderSubmitCancellationRequest($input: FulfillmentOrderSubmitCancellationRequestInput!) {
        fulfillmentOrderSubmitCancellationRequest(input: $input) {
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
      return response.fulfillmentOrderSubmitCancellationRequest;
    } catch (error) {
      console.error("Error submitting fulfillment order cancellation request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderSubmitCancellationRequest };