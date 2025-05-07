import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BillingPolicyInputSchema = z.object({
  anchors: z.array(z.object({
    day: z.number().int(),
    month: z.number().int().optional(),
    type: z.enum(['EXACT_DAY', 'EXACT_MONTH', 'RELATIVE_DAY'])
  })).optional(),
  interval: z.enum(['DAY', 'MONTH', 'WEEK', 'YEAR']),
  intervalCount: z.number().int()
});

const DeliveryPolicyInputSchema = z.object({
  anchors: z.array(z.object({
    day: z.number().int(),
    month: z.number().int().optional(),
    type: z.enum(['EXACT_DAY', 'EXACT_MONTH', 'RELATIVE_DAY'])
  })).optional(),
  interval: z.enum(['DAY', 'MONTH', 'WEEK', 'YEAR']),
  intervalCount: z.number().int()
});

const SubscriptionBillingCycleContractDraftCommitInputSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
  input: z.object({
    billingCycleCount: z.number().int().optional(),
    billingCycleInterval: z.enum(['DAY', 'MONTH', 'WEEK', 'YEAR']).optional(),
    billingPolicy: BillingPolicyInputSchema.optional(),
    deliveryPolicy: DeliveryPolicyInputSchema.optional(),
    nextBillingDate: z.string().optional(),
    note: z.string().optional(),
    sellingPlanId: z.string()
  })
});

type SubscriptionBillingCycleContractDraftCommitInput = z.infer<typeof SubscriptionBillingCycleContractDraftCommitInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleContractDraftCommit = {
  name: "subscription-billing-cycle-contract-draft-commit",
  description: "Commits a draft of a subscription billing cycle contract",
  schema: SubscriptionBillingCycleContractDraftCommitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleContractDraftCommitInput) => {
    const query = gql`
      mutation subscriptionBillingCycleContractDraftCommit($draftId: ID!, $input: SubscriptionBillingCycleContractInput!) {
        subscriptionBillingCycleContractDraftCommit(draftId: $draftId, input: $input) {
          contract {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      draftId: input.draftId,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingCycleContractDraftCommit;
    } catch (error) {
      console.error("Error committing subscription billing cycle contract draft:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleContractDraftCommit };