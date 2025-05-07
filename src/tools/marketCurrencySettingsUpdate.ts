import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketCurrencySettingsUpdateInputSchema = z.object({
  marketId: z.string().min(1, "Market ID is required"),
  currencySettings: z.object({
    baseCurrency: z.enum([
      "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", 
      "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", 
      "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", 
      "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", 
      "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", 
      "JPY", "KES", "KGS", "KHR", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", 
      "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", 
      "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", 
      "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", 
      "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", 
      "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VEF", "VND", "VUV", 
      "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW"
    ]).optional(),
    baseCurrencyRate: z.number().optional(),
    enableLocalCurrencies: z.boolean().optional(),
    enableRounding: z.boolean().optional()
  })
});

type MarketCurrencySettingsUpdateInput = z.infer<typeof MarketCurrencySettingsUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const marketCurrencySettingsUpdate = {
  name: "market-currency-settings-update",
  description: "Update currency settings for a market",
  schema: MarketCurrencySettingsUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketCurrencySettingsUpdateInput) => {
    const query = gql`
      mutation marketCurrencySettingsUpdate($marketId: ID!, $currencySettings: MarketCurrencySettingsInput!) {
        marketCurrencySettingsUpdate(marketId: $marketId, currencySettings: $currencySettings) {
          market {
            id
            currencySettings {
              baseCurrency
              baseCurrencyRate
              enableLocalCurrencies
              enableRounding
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
      marketId: input.marketId,
      currencySettings: input.currencySettings
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.marketCurrencySettingsUpdate;
    } catch (error) {
      console.error("Error updating market currency settings:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketCurrencySettingsUpdate };