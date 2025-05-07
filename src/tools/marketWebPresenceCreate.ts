import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketWebPresenceCreateInputSchema = z.object({
  alternateLocales: z.array(z.string()).optional(),
  defaultLocale: z.string(),
  domainId: z.string().optional(),
  subfolderSuffix: z.string().optional()
}).refine(
  (data) => !(data.domainId && data.subfolderSuffix),
  "Cannot provide both domainId and subfolderSuffix"
);

type MarketWebPresenceCreateInput = z.infer<typeof MarketWebPresenceCreateInputSchema>;

let shopifyClient: GraphQLClient;

const marketWebPresenceCreate = {
  name: "market-web-presence-create",
  description: "Create a market web presence",
  schema: MarketWebPresenceCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketWebPresenceCreateInput) => {
    const query = gql`
      mutation marketWebPresenceCreate($input: MarketWebPresenceCreateInput!) {
        marketWebPresenceCreate(input: $input) {
          marketWebPresence {
            id
            alternateLocales
            defaultLocale
            domain {
              id
            }
            subfolderSuffix
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
      return response.marketWebPresenceCreate;
    } catch (error) {
      console.error("Error creating market web presence:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketWebPresenceCreate };