import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const QuantityRuleDeleteInputSchema = z.object({
  id: z.string().min(1, "Quantity rule ID is required")
});
type QuantityRuleDeleteInput = z.infer<typeof QuantityRuleDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const quantityRulesDelete = {
  name: "quantity-rules-delete",
  description: "Delete a quantity rule",
  schema: QuantityRuleDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: QuantityRuleDeleteInput) => {
    const query = gql`
      mutation quantityRuleDelete($id: ID!) {
        quantityRuleDelete(id: $id) {
          deletedQuantityRuleId
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
      return response.quantityRuleDelete;
    } catch (error) {
      console.error("Error deleting quantity rule:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { quantityRulesDelete };