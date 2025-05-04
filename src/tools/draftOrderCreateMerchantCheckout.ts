import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AddressSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  zip: z.string().optional()
});

const AppliedDiscountSchema = z.object({
  amount: z.string().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
  value: z.number().optional(),
  valueType: z.enum(['FIXED_AMOUNT', 'PERCENTAGE']).optional()
});

const DraftOrderCreateMerchantCheckoutInputSchema = z.object({
  input: z.object({
    allowPartialAddresses: z.boolean().optional(),
    appliedDiscount: AppliedDiscountSchema.optional(),
    billingAddress: AddressSchema.optional(),
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    email: z.string().optional(),
    lineItems: z.array(z.object({
      appliedDiscount: AppliedDiscountSchema.optional(),
      customAttributes: z.array(z.object({
        key: z.string(),
        value: z.string()
      })).optional(),
      originalUnitPrice: z.string().optional(),
      quantity: z.number(),
      requiresShipping: z.boolean().optional(),
      taxable: z.boolean().optional(),
      title: z.string().optional(),
      variantId: z.string(),
      weight: z.object({
        unit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES']),
        value: z.number()
      }).optional()
    })).optional(),
    localizationExtensions: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    note: z.string().optional(),
    presentmentCurrencyCode: z.string().optional(),
    shippingAddress: AddressSchema.optional(),
    shippingLine: z.object({
      handle: z.string().optional(),
      price: z.string().optional(),
      title: z.string().optional()
    }).optional(),
    sourceName: z.string().optional(),
    tags: z.array(z.string()).optional(),
    taxExempt: z.boolean().optional(),
    useCustomerDefaultAddress: z.boolean().optional()
  })
});

type DraftOrderCreateMerchantCheckoutInput = z.infer<typeof DraftOrderCreateMerchantCheckoutInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderCreateMerchantCheckout = {
  name: "draft-order-create-merchant-checkout",
  description: "Create a merchant checkout URL for a draft order",
  schema: DraftOrderCreateMerchantCheckoutInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderCreateMerchantCheckoutInput) => {
    const query = gql`
      mutation draftOrderCreateMerchantCheckout($input: DraftOrderCreateMerchantCheckoutInput!) {
        draftOrderCreateMerchantCheckout(input: $input) {
          draftOrder {
            id
          }
          merchantCheckoutUrl
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.draftOrderCreateMerchantCheckout;
    } catch (error) {
      console.error("Error creating draft order merchant checkout:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderCreateMerchantCheckout };