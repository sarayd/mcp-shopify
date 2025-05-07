import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerGetsValueSchema = z.object({
  percentage: z.number().optional(),
  amount: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional()
}).refine(data => data.percentage !== undefined || data.amount !== undefined, {
  message: "Either percentage or amount must be provided"
});

const DiscountAutomaticBasicInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  minimumRequirement: z.object({
    quantity: z.object({
      greaterThanOrEqualToQuantity: z.number()
    }).optional(),
    subtotal: z.object({
      greaterThanOrEqualToSubtotal: z.number()
    }).optional()
  }).optional(),
  customerSelection: z.object({
    customers: z.object({
      customersToAdd: z.array(z.string())
    }).optional(),
    segments: z.object({
      segmentsToAdd: z.array(z.string())
    }).optional()
  }).optional(),
  customerGets: z.object({
    value: CustomerGetsValueSchema,
    items: z.object({
      products: z.object({
        productsToAdd: z.array(z.string())
      }).optional(),
      collections: z.object({
        collectionsToAdd: z.array(z.string())
      }).optional(),
      variants: z.object({
        variantsToAdd: z.array(z.string())
      }).optional()
    }).optional()
  }),
  combinesWith: z.object({
    orderDiscounts: z.boolean().optional(),
    productDiscounts: z.boolean().optional(),
    shippingDiscounts: z.boolean().optional()
  }).optional(),
  usageLimit: z.number().int().positive().optional()
});

const schema = z.object({
  automaticBasicDiscount: DiscountAutomaticBasicInputSchema
});

let shopifyClient: GraphQLClient;

const discountAutomaticBasicCreate = {
  name: "discount-automatic-basic-create",
  description: "Create an automatic basic discount",
  schema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: z.infer<typeof schema>) => {
    const query = gql`
      mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
        discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
          automaticDiscountNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticBasic {
                title
                startsAt
                endsAt
                status
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
      const response: any = await shopifyClient.request(query, input);
      return response.discountAutomaticBasicCreate;
    } catch (error) {
      console.error("Error creating automatic basic discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticBasicCreate };