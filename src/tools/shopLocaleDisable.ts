import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShopLocaleDisableInputSchema = z.object({
  locale: z.string().min(1, "Locale is required")
});
type ShopLocaleDisableInput = z.infer<typeof ShopLocaleDisableInputSchema>;

let shopifyClient: GraphQLClient;

const shopLocaleDisable = {
  name: "shop-locale-disable",
  description: "Disable a shop locale",
  schema: ShopLocaleDisableInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShopLocaleDisableInput) => {
    const query = gql`
      mutation shopLocaleDisable($locale: String!) {
        shopLocaleDisable(locale: $locale) {
          shopLocale {
            locale
            name
            published
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { locale: input.locale };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.shopLocaleDisable;
    } catch (error) {
      console.error("Error disabling shop locale:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shopLocaleDisable };