import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebPresenceCreateInputSchema = z.object({
  alternateLocales: z.array(z.string()).optional(),
  defaultLocale: z.string(),
  domainId: z.string().optional(),
  subfolderSuffix: z.string().optional()
}).refine(
  (data) => !(data.domainId && data.subfolderSuffix),
  "Cannot provide both domainId and subfolderSuffix"
);

type WebPresenceCreateInput = z.infer<typeof WebPresenceCreateInputSchema>;

let shopifyClient: GraphQLClient;

const webPresenceCreate = {
  name: "web-presence-create",
  description: "Create a web presence for a shop",
  schema: WebPresenceCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: WebPresenceCreateInput) => {
    const query = gql`
      mutation webPresenceCreate($input: WebPresenceCreateInput!) {
        webPresenceCreate(input: $input) {
          userErrors {
            field
            message
          }
          webPresence {
            id
            alternateLocales
            defaultLocale
            domain {
              id
            }
            subfolderSuffix
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.webPresenceCreate;
    } catch (error) {
      console.error("Error creating web presence:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { webPresenceCreate };