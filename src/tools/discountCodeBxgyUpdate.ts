import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BxgyDiscountInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  combinesWith: z.object({
    orderDiscounts: z.boolean().optional(),
    productDiscounts: z.boolean().optional(),
    shippingDiscounts: z.boolean().optional()
  }).optional(),
  customerBuys: z.object({
    items: z.object({
      products: z.object({
        productsToAdd: z.array(z.string()).optional(),
        productsToRemove: z.array(z.string()).optional()
      }).optional(),
      collections: z.object({
        collectionsToAdd: z.array(z.string()).optional(),
        collectionsToRemove: z.array(z.string()).optional()
      }).optional(),
      variants: z.object({
        variantsToAdd: z.array(z.string()).optional(),
        variantsToRemove: z.array(z.string()).optional()
      }).optional()
    }).optional(),
    value: z.object({
      quantity: z.number()
    }).optional()
  }).optional(),
  customerGets: z.object({
    items: z.object({
      products: z.object({
        productsToAdd: z.array(z.string()).optional(),
        productsToRemove: z.array(z.string()).optional()
      }).optional(),
      collections: z.object({
        collectionsToAdd: z.array(z.string()).optional(),
        collectionsToRemove: z.array(z.string()).optional()
      }).optional(),
      variants: z.object({
        variantsToAdd: z.array(z.string()).optional(),
        variantsToRemove: z.array(z.string()).optional()
      }).optional()
    }).optional(),
    value: z.object({
      percentage: z.number()
    }).optional()
  }).optional(),
  usageLimit: z.number().optional(),
  appliesOncePerCustomer: z.boolean().optional(),
  asyncUsageCount: z.boolean().optional()
});

const DiscountCodeBxgyUpdateInputSchema = z.object({
  id: z.string().min(1, "Discount ID is required"),
  discount: BxgyDiscountInputSchema
});

type DiscountCodeBxgyUpdateInput = z.infer<typeof DiscountCodeBxgyUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeBxgyUpdate = {
  name: "discount-code-bxgy-update",
  description: "Update a buy X get Y discount code",
  schema: DiscountCodeBxgyUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeBxgyUpdateInput) => {
    const query = gql`
      mutation discountCodeBxgyUpdate($id: ID!, $discount: DiscountCodeBxgyInput!) {
        discountCodeBxgyUpdate(id: $id, discount: $discount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBxgy {
                title
                startsAt
                endsAt
                status
                customerBuys {
                  value {
                    quantity
                  }
                }
                customerGets {
                  value {
                    percentage
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

    const variables = {
      id: input.id,
      discount: input.discount
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountCodeBxgyUpdate;
    } catch (error) {
      console.error("Error updating BXGY discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeBxgyUpdate };