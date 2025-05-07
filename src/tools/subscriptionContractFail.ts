import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionContractFailInputSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  reason: z.string().min(1, "Reason is required")
});
type SubscriptionContractFailInput = z.infer<typeof SubscriptionContractFailInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractFail = {
  name: "subscription-contract-fail",
  description: "Mark a subscription contract as failed",
  schema: SubscriptionContractFailInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractFailInput) => {
    const query = gql`
      mutation subscriptionContractFail($input: SubscriptionContractFailInput!) {
        subscriptionContractFail(input: $input) {
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
    const variables = {
      input: {
        contractId: input.contractId,
        reason: input.reason
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionContractFail;
    } catch (error) {
      console.error("Error marking subscription contract as failed:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractFail };