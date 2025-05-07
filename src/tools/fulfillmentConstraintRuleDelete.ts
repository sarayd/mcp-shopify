import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentConstraintRuleDeleteInputSchema = z.object({
  id: z.string().min(1, "Rule ID is required")
});
type FulfillmentConstraintRuleDeleteInput = z.infer<typeof FulfillmentConstraintRuleDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentConstraintRuleDelete = {
  name: "fulfillment-constraint-rule-delete",
  description: "Delete a fulfillment constraint rule",
  schema: FulfillmentConstraintRuleDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentConstraintRuleDeleteInput) => {
    const query = gql`
      mutation fulfillmentConstraintRuleDelete($id: ID!) {
        fulfillmentConstraintRuleDelete(id: $id) {
          deletedId
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
      return response.fulfillmentConstraintRuleDelete;
    } catch (error) {
      console.error("Error deleting fulfillment constraint rule:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentConstraintRuleDelete };