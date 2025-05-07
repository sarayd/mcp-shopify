import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionContractSetNextBillingDateInputSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  date: z.string().min(1, "Date is required")
});
type SubscriptionContractSetNextBillingDateInput = z.infer<typeof SubscriptionContractSetNextBillingDateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractSetNextBillingDate = {
  name: "subscription-contract-set-next-billing-date",
  description: "Set the next billing date for a subscription contract",
  schema: SubscriptionContractSetNextBillingDateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractSetNextBillingDateInput) => {
    const query = gql`
      mutation subscriptionContractSetNextBillingDate($contractId: ID!, $date: DateTime!) {
        subscriptionContractSetNextBillingDate(contractId: $contractId, date: $date) {
          contract {
            id
            nextBillingDate
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      contractId: input.contractId,
      date: input.date
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionContractSetNextBillingDate;
    } catch (error) {
      console.error("Error setting subscription contract next billing date:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractSetNextBillingDate };