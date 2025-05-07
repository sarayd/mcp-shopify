import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ServerPixelCreateInputSchema = z.object({
  input: z.object({
    app: z.object({
      id: z.string()
    }).optional(),
    data: z.string(),
    timestamp: z.string().datetime().optional()
  })
});
type ServerPixelCreateInput = z.infer<typeof ServerPixelCreateInputSchema>;

let shopifyClient: GraphQLClient;

const serverPixelCreate = {
  name: "server-pixel-create",
  description: "Create a server-side pixel event",
  schema: ServerPixelCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ServerPixelCreateInput) => {
    const query = gql`
      mutation serverPixelCreate($input: ServerPixelCreateInput!) {
        serverPixelCreate(input: $input) {
          serverPixel {
            id
            app {
              id
            }
            data
            timestamp
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    try {
      const response: any = await shopifyClient.request(query, input);
      return response.serverPixelCreate;
    } catch (error) {
      console.error("Error creating server pixel:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { serverPixelCreate };