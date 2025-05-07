import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderRejectCancellationRequestInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  message: z.string().optional()
});
type FulfillmentOrderRejectCancellationRequestInput = z.infer<typeof FulfillmentOrderRejectCancellationRequestInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderRejectCancellationRequest = {
  name: "fulfillment-order-reject-cancellation-request",
  description: "Reject a cancellation request for a fulfillment order",
  schema: FulfillmentOrderRejectCancellationRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderRejectCancellationRequestInput) => {
    const query = gql`
      mutation fulfillmentOrderRejectCancellationRequest($id: ID!, $message: String) {
        fulfillmentOrderRejectCancellationRequest(id: $id, message: $message) {
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
      id: input.id,
      message: input.message
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderRejectCancellationRequest;
    } catch (error) {
      console.error("Error rejecting fulfillment order cancellation request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderRejectCancellationRequest };