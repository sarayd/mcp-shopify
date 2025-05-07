import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ThemeCreateInputSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  role: z.enum(['DEVELOPMENT', 'LIVE', 'UNPUBLISHED']).optional(),
  source: z.string().url("Source must be a valid URL"),
  themeStoreId: z.number().int().positive().optional()
});
type ThemeCreateInput = z.infer<typeof ThemeCreateInputSchema>;

let shopifyClient: GraphQLClient;

const themeCreate = {
  name: "theme-create",
  description: "Create a new theme in Shopify",
  schema: ThemeCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ThemeCreateInput) => {
    const query = gql`
      mutation themeCreate($input: ThemeCreateInput!) {
        themeCreate(input: $input) {
          theme {
            id
            name
            role
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        name: input.name,
        role: input.role,
        source: input.source,
        themeStoreId: input.themeStoreId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.themeCreate;
    } catch (error) {
      console.error("Error creating theme:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { themeCreate };