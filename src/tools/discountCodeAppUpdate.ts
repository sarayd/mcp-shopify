import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for DiscountCodeAppUpdateInput
const DiscountCodeAppUpdateInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  appDiscountType: z.object({
    functionId: z.string()
  }).optional(),
  combinesWith: z.object({
    orderDiscounts: z.boolean().optional(),
    productDiscounts: z.boolean().optional(),
    shippingDiscounts: z.boolean().optional()
  }).optional(),
  code: z.string().optional(),
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
      percentage: z.number().optional(),
      amount: z.object({
        amount: z.number(),
        currencyCode: z.string()
      }).optional(),
      fixedAmountValue: z.object({
        amount: z.number(),
        currencyCode: z.string()
      }).optional()
    }).optional()
  }).optional(),
  customerSelection: z.object({
    customers: z.object({
      customersToAdd: z.array(z.string()).optional(),
      customersToRemove: z.array(z.string()).optional()
    }).optional(),
    segments: z.object({
      segmentsToAdd: z.array(z.string()).optional(),
      segmentsToRemove: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  endsAt: z.string().optional(),
  minimumRequirement: z.object({
    quantity: z.number().optional(),
    subtotal: z.object({
      amount: z.number(),
      currencyCode: z.string()
    }).optional()
  }).optional(),
  recurringCycleLimit: z.number().optional(),
  startsAt: z.string().optional(),
  usageLimit: z.number().optional()
});
type DiscountCodeAppUpdateInput = z.infer<typeof DiscountCodeAppUpdateInputSchema>;

// Tool input schema
const DiscountCodeAppUpdateInputSchema = z.object({
  input: DiscountCodeAppUpdateInputSchema
});
type DiscountCodeAppUpdateInput = z.infer<typeof DiscountCodeAppUpdateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const discountCodeAppUpdate = {
  name: "discount-code-app-update",
  description: "Perform discountCodeAppUpdate operation in Shopify",
  schema: DiscountCodeAppUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeAppUpdateInput) => {
    const query = gql`
      mutation discountCodeAppUpdate($codeAppDiscount: DiscountCodeAppInput!, $id: ID!) {
  discountCodeAppUpdate(codeAppDiscount: $codeAppDiscount, id: $id) {
    codeAppDiscount {
      discountId
      title
      endsAt
    }
    userErrors {
      field
      message
    }
  }
}
    `;
    const variables = { codeAppDiscount: codeAppDiscount, id: id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountCodeAppUpdate;
    } catch (error) {
      console.error("Error executing discountCodeAppUpdate:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
};

export { discountCodeAppUpdate };
