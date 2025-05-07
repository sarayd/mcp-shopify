import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionDraftUpdateInputSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
  input: z.object({
    status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'FAILED', 'ON_HOLD', 'PAUSED', 'PENDING']).optional(),
    nextBillingDate: z.string().optional(),
    billingPolicy: z.object({
      interval: z.enum(['DAY', 'MONTH', 'WEEK', 'YEAR']),
      intervalCount: z.number().int().positive(),
      anchors: z.array(z.object({
        day: z.number().int(),
        type: z.enum(['WEEKDAY', 'MONTHDAY'])
      })).optional(),
      maxCycles: z.number().int().optional(),
      minCycles: z.number().int().optional()
    }).optional(),
    deliveryPolicy: z.object({
      interval: z.enum(['DAY', 'MONTH', 'WEEK', 'YEAR']),
      intervalCount: z.number().int().positive(),
      anchors: z.array(z.object({
        day: z.number().int(),
        type: z.enum(['WEEKDAY', 'MONTHDAY'])
      })).optional()
    }).optional(),
    lines: z.array(z.object({
      id: z.string().optional(),
      productVariantId: z.string().optional(),
      quantity: z.number().int().positive().optional(),
      sellingPlanId: z.string().optional(),
      title: z.string().optional(),
      currentPrice: z.object({
        amount: z.number(),
        currencyCode: z.string()
      }).optional(),
      customAttributes: z.array(z.object({
        key: z.string(),
        value: z.string()
      })).optional()
    })).optional(),
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    paymentMethodId: z.string().optional(),
    shippingMethodId: z.string().optional(),
    shippingMethodName: z.string().optional(),
    shippingPrice: z.object({
      amount: z.number(),
      currencyCode: z.string()
    }).optional(),
    note: z.string().optional(),
    customerId: z.string().optional(),
    billingAddress: z.object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      company: z.string().optional(),
      country: z.string().optional(),
      countryCode: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      province: z.string().optional(),
      provinceCode: z.string().optional(),
      zip: z.string().optional()
    }).optional(),
    shippingAddress: z.object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      company: z.string().optional(),
      country: z.string().optional(),
      countryCode: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      province: z.string().optional(),
      provinceCode: z.string().optional(),
      zip: z.string().optional()
    }).optional()
  })
});

type SubscriptionDraftUpdateInput = z.infer<typeof SubscriptionDraftUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftUpdate = {
  name: "subscription-draft-update",
  description: "Update a subscription draft",
  schema: SubscriptionDraftUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftUpdateInput) => {
    const query = gql`
      mutation subscriptionDraftUpdate($draftId: ID!, $input: SubscriptionDraftInput!) {
        subscriptionDraftUpdate(draftId: $draftId, input: $input) {
          draft {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      draftId: input.draftId,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftUpdate;
    } catch (error) {
      console.error("Error updating subscription draft:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftUpdate };