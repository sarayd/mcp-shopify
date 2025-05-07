import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const StorefrontAccessTokenInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
type StorefrontAccessTokenInput = z.infer<typeof StorefrontAccessTokenInputSchema>;

let shopifyClient: GraphQLClient;

const storefrontAccessTokenCreate = {
  name: "storefront-access-token-create",
  description: "Create a new Storefront Access Token",
  schema: StorefrontAccessTokenInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StorefrontAccessTokenInput) => {
    const query = gql`
      mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
        storefrontAccessTokenCreate(input: $input) {
          storefrontAccessToken {
            accessToken
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.storefrontAccessTokenCreate;
    } catch (error) {
      console.error("Error creating storefront access token:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { storefrontAccessTokenCreate };