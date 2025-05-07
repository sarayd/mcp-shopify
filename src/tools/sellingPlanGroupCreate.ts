import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanBillingPolicySchema = z.object({
  recurring: z.object({
    anchors: z.array(z.object({
      day: z.number().optional(),
      month: z.number().optional(),
      type: z.enum(['WEEKDAY', 'MONTHDAY', 'YEARDAY']).optional()
    })).optional(),
    interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
    intervalCount: z.number(),
    minCycles: z.number().optional(),
    maxCycles: z.number().optional()
  }).optional()
});

const SellingPlanDeliveryPolicySchema = z.object({
  recurring: z.object({
    anchors: z.array(z.object({
      day: z.number().optional(),
      month: z.number().optional(),
      type: z.enum(['WEEKDAY', 'MONTHDAY', 'YEARDAY']).optional()
    })).optional(),
    interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
    intervalCount: z.number(),
    preAnchorBehavior: z.enum(['ASAP', 'NEXT']).optional()
  }).optional()
});

const SellingPlanPricingPolicySchema = z.object({
  fixed: z.object({
    adjustmentType: z.enum(['PERCENTAGE', 'PRICE']),
    adjustmentValue: z.number()
  }).optional(),
  recurring: z.object({
    adjustmentType: z.enum(['PERCENTAGE', 'PRICE']),
    adjustmentValue: z.number(),
    afterCycle: z.number().optional()
  }).optional()
});

const SellingPlanSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  options: z.array(z.string()).optional(),
  position: z.number().optional(),
  category: z.enum(['SUBSCRIPTION', 'PREPAID', 'CUSTOM']).optional(),
  billingPolicy: SellingPlanBillingPolicySchema,
  deliveryPolicy: SellingPlanDeliveryPolicySchema,
  pricingPolicies: z.array(SellingPlanPricingPolicySchema).optional(),
  merchantCode: z.string().optional()
});

const SellingPlanGroupInputSchema = z.object({
  name: z.string(),
  merchantCode: z.string().optional(),
  appId: z.string().optional(),
  options: z.array(z.string()).optional(),
  position: z.number().optional(),
  sellingPlans: z.array(SellingPlanSchema),
  productVariantIds: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional()
});

let shopifyClient: GraphQLClient;

const sellingPlanGroupCreate = {
  name: "selling-plan-group-create",
  description: "Create a selling plan group",
  schema: SellingPlanGroupInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: z.infer<typeof SellingPlanGroupInputSchema>) => {
    const query = gql`
      mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!) {
        sellingPlanGroupCreate(input: $input) {
          sellingPlanGroup {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.sellingPlanGroupCreate;
    } catch (error) {
      console.error("Error creating selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupCreate };