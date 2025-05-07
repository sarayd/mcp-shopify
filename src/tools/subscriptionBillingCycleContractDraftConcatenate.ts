import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BillingCycleContractInputSchema = z.object({
  billingCycleCount: z.number().int().min(1),
  interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
  deliveryPrice: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional(),
  price: z.object({
    amount: z.number(),
    currencyCode: z.string()
  })
});

const SubscriptionBillingCycleContractDraftConcatenateInputSchema = z.object({
  concatenatedBillingCycleContracts: z.array(BillingCycleContractInputSchema).nonempty("At least one billing cycle contract is required"),
  subscriptionContractId: z.string().min(1, "Subscription contract ID is required")
});

type SubscriptionBillingCycleContractDraftConcatenateInput = z.infer<typeof SubscriptionBillingCycleContractDraftConcatenateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleContractDraftConcatenate = {
  name: "subscription-billing-cycle-contract-draft-concatenate",
  description: "Concatenate billing cycle contracts for a subscription contract draft",
  schema: SubscriptionBillingCycleContractDraftConcatenateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleContractDraftConcatenateInput) => {
    const query = gql`
      mutation subscriptionBillingCycleContractDraftConcatenate($input: SubscriptionBillingCycleContractDraftConcatenateInput!) {
        subscriptionBillingCycleContractDraftConcatenate(input: $input) {
          draft {
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
      input: {
        concatenatedBillingCycleContracts: input.concatenatedBillingCycleContracts.map(contract => ({
          billingCycleCount: contract.billingCycleCount,
          interval: contract.interval,
          deliveryPrice: contract.deliveryPrice,
          price: contract.price
        })),
        subscriptionContractId: input.subscriptionContractId
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingCycleContractDraftConcatenate;
    } catch (error) {
      console.error("Error concatenating subscription billing cycle contract draft:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleContractDraftConcatenate };