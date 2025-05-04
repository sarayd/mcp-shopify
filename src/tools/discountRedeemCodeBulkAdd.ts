import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountRedeemCodeInputSchema = z.object({
  code: z.string(),
  recurringCycle: z.enum(['ONCE', 'MULTIPLE']).optional()
});
type DiscountRedeemCodeInput = z.infer<typeof DiscountRedeemCodeInputSchema>;

const DiscountRedeemCodeBulkAddInputSchema = z.object({
  discountId: z.string().min(1, "Discount ID is required"),
  codes: z.array(DiscountRedeemCodeInputSchema).nonempty("At least one code is required")
});
type DiscountRedeemCodeBulkAddInput = z.infer<typeof DiscountRedeemCodeBulkAddInputSchema>;

let shopifyClient: GraphQLClient;

const discountRedeemCodeBulkAdd = {
  name: "discount-redeem-code-bulk-add",
  description: "Bulk add redeem codes to a discount",
  schema: DiscountRedeemCodeBulkAddInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountRedeemCodeBulkAddInput) => {
    const query = gql`
      mutation discountRedeemCodeBulkAdd($discountId: ID!, $codes: [DiscountRedeemCodeInput!]!) {
        discountRedeemCodeBulkAdd(discountId: $discountId, codes: $codes) {
          bulkCreation {
            id
            createdAt
            status
            done
            failedCount
            importedCount
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
      discountId: input.discountId,
      codes: input.codes.map(code => ({
        code: code.code,
        recurringCycle: code.recurringCycle
      }))
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountRedeemCodeBulkAdd;
    } catch (error) {
      console.error("Error executing discountRedeemCodeBulkAdd:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountRedeemCodeBulkAdd };