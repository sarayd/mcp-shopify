import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UrlRedirectBulkDeleteAllInputSchema = z.object({
  shopId: z.string().optional()
});
type UrlRedirectBulkDeleteAllInput = z.infer<typeof UrlRedirectBulkDeleteAllInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectBulkDeleteAll = {
  name: "url-redirect-bulk-delete-all",
  description: "Delete all URL redirects in the shop",
  schema: UrlRedirectBulkDeleteAllInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectBulkDeleteAllInput) => {
    const query = gql`
      mutation urlRedirectBulkDeleteAll($input: UrlRedirectBulkDeleteAllInput!) {
        urlRedirectBulkDeleteAll(input: $input) {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.urlRedirectBulkDeleteAll;
    } catch (error) {
      console.error("Error deleting URL redirects:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectBulkDeleteAll };