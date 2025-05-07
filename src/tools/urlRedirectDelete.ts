import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UrlRedirectDeleteInputSchema = z.object({
  id: z.string().min(1, "URL redirect ID is required")
});
type UrlRedirectDeleteInput = z.infer<typeof UrlRedirectDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectDelete = {
  name: "url-redirect-delete",
  description: "Delete a URL redirect",
  schema: UrlRedirectDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectDeleteInput) => {
    const query = gql`
      mutation urlRedirectDelete($id: ID!) {
        urlRedirectDelete(id: $id) {
          deletedUrlRedirectId
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
      return response.urlRedirectDelete;
    } catch (error) {
      console.error("Error deleting URL redirect:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectDelete };