import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const SubscriptionBillingCycleBulkChargeInputSchema = z.object({
  subscriptionBillingCycleIds: z.array(z.string()).nonempty("At least one subscription billing cycle ID is required"),
  amount: MoneyInputSchema,
  description: z.string().optional(),
  idempotencyKey: z.string().optional()
});

type SubscriptionBillingCycleBulkChargeInput = z.infer<typeof SubscriptionBillingCycleBulkChargeInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingCycleBulkCharge = {
  name: "subscription-billing-cycle-bulk-charge",
  description: "Create bulk charges for subscription billing cycles",
  schema: SubscriptionBillingCycleBulkChargeInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleBulkChargeInput) => {
    const query = gql`
      mutation subscriptionBillingCycleBulkCharge(
        $subscriptionBillingCycleIds: [ID!]!
        $amount: MoneyInput!
        $description: String
        $idempotencyKey: String
      ) {
        subscriptionBillingCycleBulkCharge(
          subscriptionBillingCycleIds: $subscriptionBillingCycleIds
          amount: $amount
          description: $description
          idempotencyKey: $idempotencyKey
        ) {
          job {
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
      subscriptionBillingCycleIds: input.subscriptionBillingCycleIds,
      amount: input.amount,
      description: input.description,
      idempotencyKey: input.idempotencyKey
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingCycleBulkCharge;
    } catch (error) {
      console.error("Error executing subscriptionBillingCycleBulkCharge:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingCycleBulkCharge };