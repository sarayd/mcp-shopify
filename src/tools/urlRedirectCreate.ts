import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UrlRedirectInputSchema = z.object({
  path: z.string().min(1, "Path is required"),
  target: z.string().min(1, "Target is required")
});
type UrlRedirectInput = z.infer<typeof UrlRedirectInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectCreate = {
  name: "url-redirect-create",
  description: "Create a URL redirect in Shopify",
  schema: UrlRedirectInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectInput) => {
    const query = gql`
      mutation urlRedirectCreate($input: UrlRedirectInput!) {
        urlRedirectCreate(urlRedirect: $input) {
          urlRedirect {
            id
            path
            target
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
      return response.urlRedirectCreate;
    } catch (error) {
      console.error("Error creating URL redirect:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectCreate };