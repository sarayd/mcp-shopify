import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionContractActivateInputSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required")
});
type SubscriptionContractActivateInput = z.infer<typeof SubscriptionContractActivateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractActivate = {
  name: "subscription-contract-activate",
  description: "Activate a subscription contract",
  schema: SubscriptionContractActivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractActivateInput) => {
    const query = gql`
      mutation subscriptionContractActivate($contractId: ID!) {
        subscriptionContractActivate(contractId: $contractId) {
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
    const variables = { contractId: input.contractId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionContractActivate;
    } catch (error) {
      console.error("Error activating subscription contract:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractActivate };