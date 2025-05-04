import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ScriptTagInputSchema = z.object({
  cache: z.boolean().optional(),
  displayScope: z.enum(['ALL', 'ONLINE_STORE', 'ORDER_STATUS']).optional(),
  src: z.string().url("Source URL must be a valid URL")
});
type ScriptTagInput = z.infer<typeof ScriptTagInputSchema>;

let shopifyClient: GraphQLClient;

const scriptTagCreate = {
  name: "script-tag-create",
  description: "Create a script tag for your shop",
  schema: ScriptTagInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ScriptTagInput) => {
    const query = gql`
      mutation scriptTagCreate($input: ScriptTagInput!) {
        scriptTagCreate(input: $input) {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.scriptTagCreate;
    } catch (error) {
      console.error("Error creating script tag:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { scriptTagCreate };