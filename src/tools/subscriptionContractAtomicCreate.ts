import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryAddressSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address1: z.string(),
  city: z.string(),
  province: z.string(),
  country: z.string(),
  zip: z.string()
});

const DeliveryMethodSchema = z.object({
  shipping: z.object({
    address: DeliveryAddressSchema
  })
});

const LineSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().int().positive(),
  currentPrice: z.number().positive()
});

const ContractSchema = z.object({
  status: z.enum(['ACTIVE', 'CANCELLED', 'DRAFT', 'PAUSED']),
  paymentMethodId: z.string(),
  billingPolicy: z.object({
    interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
    intervalCount: z.number().int().positive(),
    minCycles: z.number().int().nonnegative().optional()
  }),
  deliveryPolicy: z.object({
    interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
    intervalCount: z.number().int().positive()
  }),
  deliveryPrice: z.number().nonnegative().optional(),
  deliveryMethod: DeliveryMethodSchema
});

const SubscriptionContractAtomicCreateInputSchema = z.object({
  customerId: z.string(),
  nextBillingDate: z.string(),
  currencyCode: z.string(),
  lines: z.array(z.object({
    line: LineSchema
  })).nonempty(),
  contract: ContractSchema,
  discountCodes: z.array(z.string()).optional()
});

type SubscriptionContractAtomicCreateInput = z.infer<typeof SubscriptionContractAtomicCreateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractAtomicCreate = {
  name: "subscription-contract-atomic-create",
  description: "Create a new subscription contract",
  schema: SubscriptionContractAtomicCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractAtomicCreateInput) => {
    const query = gql`
      mutation subscriptionContractAtomicCreate($input: SubscriptionContractAtomicCreateInput!) {
        subscriptionContractAtomicCreate(input: $input) {
          contract {
            id
            status
            nextBillingDate
            lines(first: 10) {
              nodes {
                id
                quantity
                variantTitle
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
      return response.subscriptionContractAtomicCreate;
    } catch (error) {
      console.error("Error creating subscription contract:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractAtomicCreate };