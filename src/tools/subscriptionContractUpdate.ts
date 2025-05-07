import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryAddressSchema = z.object({
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
});

const ContractUpdateInputSchema = z.object({
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  deliveryMethod: z.object({
    shipping: z.object({
      address: DeliveryAddressSchema
    })
  }).optional(),
  deliveryPrice: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional(),
  nextBillingDate: z.string().optional(),
  paymentMethod: z.object({
    dummyPaymentMethod: z.object({}).optional(),
    stripePaymentMethod: z.object({
      paymentMethodId: z.string()
    }).optional()
  }).optional(),
  status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'FAILED', 'PAUSED']).optional()
});

const SubscriptionContractUpdateInputSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  contract: ContractUpdateInputSchema
});

type SubscriptionContractUpdateInput = z.infer<typeof SubscriptionContractUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractUpdate = {
  name: "subscription-contract-update",
  description: "Update a subscription contract",
  schema: SubscriptionContractUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractUpdateInput) => {
    const query = gql`
      mutation subscriptionContractUpdate($contractId: ID!, $contract: SubscriptionContractUpdateInput!) {
        subscriptionContractUpdate(contractId: $contractId, contract: $contract) {
          contract {
            id
            status
            nextBillingDate
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      contractId: input.contractId,
      contract: input.contract
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionContractUpdate;
    } catch (error) {
      console.error("Error updating subscription contract:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractUpdate };