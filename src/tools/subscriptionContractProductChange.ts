import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionContractProductChangeInputSchema = z.object({
  subscriptionContractId: z.string().min(1, "Subscription Contract ID is required"),
  lineId: z.string().min(1, "Line ID is required"),
  input: z.object({
    productVariantId: z.string().min(1, "Product Variant ID is required"),
    currentPrice: z.number().min(0, "Current price must be non-negative")
  })
});
type SubscriptionContractProductChangeInput = z.infer<typeof SubscriptionContractProductChangeInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionContractProductChange = {
  name: "subscription-contract-product-change",
  description: "Change a product in a subscription contract",
  schema: SubscriptionContractProductChangeInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionContractProductChangeInput) => {
    const query = gql`
      mutation subscriptionContractProductChange(
        $subscriptionContractId: ID!
        $lineId: ID!
        $input: SubscriptionLineUpdateInput!
      ) {
        subscriptionContractProductChange(
          subscriptionContractId: $subscriptionContractId
          lineId: $lineId
          input: $input
        ) {
          contract {
            id
            updatedAt
          }
          lineUpdated {
            id
            currentPrice {
              amount
            }
            variantId
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      subscriptionContractId: input.subscriptionContractId,
      lineId: input.lineId,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionContractProductChange;
    } catch (error) {
      console.error("Error executing subscriptionContractProductChange:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionContractProductChange };