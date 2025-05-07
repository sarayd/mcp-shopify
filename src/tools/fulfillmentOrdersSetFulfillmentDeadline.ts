import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrdersSetFulfillmentDeadlineInputSchema = z.object({
  fulfillmentDeadline: z.string().datetime(),
  fulfillmentOrderIds: z.array(z.string()).nonempty("At least one fulfillment order ID is required")
});
type FulfillmentOrdersSetFulfillmentDeadlineInput = z.infer<typeof FulfillmentOrdersSetFulfillmentDeadlineInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrdersSetFulfillmentDeadline = {
  name: "fulfillment-orders-set-fulfillment-deadline",
  description: "Set fulfillment deadline for fulfillment orders",
  schema: FulfillmentOrdersSetFulfillmentDeadlineInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrdersSetFulfillmentDeadlineInput) => {
    const query = gql`
      mutation fulfillmentOrdersSetFulfillmentDeadline($fulfillmentDeadline: DateTime!, $fulfillmentOrderIds: [ID!]!) {
        fulfillmentOrdersSetFulfillmentDeadline(
          fulfillmentDeadline: $fulfillmentDeadline
          fulfillmentOrderIds: $fulfillmentOrderIds
        ) {
          fulfillmentOrders {
            id
            fulfillmentDeadline
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      fulfillmentDeadline: input.fulfillmentDeadline,
      fulfillmentOrderIds: input.fulfillmentOrderIds
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrdersSetFulfillmentDeadline;
    } catch (error) {
      console.error("Error setting fulfillment deadline:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrdersSetFulfillmentDeadline };