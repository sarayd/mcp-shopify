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

const DraftOrderInputSchema = z.object({
  appliedDiscount: AppliedDiscountSchema.optional(),
  billingAddress: AddressSchema.optional(),
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  email: z.string().email().optional(),
  lineItems: z.array(z.object({
    appliedDiscount: AppliedDiscountSchema.optional(),
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    id: z.string().optional(),
    quantity: z.number().int().optional(),
    requiresShipping: z.boolean().optional(),
    taxable: z.boolean().optional(),
    title: z.string().optional(),
    variantId: z.string().optional(),
    weight: z.number().optional()
  })).optional(),
  note: z.string().optional(),
  shippingAddress: AddressSchema.optional(),
  shippingLine: z.object({
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    price: z.string().optional(),
    shippingRateHandle: z.string().optional(),
    title: z.string().optional()
  }).optional(),
  tags: z.array(z.string()).optional(),
  taxExempt: z.boolean().optional()
});

const DraftOrderUpdateInputSchema = z.object({
  id: z.string().min(1, "Draft order ID is required"),
  input: DraftOrderInputSchema
});

type DraftOrderUpdateInput = z.infer<typeof DraftOrderUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderUpdate = {
  name: "draft-order-update",
  description: "Update an existing draft order",
  schema: DraftOrderUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderUpdateInput) => {
    const query = gql`
      mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
        draftOrderUpdate(id: $id, input: $input) {
          draftOrder {
            id
            order {
              id
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
      id: input.id,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.draftOrderUpdate;
    } catch (error) {
      console.error("Error updating draft order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderUpdate };