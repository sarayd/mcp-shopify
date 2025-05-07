import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for creating a price list
const PriceListCreateInputSchema = z.object({
  name: z.string().min(1, "Price list name is required"),
  currency: z.string().min(1, "Currency is required"),
  prices: z
    .array(
      z.object({
        variantId: z.string().min(1, "Variant ID is required"),
        price: z.string().min(1, "Price is required")
      })
    )
    .optional()
});

type PriceListCreateInput = z.infer<typeof PriceListCreateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const priceListCreate = {
  name: "price-list-create",
  description: "Create a price list in Shopify",
  schema: PriceListCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PriceListCreateInput) => {
    try {
      const { name, currency, prices } = input;

      const query = gql`
        mutation priceListCreate($input: PriceListInput!) {
          priceListCreate(input: $input) {
            priceList {
              id
              name
              currency
              prices(first: 5) {
                edges {
                  node {
                    variant {
                      id
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
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
        input: {
          name,
          currency,
          prices: prices?.map(p => ({
            variantId: p.variantId.startsWith("gid://")
              ? p.variantId
              : `gid://shopify/ProductVariant/${p.variantId}`,
            price: { amount: p.price, currencyCode: currency }
          }))
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        priceListCreate: {
          priceList: {
            id: string;
            name: string;
            currency: string;
            prices: {
              edges: Array<{
                node: {
                  variant: { id: string };
                  price: { amount: string; currencyCode: string };
                };
              }>;
            } | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.priceListCreate.userErrors.length > 0) {
        throw new Error(
          `Failed to create price list: ${data.priceListCreate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { priceList } = data.priceListCreate;
      return {
        priceList: priceList
          ? {
              id: priceList.id,
              name: priceList.name,
              currency: priceList.currency,
              prices: priceList.prices?.edges.map(edge => ({
                variantId: edge.node.variant.id,
                price: {
                  amount: edge.node.price.amount,
                  currencyCode: edge.node.price.currencyCode
                }
              })) || []
            }
          : null
      };
    } catch (error) {
      console.error("Error creating price list:", error);
      throw new Error(
        `Failed to create price list: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { priceListCreate };