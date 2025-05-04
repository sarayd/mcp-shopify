import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetaobjectDefinitionDeleteInputSchema = z.object({
  id: z.string().min(1, "Metaobject definition ID is required")
});
type MetaobjectDefinitionDeleteInput = z.infer<typeof MetaobjectDefinitionDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectDefinitionDelete = {
  name: "metaobject-definition-delete",
  description: "Delete a metaobject definition",
  schema: MetaobjectDefinitionDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectDefinitionDeleteInput) => {
    const query = gql`
      mutation metaobjectDefinitionDelete($id: ID!) {
        metaobjectDefinitionDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
            code
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metaobjectDefinitionDelete;
    } catch (error) {
      console.error("Error deleting metaobject definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectDefinitionDelete };