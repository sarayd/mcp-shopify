import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShopPolicyUpdateInputSchema = z.object({
  handle: z.enum(['LEGAL', 'PRIVACY', 'REFUND', 'SHIPPING', 'SUBSCRIPTION', 'TERMS_OF_SALE', 'TERMS_OF_SERVICE']),
  body: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional()
});
type ShopPolicyUpdateInput = z.infer<typeof ShopPolicyUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const shopPolicyUpdate = {
  name: "shop-policy-update",
  description: "Update a shop policy",
  schema: ShopPolicyUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShopPolicyUpdateInput) => {
    const query = gql`
      mutation shopPolicyUpdate($input: ShopPolicyInput!) {
        shopPolicyUpdate(input: $input) {
          shopPolicy {
            id
            title
            body
            url
            handle
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
      return response.shopPolicyUpdate;
    } catch (error) {
      console.error("Error updating shop policy:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shopPolicyUpdate };