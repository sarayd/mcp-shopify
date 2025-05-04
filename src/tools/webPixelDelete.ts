import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebPixelDeleteInputSchema = z.object({
  id: z.string().min(1, "Web Pixel ID is required")
});
type WebPixelDeleteInput = z.infer<typeof WebPixelDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const webPixelDelete = {
  name: "web-pixel-delete",
  description: "Delete a web pixel",
  schema: WebPixelDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: WebPixelDeleteInput) => {
    const query = gql`
      mutation webPixelDelete($id: ID!) {
        webPixelDelete(id: $id) {
          deletedWebPixelId
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
      return response.webPixelDelete;
    } catch (error) {
      console.error("Error deleting web pixel:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { webPixelDelete };