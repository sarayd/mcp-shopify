import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryMethodSchema = z.object({
  shipping: z.object({
    address: z.object({
      address1: z.string(),
      address2: z.string().optional(),
      city: z.string(),
      country: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string().optional(),
      province: z.string(),
      zip: z.string()
    })
  }).optional()
});

const LineSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().int().positive(),
  sellingPlanId: z.string().optional()
});

const ContractSchema = z.object({
  deliveryMethod: DeliveryMethodSchema,
  deliveryPrice: z.number().optional(),
  lines: z.array(LineSchema).nonempty(),
  note: z.string().optional()
});

const SubscriptionContractCreateInputSchema = z.object({
  contract: ContractSchema,
  customerId: z.string().min(1, "Customer ID is required"),
  nextBillingDate: z.string().datetime(),
  currencyCode: z.string()
});

type SubscriptionContractCreateInput = z.infer<typeof SubscriptionContractCreateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractCreate = {
  name: "subscription-contract-create",
  description: "Create a new subscription contract",
  schema: SubscriptionContractCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractCreateInput) => {
    const query = gql`
      mutation subscriptionContractCreate($input: SubscriptionContractCreateInput!) {
        subscriptionContractCreate(input: $input) {
          draft {
            id
            status
            nextBillingDate
            customer {
              id
            }
            lines {
              id
              productVariant {
                id
              }
              quantity
            }
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
      return response.subscriptionContractCreate;
    } catch (error) {
      console.error("Error creating subscription contract:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractCreate };