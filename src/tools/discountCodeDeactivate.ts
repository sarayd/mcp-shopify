import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountCodeDeactivateInputSchema = z.object({
  id: z.string().min(1, "Discount code ID is required").describe("The ID of the discount code to deactivate")
});
type DiscountCodeDeactivateInput = z.infer<typeof DiscountCodeDeactivateInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeDeactivate = {
  name: "discount-code-deactivate",
  description: "Deactivate a discount code",
  schema: DiscountCodeDeactivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeDeactivateInput) => {
    const query = gql`
      mutation discountCodeDeactivate($id: ID!) {
        discountCodeDeactivate(id: $id) {
          codeDiscountNode {
            codeDiscount {
              ... on DiscountCodeBasic {
                id
                title
                status
                startsAt
                endsAt
              }
              ... on DiscountCodeBxgy {
                id
                title
                status
                startsAt
                endsAt
              }
              ... on DiscountCodeFreeShipping {
                id
                title
                status
                startsAt
                endsAt
              }
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountCodeDeactivate;
    } catch (error) {
      console.error("Error deactivating discount code:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeDeactivate };