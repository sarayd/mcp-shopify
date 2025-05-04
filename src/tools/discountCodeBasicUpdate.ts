import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BasicCodeDiscountInputSchema = z.object({
  appliesOncePerCustomer: z.boolean().optional(),
  code: z.string().optional(),
  customerSelection: z.object({
    segments: z.array(z.object({ id: z.string() })).optional(),
    customers: z.array(z.object({ id: z.string() })).optional()
  }).optional(),
  endsAt: z.string().optional(),
  minimumRequirement: z.object({
    quantity: z.object({
      greaterThanOrEqualToQuantity: z.number()
    }).optional(),
    subtotal: z.object({
      greaterThanOrEqualToAmount: z.number()
    }).optional()
  }).optional(),
  recurringCycleLimit: z.number().int().optional(),
  startsAt: z.string().optional(),
  title: z.string().optional(),
  usageLimit: z.number().int().optional(),
  customerGets: z.object({
    items: z.object({
      products: z.array(z.object({ id: z.string() })).optional(),
      collections: z.array(z.object({ id: z.string() })).optional(),
      variants: z.array(z.object({ id: z.string() })).optional()
    }).optional(),
    value: z.object({
      percentage: z.number().optional(),
      amount: z.object({
        amount: z.number()
      }).optional()
    })
  }).optional()
});

const DiscountCodeBasicUpdateInputSchema = z.object({
  id: z.string().min(1, "Discount ID is required"),
  basicCodeDiscount: BasicCodeDiscountInputSchema
});

type DiscountCodeBasicUpdateInput = z.infer<typeof DiscountCodeBasicUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeBasicUpdate = {
  name: "discount-code-basic-update",
  description: "Update a basic discount code",
  schema: DiscountCodeBasicUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeBasicUpdateInput) => {
    const query = gql`
      mutation discountCodeBasicUpdate($id: ID!, $basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicUpdate(id: $id, basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                title
                codes(first: 1) {
                  nodes {
                    code
                  }
                }
                startsAt
                endsAt
                customerSelection {
                  all
                }
                customerGets {
                  value {
                    ... on DiscountPercentage {
                      percentage
                    }
                    ... on DiscountAmount {
                      amount {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
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

    try {
      const response: any = await shopifyClient.request(query, {
        id: input.id,
        basicCodeDiscount: input.basicCodeDiscount
      });
      return response.discountCodeBasicUpdate;
    } catch (error) {
      console.error("Error updating discount code:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeBasicUpdate };