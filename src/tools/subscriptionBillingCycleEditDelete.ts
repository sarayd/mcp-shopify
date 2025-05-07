import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BillingCycleSelectorSchema = z.object({
  billingCycleCount: z.number().int(),
  interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
  intervalCount: z.number().int()
});

const SubscriptionBillingCycleEditDeleteInputSchema = z.object({
  billingCycleInput: z.object({
    contractId: z.string().min(1, "Contract ID is required"),
    selector: z.object({
      index: z.number().int().min(0, "Index must be non-negative")
    })
  })
});

type SubscriptionBillingCycleEditDeleteInput = z.infer<typeof SubscriptionBillingCycleEditDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleEditDelete = {
  name: "subscription-billing-cycle-edit-delete",
  description: "Delete a specific billing cycle from a subscription contract",
  schema: SubscriptionBillingCycleEditDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleEditDeleteInput) => {
    const query = gql`
      mutation subscriptionBillingCycleEditDelete($billingCycleInput: SubscriptionBillingCycleEditDeleteInput!) {
        subscriptionBillingCycleEditDelete(billingCycleInput: $billingCycleInput) {
          billingCycles {
            cycleStartAt
            cycleEndAt
            cycleIndex
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.subscriptionBillingCycleEditDelete;
    } catch (error) {
      console.error("Error executing subscriptionBillingCycleEditDelete:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleEditDelete };