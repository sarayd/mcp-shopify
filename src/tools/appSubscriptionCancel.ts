import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AppSubscriptionCancelInputSchema = z.object({
  id: z.string().min(1, "Subscription ID is required"),
  prorate: z.boolean().optional()
});
type AppSubscriptionCancelInput = z.infer<typeof AppSubscriptionCancelInputSchema>;

let shopifyClient: GraphQLClient;

const appSubscriptionCancel = {
  name: "app-subscription-cancel",
  description: "Cancel an app subscription",
  schema: AppSubscriptionCancelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: AppSubscriptionCancelInput) => {
    const query = gql`
      mutation appSubscriptionCancel($id: ID!, $prorate: Boolean) {
        appSubscriptionCancel(id: $id, prorate: $prorate) {
          appSubscription {
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
      id: input.id,
      prorate: input.prorate
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.appSubscriptionCancel;
    } catch (error) {
      console.error("Error canceling app subscription:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { appSubscriptionCancel };