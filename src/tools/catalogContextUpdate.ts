import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ContextInputSchema = z.object({
  country: z.string().optional(),
  language: z.string().optional(),
  preview: z.boolean().optional()
});

const CatalogContextUpdateInputSchema = z.object({
  id: z.string().min(1, "ID is required"),
  context: ContextInputSchema
});
type CatalogContextUpdateInput = z.infer<typeof CatalogContextUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const catalogContextUpdate = {
  name: "catalog-context-update",
  description: "Update the context of a catalog",
  schema: CatalogContextUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CatalogContextUpdateInput) => {
    const query = gql`
      mutation catalogContextUpdate($id: ID!, $context: CatalogContextInput!) {
        catalogContextUpdate(id: $id, context: $context) {
          catalog {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      context: input.context
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.catalogContextUpdate;
    } catch (error) {
      console.error("Error updating catalog context:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { catalogContextUpdate };