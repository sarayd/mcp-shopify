import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ThemeUpdateInputDataSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['DEVELOPMENT', 'LIVE', 'UNPUBLISHED']).optional(),
  processing: z.boolean().optional()
});
type ThemeUpdateInputData = z.infer<typeof ThemeUpdateInputDataSchema>;

const ThemeUpdateInputSchema = z.object({
  id: z.string().min(1, "Theme ID is required"),
  input: ThemeUpdateInputDataSchema
});
type ThemeUpdateInput = z.infer<typeof ThemeUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const themeUpdate = {
  name: "theme-update",
  description: "Update a theme's properties",
  schema: ThemeUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ThemeUpdateInput) => {
    const query = gql`
      mutation themeUpdate($id: ID!, $input: ThemeInput!) {
        themeUpdate(id: $id, input: $input) {
          theme {
            id
            name
            role
            processing
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
      return response.themeUpdate;
    } catch (error) {
      console.error("Error updating theme:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { themeUpdate };