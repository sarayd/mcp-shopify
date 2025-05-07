import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketLocalizationInputSchema = z.object({
  key: z.string().min(1, "Key is required"),
  market: z.object({
    id: z.string().min(1, "Market ID is required")
  }),
  value: z.string().min(1, "Value is required")
});

const MarketLocalizationsRegisterInputSchema = z.object({
  marketLocalizations: z.array(MarketLocalizationInputSchema).nonempty("At least one market localization is required")
});

type MarketLocalizationsRegisterInput = z.infer<typeof MarketLocalizationsRegisterInputSchema>;

let shopifyClient: GraphQLClient;

const marketLocalizationsRegister = {
  name: "market-localizations-register",
  description: "Register localizations for markets",
  schema: MarketLocalizationsRegisterInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketLocalizationsRegisterInput) => {
    const query = gql`
      mutation marketLocalizationsRegister($marketLocalizations: [MarketLocalizationInput!]!) {
        marketLocalizationsRegister(marketLocalizations: $marketLocalizations) {
          marketLocalizations {
            key
            value
            market {
              id
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { marketLocalizations: input.marketLocalizations };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.marketLocalizationsRegister;
    } catch (error) {
      console.error("Error registering market localizations:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketLocalizationsRegister };