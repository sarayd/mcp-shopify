import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MinimumRequirementSchema = z.object({
  quantity: z.number().int().optional(),
  subtotal: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional()
}).optional();

const CustomerSelectionSchema = z.object({
  customers: z.object({
    add: z.array(z.string()).optional(),
    remove: z.array(z.string()).optional()
  }).optional(),
  segments: z.array(z.string()).optional()
}).optional();

const CountriesAndRatesSchema = z.object({
  countryCode: z.string(),
  includeRestOfWorld: z.boolean().optional()
});

const AutomaticDiscountSchema = z.object({
  title: z.string(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  minimumRequirement: MinimumRequirementSchema,
  customerSelection: CustomerSelectionSchema,
  countriesAndRates: z.array(CountriesAndRatesSchema)
});

const DiscountAutomaticFreeShippingCreateInputSchema = z.object({
  automaticDiscount: AutomaticDiscountSchema
});

type DiscountAutomaticFreeShippingCreateInput = z.infer<typeof DiscountAutomaticFreeShippingCreateInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticFreeShippingCreate = {
  name: "discount-automatic-free-shipping-create",
  description: "Create an automatic free shipping discount",
  schema: DiscountAutomaticFreeShippingCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticFreeShippingCreateInput) => {
    const query = gql`
      mutation discountAutomaticFreeShippingCreate($automaticDiscount: DiscountAutomaticFreeShippingInput!) {
        discountAutomaticFreeShippingCreate(automaticDiscount: $automaticDiscount) {
          automaticDiscountNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticFreeShipping {
                title
                startsAt
                endsAt
                minimumRequirement {
                  ... on DiscountMinimumQuantity {
                    quantity
                  }
                  ... on DiscountMinimumSubtotal {
                    greaterThanOrEqualToSubtotal
                  }
                }
                customerSelection {
                  customers {
                    segments
                  }
                }
                countriesAndRates {
                  countryCode
                  includeRestOfWorld
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

    try {
      const response: any = await shopifyClient.request(query, { automaticDiscount: input.automaticDiscount });
      return response.discountAutomaticFreeShippingCreate;
    } catch (error) {
      console.error("Error creating automatic free shipping discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticFreeShippingCreate };