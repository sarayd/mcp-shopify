import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PriceListParentAdjustmentSchema = z.object({
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  value: z.number()
});

const PriceListParentSchema = z.object({
  adjustment: PriceListParentAdjustmentSchema.optional(),
  priceListId: z.string().optional()
});

const PriceListUpdateInputSchema = z.object({
  id: z.string().min(1, "Price list ID is required"),
  input: z.object({
    catalogId: z.string().optional(),
    currency: z.enum([
      "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW"
    ]).optional(),
    name: z.string().optional(),
    parent: PriceListParentSchema.optional()
  })
});

type PriceListUpdateInput = z.infer<typeof PriceListUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const priceListUpdate = {
  name: "price-list-update",
  description: "Update a price list in Shopify",
  schema: PriceListUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PriceListUpdateInput) => {
    const query = gql`
      mutation priceListUpdate($id: ID!, $input: PriceListUpdateInput!) {
        priceListUpdate(id: $id, input: $input) {
          priceList {
            id
            name
            currency
            parent {
              adjustment {
                type
                value
              }
              priceList {
                id
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
      return response.priceListUpdate;
    } catch (error) {
      console.error("Error updating price list:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { priceListUpdate };