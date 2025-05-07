import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldDefinitionDeleteInputSchema = z.object({
  id: z.string().min(1, "Metafield definition ID is required"),
  deleteAllAssociatedMetafields: z.boolean().default(false).optional()
});
type MetafieldDefinitionDeleteInput = z.infer<typeof MetafieldDefinitionDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const metafieldDefinitionDelete = {
  name: "metafield-definition-delete",
  description: "Delete a metafield definition",
  schema: MetafieldDefinitionDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetafieldDefinitionDeleteInput) => {
    const query = gql`
      mutation metafieldDefinitionDelete($id: ID!, $deleteAllAssociatedMetafields: Boolean) {
        metafieldDefinitionDelete(
          id: $id
          deleteAllAssociatedMetafields: $deleteAllAssociatedMetafields
        ) {
          deletedDefinitionId
          userErrors {
            field
            message
            code
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      deleteAllAssociatedMetafields: input.deleteAllAssociatedMetafields
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metafieldDefinitionDelete;
    } catch (error) {
      console.error("Error deleting metafield definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metafieldDefinitionDelete };