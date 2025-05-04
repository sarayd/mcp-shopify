import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShopLocaleInputSchema = z.object({
  locale: z.string(),
  marketId: z.string().optional(),
  name: z.string().optional(),
  primary: z.boolean().optional(),
  published: z.boolean().optional()
});
type ShopLocaleInput = z.infer<typeof ShopLocaleInputSchema>;

const ShopLocaleUpdateInputSchema = z.object({
  locale: z.string(),
  shopLocale: ShopLocaleInputSchema
});
type ShopLocaleUpdateInput = z.infer<typeof ShopLocaleUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const shopLocaleUpdate = {
  name: "shop-locale-update",
  description: "Update a shop locale",
  schema: ShopLocaleUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShopLocaleUpdateInput) => {
    const query = gql`
      mutation shopLocaleUpdate($locale: String!, $shopLocale: ShopLocaleInput!) {
        shopLocaleUpdate(locale: $locale, shopLocale: $shopLocale) {
          shopLocale {
            locale
            name
            primary
            published
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      locale: input.locale,
      shopLocale: input.shopLocale
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.shopLocaleUpdate;
    } catch (error) {
      console.error("Error updating shop locale:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shopLocaleUpdate };