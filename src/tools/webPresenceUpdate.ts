import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebPresenceUpdateInputSchema = z.object({
  alternateLocales: z.array(z.string()).optional(),
  defaultLocale: z.string().optional(),
  subfolderSuffix: z.string().regex(/^[a-zA-Z0-9]*$/).nullable().optional()
});
type WebPresenceUpdateInput = z.infer<typeof WebPresenceUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const webPresenceUpdate = {
  name: "web-presence-update",
  description: "Update web presence settings for the shop",
  schema: WebPresenceUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: WebPresenceUpdateInput) => {
    const query = gql`
      mutation webPresenceUpdate($input: WebPresenceUpdateInput!) {
        webPresenceUpdate(input: $input) {
          shop {
            id
            webPresence {
              alternateLocales
              defaultLocale
              subfolderSuffix
            }
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
      return response.webPresenceUpdate;
    } catch (error) {
      console.error("Error updating web presence:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { webPresenceUpdate };