import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BillingCycleSelectorSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  index: z.number().int().nonnegative()
});

const BillingCycleInputSchema = z.object({
  billingDate: z.string().datetime().optional(),
  reason: z.enum(['BUYER_INITIATED', 'MERCHANT_INITIATED', 'OTHER']),
  skip: z.boolean().optional()
});

const SubscriptionBillingCycleScheduleEditInputSchema = z.object({
  selector: BillingCycleSelectorSchema,
  input: BillingCycleInputSchema
});

type SubscriptionBillingCycleScheduleEditInput = z.infer<typeof SubscriptionBillingCycleScheduleEditInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleScheduleEdit = {
  name: "subscription-billing-cycle-schedule-edit",
  description: "Edit a subscription billing cycle schedule",
  schema: SubscriptionBillingCycleScheduleEditInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleScheduleEditInput) => {
    const query = gql`
      mutation subscriptionBillingCycleScheduleEdit(
        $selector: SubscriptionBillingCycleSelectorInput!
        $input: SubscriptionBillingCycleScheduleEditInput!
      ) {
        subscriptionBillingCycleScheduleEdit(
          selector: $selector
          input: $input
        ) {
          billingCycle {
            billingDate
            cycleIndex
            skip
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      selector: {
        contractId: input.selector.contractId,
        index: input.selector.index
      },
      input: {
        billingDate: input.input.billingDate,
        reason: input.input.reason,
        skip: input.input.skip
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingCycleScheduleEdit;
    } catch (error) {
      console.error("Error editing subscription billing cycle schedule:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleScheduleEdit };