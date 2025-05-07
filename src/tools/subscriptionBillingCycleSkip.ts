import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionBillingCycleSkipInputSchema = z.object({
  cycleId: z.string().min(1, "Subscription billing cycle ID is required").describe("The ID of the subscription billing cycle to skip")
});
type SubscriptionBillingCycleSkipInput = z.infer<typeof SubscriptionBillingCycleSkipInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleSkip = {
  name: "subscription-billing-cycle-skip",
  description: "Skip a subscription billing cycle",
  schema: SubscriptionBillingCycleSkipInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleSkipInput) => {
    const query = gql`
      mutation subscriptionBillingCycleSkip($cycleId: ID!) {
        subscriptionBillingCycleSkip(cycleId: $cycleId) {
          subscriptionBillingCycle {
            id
            skipped
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { cycleId: input.cycleId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingCycleSkip;
    } catch (error) {
      console.error("Error skipping subscription billing cycle:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleSkip };