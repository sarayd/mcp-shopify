import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanGroupInputSchema = z.object({
  appId: z.string().optional(),
  merchantCode: z.string().optional(),
  name: z.string().optional(),
  options: z.array(z.string()).optional(),
  position: z.number().int().optional(),
  sellingPlans: z.array(z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    options: z.array(z.string()).optional(),
    position: z.number().int().optional(),
    billingPolicy: z.object({
      fixed: z.object({
        adjustmentType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        adjustmentValue: z.number()
      }).optional(),
      recurring: z.object({
        adjustmentType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        adjustmentValue: z.number(),
        interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
        intervalCount: z.number().int()
      }).optional()
    }).optional(),
    deliveryPolicy: z.object({
      fixed: z.object({
        cutoffDay: z.number().int().optional(),
        fulfillmentTrigger: z.enum(['ASAP', 'EXACT_TIME']),
        fulfillmentExactTime: z.string().optional(),
        preAnchorBehavior: z.enum(['ASAP', 'NEXT']).optional()
      }).optional(),
      recurring: z.object({
        anchors: z.array(z.object({
          cutoffDay: z.number().int().optional(),
          day: z.number().int(),
          month: z.number().int().optional(),
          type: z.enum(['WEEKDAY', 'MONTHDAY', 'YEARDAY'])
        })).optional(),
        cutoffDay: z.number().int().optional(),
        interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
        intervalCount: z.number().int(),
        preAnchorBehavior: z.enum(['ASAP', 'NEXT']).optional()
      }).optional()
    }).optional(),
    pricingPolicies: z.array(z.object({
      fixed: z.object({
        adjustmentType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        adjustmentValue: z.number()
      }).optional(),
      recurring: z.object({
        adjustmentType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        adjustmentValue: z.number(),
        interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
        intervalCount: z.number().int()
      }).optional()
    })).optional()
  })).optional()
});

const SellingPlanGroupUpdateInputSchema = z.object({
  id: z.string().min(1, "Selling plan group ID is required"),
  input: SellingPlanGroupInputSchema
});

type SellingPlanGroupUpdateInput = z.infer<typeof SellingPlanGroupUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const sellingPlanGroupUpdate = {
  name: "selling-plan-group-update",
  description: "Update a selling plan group",
  schema: SellingPlanGroupUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SellingPlanGroupUpdateInput) => {
    const query = gql`
      mutation sellingPlanGroupUpdate($id: ID!, $input: SellingPlanGroupInput!) {
        sellingPlanGroupUpdate(id: $id, input: $input) {
          sellingPlanGroup {
            id
            name
            merchantCode
            sellingPlans(first: 10) {
              nodes {
                id
                name
                description
                options
                position
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
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.sellingPlanGroupUpdate;
    } catch (error) {
      console.error("Error updating selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupUpdate };