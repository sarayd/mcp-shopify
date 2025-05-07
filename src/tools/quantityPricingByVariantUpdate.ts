import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const QuantityPriceBreakInputSchema = z.object({
  price: z.number(),
  quantity: z.number().int().positive()
});

const QuantityRuleDiscountInputSchema = z.object({
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().positive()
});

const QuantityRuleInputSchema = z.object({
  discount: QuantityRuleDiscountInputSchema,
  quantity: z.number().int().positive()
});

const QuantityPricingByVariantUpdateInputSchema = z.object({
  priceListId: z.string().min(1, "Price list ID is required"),
  companyLocationId: z.string().min(1, "Company location ID is required"),
  input: z.object({
    pricesToAdd: z.array(z.object({
      price: z.number().positive(),
      variantId: z.string()
    })).optional(),
    pricesToDeleteByVariantId: z.array(z.string()).optional(),
    quantityPriceBreaksToAdd: z.array(QuantityPriceBreakInputSchema).optional(),
    quantityPriceBreaksToDelete: z.array(z.string()).optional(),
    quantityPriceBreaksToDeleteByVariantId: z.array(z.string()).optional(),
    quantityRulesToAdd: z.array(QuantityRuleInputSchema).optional(),
    quantityRulesToDeleteByVariantId: z.array(z.string()).optional()
  })
});

type QuantityPricingByVariantUpdateInput = z.infer<typeof QuantityPricingByVariantUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const quantityPricingByVariantUpdate = {
  name: "quantity-pricing-by-variant-update",
  description: "Update quantity-based pricing for variants",
  schema: QuantityPricingByVariantUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: QuantityPricingByVariantUpdateInput) => {
    const query = gql`
      mutation quantityPricingByVariantUpdate($priceListId: ID!, $input: QuantityPricingByVariantUpdateInput!, $companyLocationId: ID!) {
        quantityPricingByVariantUpdate(priceListId: $priceListId, input: $input) {
          productVariants {
            id
            contextualPricing(context: { companyLocationId: $companyLocationId }) {
              quantityPriceBreaks(first: 10) {
                nodes {
                  id
                  quantity
                  price {
                    amount
                    currencyCode
                  }
                }
              }
              quantityRule {
                id
                quantity
                discount {
                  type
                  value
                }
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
      priceListId: input.priceListId,
      input: input.input,
      companyLocationId: input.companyLocationId
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.quantityPricingByVariantUpdate;
    } catch (error) {
      console.error("Error updating quantity pricing:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { quantityPricingByVariantUpdate };