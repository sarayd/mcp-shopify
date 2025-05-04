import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PriceListFixedPricesDeleteInputSchema = z.object({
  priceListId: z.string().min(1, "Price list ID is required"),
  variantIds: z.array(z.string()).nonempty("At least one variant ID is required")
});
type PriceListFixedPricesDeleteInput = z.infer<typeof PriceListFixedPricesDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const priceListFixedPricesDelete = {
  name: "price-list-fixed-prices-delete",
  description: "Delete fixed prices for variants in a price list",
  schema: PriceListFixedPricesDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PriceListFixedPricesDeleteInput) => {
    const query = gql`
      mutation priceListFixedPricesDelete($priceListId: ID!, $variantIds: [ID!]!) {
        priceListFixedPricesDelete(priceListId: $priceListId, variantIds: $variantIds) {
          deletedFixedPriceVariantIds
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      priceListId: input.priceListId,
      variantIds: input.variantIds
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.priceListFixedPricesDelete;
    } catch (error) {
      console.error("Error deleting price list fixed prices:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { priceListFixedPricesDelete };