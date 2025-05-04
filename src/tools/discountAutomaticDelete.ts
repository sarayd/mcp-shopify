import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountAutomaticDeleteInputSchema = z.object({
  id: z.string().min(1, "Discount ID is required")
});
type DiscountAutomaticDeleteInput = z.infer<typeof DiscountAutomaticDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticDelete = {
  name: "discount-automatic-delete",
  description: "Delete an automatic discount",
  schema: DiscountAutomaticDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticDeleteInput) => {
    const query = gql`
      mutation discountAutomaticDelete($input: DiscountAutomaticDeleteInput!) {
        discountAutomaticDelete(input: $input) {
          deletedAutomaticDiscountId
          userErrors {
            field
            code
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountAutomaticDelete;
    } catch (error) {
      console.error("Error deleting automatic discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticDelete };