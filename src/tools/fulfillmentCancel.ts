import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentCancelInputSchema = z.object({
  id: z.string().min(1, "Fulfillment ID is required"),
  notify: z.boolean().optional()
});
type FulfillmentCancelInput = z.infer<typeof FulfillmentCancelInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentCancel = {
  name: "fulfillment-cancel",
  description: "Cancel a fulfillment",
  schema: FulfillmentCancelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentCancelInput) => {
    const query = gql`
      mutation fulfillmentCancel($input: FulfillmentCancelInput!) {
        fulfillmentCancel(input: $input) {
          fulfillment {
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
      input: {
        fulfillmentId: input.id,
        notify: input.notify
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentCancel;
    } catch (error) {
      console.error("Error canceling fulfillment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentCancel };