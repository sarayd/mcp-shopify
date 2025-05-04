import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BasicCodeDiscountInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  code: z.string().min(1, "Code is required"),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional(),
  appliesOncePerCustomer: z.boolean().optional(),
  customerSelection: z.object({
    all: z.boolean().optional(),
    customers: z.object({
      add: z.array(z.string()).optional()
    }).optional(),
    segments: z.array(z.string()).optional()
  }).optional(),
  customerGets: z.object({
    value: z.object({
      percentage: z.number().min(0).max(100),
      amount: z.object({
        amount: z.number(),
        currencyCode: z.string()
      })
    }).partial().refine(data => data.percentage !== undefined || data.amount !== undefined, {
      message: "Either percentage or amount must be provided"
    }),
    items: z.object({
      all: z.boolean().optional(),
      products: z.object({
        add: z.array(z.string())
      }).optional(),
      collections: z.object({
        add: z.array(z.string())
      }).optional(),
      variants: z.object({
        add: z.array(z.string())
      }).optional()
    }).optional()
  }),
  minimumRequirement: z.object({
    subtotal: z.object({
      greaterThanOrEqualToAmount: z.number()
    }).optional(),
    quantity: z.object({
      greaterThanOrEqualToQuantity: z.number()
    }).optional()
  }).optional(),
  combinesWith: z.object({
    orderDiscounts: z.boolean().optional(),
    productDiscounts: z.boolean().optional(),
    shippingDiscounts: z.boolean().optional()
  }).optional()
});

const DiscountCodeBasicCreateInputSchema = z.object({
  basicCodeDiscount: BasicCodeDiscountInputSchema
});

type DiscountCodeBasicCreateInput = z.infer<typeof DiscountCodeBasicCreateInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeBasicCreate = {
  name: "discount-code-basic-create",
  description: "Create a basic discount code",
  schema: DiscountCodeBasicCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeBasicCreateInput) => {
    const query = gql`
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                code
                startsAt
                endsAt
                usageLimit
                appliesOncePerCustomer
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
      return response.discountCodeBasicCreate;
    } catch (error) {
      console.error("Error creating discount code:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeBasicCreate };