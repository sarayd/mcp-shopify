import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountCodeRedeemCodeBulkDeleteInputSchema = z.object({
  discountId: z.string().min(1, "Discount ID is required"),
  search: z.string().optional(),
  ids: z.array(z.string()).optional()
});
type DiscountCodeRedeemCodeBulkDeleteInput = z.infer<typeof DiscountCodeRedeemCodeBulkDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeRedeemCodeBulkDelete = {
  name: "discount-code-redeem-code-bulk-delete",
  description: "Bulk delete discount code redeem codes",
  schema: DiscountCodeRedeemCodeBulkDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeRedeemCodeBulkDeleteInput) => {
    const query = gql`
      mutation discountCodeRedeemCodeBulkDelete($discountId: ID!, $search: String, $ids: [ID!]) {
        discountCodeRedeemCodeBulkDelete(discountId: $discountId, search: $search, ids: $ids) {
          job {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      discountId: input.discountId,
      search: input.search,
      ids: input.ids
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountCodeRedeemCodeBulkDelete;
    } catch (error) {
      console.error("Error executing discountCodeRedeemCodeBulkDelete:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeRedeemCodeBulkDelete };