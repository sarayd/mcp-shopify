import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CountryProvinceInputSchema = z.object({
  code: z.string()
});

const CountryInputSchema = z.object({
  code: z.string(),
  provinces: z.array(CountryProvinceInputSchema).optional()
});

const MarketRegionCreateInputSchema = z.object({
  name: z.string(),
  countries: z.array(CountryInputSchema),
  feedConfigurationId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

const MarketRegionsCreateInputSchema = z.object({
  input: MarketRegionCreateInputSchema
});

type MarketRegionsCreateInput = z.infer<typeof MarketRegionsCreateInputSchema>;

let shopifyClient: GraphQLClient;

const marketRegionsCreate = {
  name: "market-regions-create",
  description: "Create a new market region",
  schema: MarketRegionsCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketRegionsCreateInput) => {
    const query = gql`
      mutation marketRegionsCreate($input: MarketRegionCreateInput!) {
        marketRegionsCreate(input: $input) {
          marketRegion {
            id
            name
            status
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
      return response.marketRegionsCreate;
    } catch (error) {
      console.error("Error creating market region:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketRegionsCreate };