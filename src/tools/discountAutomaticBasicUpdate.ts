import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CombinesWithSchema = z.object({
  orderDiscounts: z.boolean().optional(),
  productDiscounts: z.boolean().optional(),
  shippingDiscounts: z.boolean().optional()
});

const CustomerGetsItemsSchema = z.object({
  products: z.object({
    productsToAdd: z.array(z.string()).optional(),
    productsToRemove: z.array(z.string()).optional()
  }).optional(),
  collections: z.object({
    collectionsToAdd: z.array(z.string()).optional(),
    collectionsToRemove: z.array(z.string()).optional()
  }).optional()
});

const CustomerSelectionSchema = z.object({
  customers: z.object({
    customersToAdd: z.array(z.string()).optional(),
    customersToRemove: z.array(z.string()).optional()
  }).optional(),
  segments: z.object({
    segmentsToAdd: z.array(z.string()).optional(),
    segmentsToRemove: z.array(z.string()).optional()
  }).optional()
});

const AutomaticBasicDiscountSchema = z.object({
  combinesWith: CombinesWithSchema.optional(),
  customerGets: z.object({
    items: CustomerGetsItemsSchema.optional(),
    value: z.object({
      percentage: z.number().optional(),
      amount: z.number().optional()
    })
  }).optional(),
  customerSelection: CustomerSelectionSchema.optional(),
  endsAt: z.string().datetime().optional(),
  minimumRequirement: z.object({
    quantity: z.number().int().optional(),
    subtotal: z.number().optional()
  }).optional(),
  startsAt: z.string().datetime().optional(),
  title: z.string().optional(),
  usageLimit: z.number().int().optional()
});

const DiscountAutomaticBasicUpdateInputSchema = z.object({
  id: z.string().min(1, "Discount ID is required"),
  automaticBasicDiscount: AutomaticBasicDiscountSchema
});

type DiscountAutomaticBasicUpdateInput = z.infer<typeof DiscountAutomaticBasicUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticBasicUpdate = {
  name: "discount-automatic-basic-update",
  description: "Update an automatic basic discount",
  schema: DiscountAutomaticBasicUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticBasicUpdateInput) => {
    const query = gql`
      mutation discountAutomaticBasicUpdate($input: DiscountAutomaticBasicUpdateInput!) {
        discountAutomaticBasicUpdate(input: $input) {
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
      const response: any = await shopifyClient.request(query, { input });
      return response.discountAutomaticBasicUpdate;
    } catch (error) {
      console.error("Error updating automatic basic discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticBasicUpdate };