import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DelegateAccessTokenDestroyInputSchema = z.object({
  delegateAccessToken: z.string().min(1, "Delegate access token is required"),
  shopId: z.string().min(1, "Shop ID is required")
});
type DelegateAccessTokenDestroyInput = z.infer<typeof DelegateAccessTokenDestroyInputSchema>;

let shopifyClient: GraphQLClient;

const delegateAccessTokenDestroy = {
  name: "delegate-access-token-destroy",
  description: "Revoke a delegate access token",
  schema: DelegateAccessTokenDestroyInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DelegateAccessTokenDestroyInput) => {
    const query = gql`
      mutation delegateAccessTokenDestroy($input: DelegateAccessTokenDestroyInput!) {
        delegateAccessTokenDestroy(input: $input) {
          deletedDelegateAccessTokenId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        delegateAccessToken: input.delegateAccessToken,
        shopId: input.shopId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.delegateAccessTokenDestroy;
    } catch (error) {
      console.error("Error destroying delegate access token:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { delegateAccessTokenDestroy };