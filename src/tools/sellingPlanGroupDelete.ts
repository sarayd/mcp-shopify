import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanGroupDeleteInputSchema = z.object({
  id: z.string().min(1, "Selling plan group ID is required")
});
type SellingPlanGroupDeleteInput = z.infer<typeof SellingPlanGroupDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const sellingPlanGroupDelete = {
  name: "selling-plan-group-delete",
  description: "Delete a selling plan group",
  schema: SellingPlanGroupDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SellingPlanGroupDeleteInput) => {
    const query = gql`
      mutation sellingPlanGroupDelete($id: ID!) {
        sellingPlanGroupDelete(id: $id) {
          deletedSellingPlanGroupId
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
      return response.sellingPlanGroupDelete;
    } catch (error) {
      console.error("Error deleting selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupDelete };