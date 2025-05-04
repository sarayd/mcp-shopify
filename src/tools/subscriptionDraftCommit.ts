import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionDraftCommitInputSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
  input: z.object({
    status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']).optional(),
    nextBillingDate: z.string().datetime().optional(),
    billingPolicy: z.object({
      interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
      intervalCount: z.number().int().positive(),
      anchors: z.array(z.object({
        day: z.number().int().min(1).max(31).optional(),
        type: z.enum(['WEEKDAY', 'MONTHDAY']).optional(),
        month: z.number().int().min(1).max(12).optional()
      })).optional()
    }).optional(),
    deliveryPolicy: z.object({
      interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
      intervalCount: z.number().int().positive(),
      anchors: z.array(z.object({
        day: z.number().int().min(1).max(31).optional(),
        type: z.enum(['WEEKDAY', 'MONTHDAY']).optional(),
        month: z.number().int().min(1).max(12).optional()
      })).optional()
    }).optional(),
    lineItems: z.array(z.object({
      productVariantId: z.string(),
      quantity: z.number().int().positive(),
      sellingPlanId: z.string().optional()
    })).optional(),
    customerId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    shippingPrice: z.object({
      amount: z.number(),
      currencyCode: z.string()
    }).optional(),
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
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

type SubscriptionDraftCommitInput = z.infer<typeof SubscriptionDraftCommitInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftCommit = {
  name: "subscription-draft-commit",
  description: "Commits a subscription draft to create or update a subscription",
  schema: SubscriptionDraftCommitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftCommitInput) => {
    const query = gql`
      mutation subscriptionDraftCommit($draftId: ID!, $input: SubscriptionDraftCommitInput!) {
        subscriptionDraftCommit(draftId: $draftId, input: $input) {
          draft {
            id
          }
          subscription {
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
      return response.subscriptionDraftCommit;
    } catch (error) {
      console.error("Error committing subscription draft:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftCommit };