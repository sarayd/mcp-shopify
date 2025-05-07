import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BulkOperationCancelInputSchema = z.object({
  id: z.string().min(1, "Bulk operation ID is required").describe("The ID of the bulk operation to cancel")
});
type BulkOperationCancelInput = z.infer<typeof BulkOperationCancelInputSchema>;

let shopifyClient: GraphQLClient;

const bulkOperationCancel = {
  name: "bulk-operation-cancel",
  description: "Cancel a bulk operation",
  schema: BulkOperationCancelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: BulkOperationCancelInput) => {
    const query = gql`
      mutation bulkOperationCancel($id: ID!) {
        bulkOperationCancel(id: $id) {
          bulkOperation {
            id
            status
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
      return response.bulkOperationCancel;
    } catch (error) {
      console.error("Error canceling bulk operation:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { bulkOperationCancel };