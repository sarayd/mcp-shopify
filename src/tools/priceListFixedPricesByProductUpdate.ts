import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FixedPriceSchema = z.object({
  price: z.object({
    amount: z.number(),
    currencyCode: z.string()
  })
});

const ProductPriceSchema = z.object({
  productId: z.string(),
  fixedPrices: z.array(FixedPriceSchema)
});

const PriceListFixedPricesByProductUpdateInputSchema = z.object({
  priceListId: z.string().min(1, "Price list ID is required"),
  prices: z.array(ProductPriceSchema).nonempty("At least one product price is required")
});

type PriceListFixedPricesByProductUpdateInput = z.infer<typeof PriceListFixedPricesByProductUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const priceListFixedPricesByProductUpdate = {
  name: "price-list-fixed-prices-by-product-update",
  description: "Update fixed prices for products in a price list",
  schema: PriceListFixedPricesByProductUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PriceListFixedPricesByProductUpdateInput) => {
    const query = gql`
      mutation priceListFixedPricesByProductUpdate($priceListId: ID!, $prices: [PriceListPriceByProductInput!]!) {
        priceListFixedPricesByProductUpdate(priceListId: $priceListId, prices: $prices) {
          prices {
            productVariant {
              id
            }
            price {
              amount
              currencyCode
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      priceListId: input.priceListId,
      prices: input.prices
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.priceListFixedPricesByProductUpdate;
    } catch (error) {
      console.error("Error updating price list fixed prices:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { priceListFixedPricesByProductUpdate };