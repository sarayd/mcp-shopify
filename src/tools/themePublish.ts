import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ThemePublishInputSchema = z.object({
  id: z.string().min(1, "Theme ID is required").describe("The ID of the theme to publish")
});
type ThemePublishInput = z.infer<typeof ThemePublishInputSchema>;

let shopifyClient: GraphQLClient;

const themePublish = {
  name: "theme-publish",
  description: "Publish a theme",
  schema: ThemePublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ThemePublishInput) => {
    const query = gql`
      mutation themePublish($id: ID!) {
        themePublish(id: $id) {
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
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.themePublish;
    } catch (error) {
      console.error("Error publishing theme:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { themePublish };