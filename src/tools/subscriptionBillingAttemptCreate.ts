import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionBillingAttemptInputSchema = z.object({
  billingCycleSelector: z.object({
    index: z.number().int()
  }),
  idempotencyKey: z.string().optional(),
  originTime: z.string().datetime().optional()
});

const SubscriptionBillingAttemptCreateInputSchema = z.object({
  subscriptionContractId: z.string().min(1, "Subscription Contract ID is required"),
  input: SubscriptionBillingAttemptInputSchema
});

type SubscriptionBillingAttemptCreateInput = z.infer<typeof SubscriptionBillingAttemptCreateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionBillingAttemptCreate = {
  name: "subscription-billing-attempt-create",
  description: "Create a subscription billing attempt",
  schema: SubscriptionBillingAttemptCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingAttemptCreateInput) => {
    const query = gql`
      mutation subscriptionBillingAttemptCreate($subscriptionContractId: ID!, $input: SubscriptionBillingAttemptInput!) {
        subscriptionBillingAttemptCreate(
          subscriptionContractId: $subscriptionContractId
          subscriptionBillingAttemptInput: $input
        ) {
          subscriptionBillingAttempt {
            id
            ready
            errorCode
            errorMessage
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      subscriptionContractId: input.subscriptionContractId,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionBillingAttemptCreate;
    } catch (error) {
      console.error("Error creating subscription billing attempt:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionBillingAttemptCreate };