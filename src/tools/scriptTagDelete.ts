import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ScriptTagDeleteInputSchema = z.object({
  id: z.string().min(1, "Script tag ID is required")
});
type ScriptTagDeleteInput = z.infer<typeof ScriptTagDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const scriptTagDelete = {
  name: "script-tag-delete",
  description: "Delete a script tag",
  schema: ScriptTagDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ScriptTagDeleteInput) => {
    const query = gql`
      mutation scriptTagDelete($id: ID!) {
        scriptTagDelete(id: $id) {
          deletedScriptTagId
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
      return response.scriptTagDelete;
    } catch (error) {
      console.error("Error deleting script tag:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { scriptTagDelete };