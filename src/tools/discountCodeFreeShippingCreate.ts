import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountCodeFreeShippingInputSchema = z.object({
  title: z.string(),
  code: z.string(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  usageLimit: z.number().int().optional(),
  appliesOncePerCustomer: z.boolean().optional(),
  customerSelection: z.object({
    all: z.boolean().optional(),
    segments: z.array(z.string()).optional(),
    customers: z.object({
      add: z.array(z.string()).optional(),
      remove: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  destinationSelection: z.object({
    all: z.boolean().optional(),
    countries: z.array(z.object({
      countryCode: z.string(),
      include: z.boolean(),
      provinces: z.array(z.object({
        code: z.string(),
        include: z.boolean()
      })).optional()
    })).optional()
  }).optional(),
  minimumRequirement: z.object({
    subtotal: z.object({
      amount: z.number()
    }).optional(),
    quantity: z.object({
      quantity: z.number()
    }).optional()
  }).optional(),
  maximumShippingPrice: z.object({
    amount: z.number()
  }).optional()
});

type DiscountCodeFreeShippingInput = z.infer<typeof DiscountCodeFreeShippingInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeFreeShippingCreate = {
  name: "discount-code-free-shipping-create",
  description: "Create a free shipping discount code",
  schema: DiscountCodeFreeShippingInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeFreeShippingInput) => {
    const query = gql`
      mutation discountCodeFreeShippingCreate($input: DiscountCodeFreeShippingInput!) {
        discountCodeFreeShippingCreate(freeShippingCodeDiscount: $input) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeFreeShipping {
                title
                codes(first: 1) {
                  nodes {
                    code
                  }
                }
                startsAt
                endsAt
                status
                usageLimit
                appliesOncePerCustomer
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

    try {
      const response: any = await shopifyClient.request(query, { input });
      return response.discountCodeFreeShippingCreate;
    } catch (error) {
      console.error("Error creating free shipping discount code:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeFreeShippingCreate };