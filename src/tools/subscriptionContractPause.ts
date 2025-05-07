import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionContractPauseInputSchema = z.object({
  id: z.string().min(1, "Subscription contract ID is required"),
  reason: z.string().optional()
});
type SubscriptionContractPauseInput = z.infer<typeof SubscriptionContractPauseInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractPause = {
  name: "subscription-contract-pause",
  description: "Pause a subscription contract",
  schema: SubscriptionContractPauseInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractPauseInput) => {
    const query = gql`
      mutation subscriptionContractPause($id: ID!, $reason: String) {
        subscriptionContractPause(id: $id, reason: $reason) {
          contract {
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
      reason: input.reason
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionContractPause;
    } catch (error) {
      console.error("Error pausing subscription contract:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractPause };