import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionBillingCycleUnskipInputSchema = z.object({
  id: z.string().min(1, "Subscription billing cycle ID is required").describe("The ID of the subscription billing cycle to unskip")
});
type SubscriptionBillingCycleUnskipInput = z.infer<typeof SubscriptionBillingCycleUnskipInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleUnskip = {
  name: "subscription-billing-cycle-unskip",
  description: "Unskip a subscription billing cycle that was previously skipped",
  schema: SubscriptionBillingCycleUnskipInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleUnskipInput) => {
    const query = gql`
      mutation subscriptionBillingCycleUnskip($id: ID!) {
        subscriptionBillingCycleUnskip(id: $id) {
          subscriptionBillingCycle {
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
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingCycleUnskip;
    } catch (error) {
      console.error("Error unskipping subscription billing cycle:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleUnskip };