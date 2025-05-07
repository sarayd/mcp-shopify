import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShopLocaleEnableInputSchema = z.object({
  locale: z.string().min(1, "Locale is required"),
});
type ShopLocaleEnableInput = z.infer<typeof ShopLocaleEnableInputSchema>;

let shopifyClient: GraphQLClient;

const shopLocaleEnable = {
  name: "shop-locale-enable",
  description: "Enable a locale for the shop",
  schema: ShopLocaleEnableInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShopLocaleEnableInput) => {
    const query = gql`
      mutation shopLocaleEnable($locale: String!) {
        shopLocaleEnable(locale: $locale) {
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
    const variables = { locale: input.locale };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.shopLocaleEnable;
    } catch (error) {
      console.error("Error enabling shop locale:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shopLocaleEnable };