import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CatalogDeleteInputSchema = z.object({
  id: z.string().min(1, "ID is required")
});
type CatalogDeleteInput = z.infer<typeof CatalogDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const catalogDelete = {
  name: "catalog-delete",
  description: "Delete a catalog item in Shopify",
  schema: CatalogDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CatalogDeleteInput) => {
    const query = gql`
      mutation catalogDelete($id: ID!) {
        catalogDelete(id: $id) {
          deletedId
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
      return response.catalogDelete;
    } catch (error) {
      console.error("Error executing catalogDelete:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { catalogDelete };