import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const RegionConditionSchema = z.object({
  regionIds: z.array(z.string()).optional(),
  type: z.enum(['INCLUDE', 'EXCLUDE']).optional()
});

const CurrencySettingsSchema = z.object({
  baseCurrency: z.object({
    currencyCode: z.string()
  }),
  localCurrencies: z.array(z.string()).optional()
});

const PriceInclusionsSchema = z.object({
  duties: z.boolean().optional(),
  taxes: z.boolean().optional()
});

const MarketUpdateInputSchema = z.object({
  id: z.string().min(1, "Market ID is required"),
  input: z.object({
    catalogsToAdd: z.array(z.string()).optional(),
    catalogsToRemove: z.array(z.string()).optional(),
    conditions: z.object({
      regionsCondition: RegionConditionSchema.optional()
    }).optional(),
    currencySettings: CurrencySettingsSchema.optional(),
    enabled: z.boolean().optional(),
    handle: z.string().optional(),
    name: z.string().optional(),
    priceInclusions: PriceInclusionsSchema.optional(),
    status: z.enum(['ACTIVE', 'DRAFT']).optional(),
    webPresencesToAdd: z.array(z.string()).optional(),
    webPresencesToRemove: z.array(z.string()).optional()
  })
});

type MarketUpdateInput = z.infer<typeof MarketUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const marketUpdate = {
  name: "market-update",
  description: "Update a market's configuration",
  schema: MarketUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketUpdateInput) => {
    const query = gql`
      mutation marketUpdate($id: ID!, $input: MarketUpdateInput!) {
        marketUpdate(id: $id, input: $input) {
          market {
            id
            name
            handle
            enabled
            status
            conditions {
              regionsCondition {
                type
                regions(first: 10) {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
            currencySettings {
              baseCurrency {
                currencyCode
              }
              localCurrencies
            }
            priceInclusions {
              duties
              taxes
            }
            webPresence {
              edges {
                node {
                  id
                }
              }
            }
          }
          userErrors {
            field
            message
            code
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
      return response.marketUpdate;
    } catch (error) {
      console.error("Error updating market:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketUpdate };