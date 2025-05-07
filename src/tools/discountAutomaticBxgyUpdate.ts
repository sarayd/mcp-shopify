import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AutomaticBxgyInputSchema = z.object({
  customerBuys: z.object({
    items: z.object({
      products: z.object({
        productVariants: z.array(z.object({ id: z.string() })).optional(),
        productIds: z.array(z.string()).optional(),
        collectionIds: z.array(z.string()).optional()
      }).optional()
    }).optional(),
    value: z.object({
      quantity: z.number().int().min(1)
    })
  }),
  customerGets: z.object({
    items: z.object({
      products: z.object({
        productVariants: z.array(z.object({ id: z.string() })).optional(),
        productIds: z.array(z.string()).optional(),
        collectionIds: z.array(z.string()).optional()
      }).optional()
    }).optional(),
    value: z.object({
      percentage: z.number().min(0).max(100).optional(),
      amount: z.number().min(0).optional(),
      discountOnQuantity: z.enum(['ALL', 'EQUAL']).optional()
    })
  }),
  title: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().min(1).optional(),
  customerSelection: z.object({
    customers: z.object({
      customerIds: z.array(z.string()).optional(),
      segmentIds: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  minimumRequirement: z.object({
    subtotal: z.number().min(0).optional(),
    quantity: z.number().int().min(1).optional()
  }).optional()
});

const DiscountAutomaticBxgyUpdateInputSchema = z.object({
  id: z.string(),
  automaticBxgyDiscount: AutomaticBxgyInputSchema
});

type DiscountAutomaticBxgyUpdateInput = z.infer<typeof DiscountAutomaticBxgyUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticBxgyUpdate = {
  name: "discount-automatic-bxgy-update",
  description: "Update an automatic BXGY discount",
  schema: DiscountAutomaticBxgyUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticBxgyUpdateInput) => {
    const query = gql`
      mutation discountAutomaticBxgyUpdate($id: ID!, $automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
        discountAutomaticBxgyUpdate(id: $id, automaticBxgyDiscount: $automaticBxgyDiscount) {
          automaticDiscountNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticBxgy {
                title
                startsAt
                endsAt
                status
                usageLimit
                customerBuys {
                  value {
                    quantity
                  }
                }
                customerGets {
                  value {
                    percentage
                    amount
                    discountOnQuantity
                  }
                }
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

    const variables = {
      id: input.id,
      automaticBxgyDiscount: input.automaticBxgyDiscount
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountAutomaticBxgyUpdate;
    } catch (error) {
      console.error("Error updating automatic BXGY discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticBxgyUpdate };