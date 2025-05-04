import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountAutomaticDeactivateInputSchema = z.object({
  id: z.string().min(1, "Discount ID is required")
});
type DiscountAutomaticDeactivateInput = z.infer<typeof DiscountAutomaticDeactivateInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticDeactivate = {
  name: "discount-automatic-deactivate",
  description: "Deactivate an automatic discount",
  schema: DiscountAutomaticDeactivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticDeactivateInput) => {
    const query = gql`
      mutation discountAutomaticDeactivate($id: ID!) {
        discountAutomaticDeactivate(id: $id) {
          automaticDiscountNode {
            id
            automaticDiscount {
              status
              startsAt
              endsAt
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountAutomaticDeactivate;
    } catch (error) {
      console.error("Error deactivating automatic discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticDeactivate };