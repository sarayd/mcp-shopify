import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const StorefrontAccessTokenDeleteInputSchema = z.object({
  id: z.string().min(1, "Storefront Access Token ID is required")
});
type StorefrontAccessTokenDeleteInput = z.infer<typeof StorefrontAccessTokenDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const storefrontAccessTokenDelete = {
  name: "storefront-access-token-delete",
  description: "Delete a storefront access token",
  schema: StorefrontAccessTokenDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StorefrontAccessTokenDeleteInput) => {
    const query = gql`
      mutation storefrontAccessTokenDelete($id: ID!) {
        storefrontAccessTokenDelete(id: $id) {
          deletedStorefrontAccessTokenId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.storefrontAccessTokenDelete;
    } catch (error) {
      console.error("Error deleting storefront access token:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { storefrontAccessTokenDelete };