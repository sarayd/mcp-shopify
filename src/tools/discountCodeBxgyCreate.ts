import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BxgyCustomerBuysItemsSchema = z.object({
  products: z.object({
    productVariants: z.array(z.string()).optional()
  }).optional(),
  collections: z.object({
    collections: z.array(z.string()).optional()
  }).optional(),
  variants: z.object({
    variants: z.array(z.string()).optional()
  }).optional()
});

const BxgyCustomerGetsValueSchema = z.object({
  discountAmount: z.object({
    amount: z.number()
  }).optional(),
  discountOnQuantity: z.object({
    quantity: z.number(),
    effect: z.object({
      percentage: z.number()
    })
  }).optional(),
  percentage: z.number().optional()
});

const DiscountCodeBxgyInputSchema = z.object({
  title: z.string(),
  code: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().optional(),
  appliesOncePerCustomer: z.boolean().optional(),
  minimumRequirement: z.object({
    quantity: z.number().int()
  }).optional(),
  customerBuys: z.object({
    items: BxgyCustomerBuysItemsSchema,
    quantity: z.number().int()
  }),
  customerGets: z.object({
    items: BxgyCustomerBuysItemsSchema,
    value: BxgyCustomerGetsValueSchema
  }),
  customerSelection: z.object({
    customers: z.object({
      customers: z.array(z.string())
    }).optional(),
    segments: z.object({
      segments: z.array(z.string())
    }).optional()
  }).optional()
});

type DiscountCodeBxgyInput = z.infer<typeof DiscountCodeBxgyInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeBxgyCreate = {
  name: "discount-code-bxgy-create",
  description: "Create a buy X get Y discount code",
  schema: DiscountCodeBxgyInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeBxgyInput) => {
    const query = gql`
      mutation discountCodeBxgyCreate($discount: DiscountCodeBxgyInput!) {
        discountCodeBxgyCreate(discount: $discount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBxgy {
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
            code
            message
          }
        }
      }
    `;

    const variables = { discount: input };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountCodeBxgyCreate;
    } catch (error) {
      console.error("Error creating BXGY discount code:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeBxgyCreate };