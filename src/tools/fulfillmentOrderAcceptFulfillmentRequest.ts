import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderAcceptRequestInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  message: z.string().optional()
});
type FulfillmentOrderAcceptRequestInput = z.infer<typeof FulfillmentOrderAcceptRequestInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderAcceptFulfillmentRequest = {
  name: "fulfillment-order-accept-fulfillment-request",
  description: "Accept a fulfillment request for a fulfillment order",
  schema: FulfillmentOrderAcceptRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderAcceptRequestInput) => {
    const query = gql`
      mutation fulfillmentOrderAcceptFulfillmentRequest($input: FulfillmentOrderAcceptFulfillmentRequestInput!) {
        fulfillmentOrderAcceptFulfillmentRequest(input: $input) {
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
      return response.fulfillmentOrderAcceptFulfillmentRequest;
    } catch (error) {
      console.error("Error accepting fulfillment request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderAcceptFulfillmentRequest };