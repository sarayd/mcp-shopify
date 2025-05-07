import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ServerPixelDeleteInputSchema = z.object({
  id: z.string().min(1, "Pixel ID is required")
});
type ServerPixelDeleteInput = z.infer<typeof ServerPixelDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const serverPixelDelete = {
  name: "server-pixel-delete",
  description: "Delete a server-side pixel",
  schema: ServerPixelDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ServerPixelDeleteInput) => {
    const query = gql`
      mutation serverPixelDelete($id: ID!) {
        serverPixelDelete(id: $id) {
          deletedServerPixelId
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
      return response.serverPixelDelete;
    } catch (error) {
      console.error("Error deleting server pixel:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { serverPixelDelete };