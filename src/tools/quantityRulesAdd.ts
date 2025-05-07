import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const QuantityRuleInputSchema = z.object({
  excludeInternationalQuantity: z.boolean().optional(),
  excludeRestOfWorldQuantity: z.boolean().optional(),
  harmonizedSystemCode: z.string().optional(),
  maxQuantity: z.number().int().optional(),
  minQuantity: z.number().int().optional(),
  perCountryQuantity: z.array(z.object({
    countryCode: z.string(),
    quantity: z.number().int()
  })).optional(),
  quantity: z.number().int().optional(),
  restrictedCountryCodes: z.array(z.string()).optional(),
  restrictionType: z.enum(["HARMONIZED_SYSTEM_CODE", "SHIPPING_GROUP"]),
  shippingGroupId: z.string().optional()
});

const QuantityRulesAddInputSchema = z.object({
  productVariantId: z.string().min(1, "Product variant ID is required"),
  rules: z.array(QuantityRuleInputSchema).nonempty("At least one rule is required")
});

type QuantityRulesAddInput = z.infer<typeof QuantityRulesAddInputSchema>;

let shopifyClient: GraphQLClient;

const quantityRulesAdd = {
  name: "quantity-rules-add",
  description: "Add quantity rules to a product variant",
  schema: QuantityRulesAddInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: QuantityRulesAddInput) => {
    const query = gql`
      mutation quantityRulesAdd($input: QuantityRulesAddInput!) {
        quantityRulesAdd(input: $input) {
          quantityRules {
            id
            productVariant {
              id
            }
            rules {
              excludeInternationalQuantity
              excludeRestOfWorldQuantity
              harmonizedSystemCode
              maxQuantity
              minQuantity
              perCountryQuantity {
                countryCode
                quantity
              }
              quantity
              restrictedCountryCodes
              restrictionType
              shippingGroupId
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.quantityRulesAdd;
    } catch (error) {
      console.error("Error adding quantity rules:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { quantityRulesAdd };