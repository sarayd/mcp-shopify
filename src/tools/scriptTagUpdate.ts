import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ScriptTagInputSchema = z.object({
  cache: z.boolean().optional(),
  displayScope: z.enum(['ALL', 'ORDER_STATUS', 'ONLINE_STORE']).optional(),
  src: z.string().url().optional()
});
type ScriptTagInput = z.infer<typeof ScriptTagInputSchema>;

const ScriptTagUpdateInputSchema = z.object({
  id: z.string().min(1, "Script tag ID is required"),
  input: ScriptTagInputSchema
});
type ScriptTagUpdateInput = z.infer<typeof ScriptTagUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const scriptTagUpdate = {
  name: "script-tag-update",
  description: "Update a script tag",
  schema: ScriptTagUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ScriptTagUpdateInput) => {
    const query = gql`
      mutation scriptTagUpdate($id: ID!, $input: ScriptTagInput!) {
        scriptTagUpdate(id: $id, input: $input) {
          scriptTag {
            id
            cache
            createdAt
            displayScope
            src
            updatedAt
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.scriptTagUpdate;
    } catch (error) {
      console.error("Error updating script tag:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { scriptTagUpdate };