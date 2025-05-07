import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BulkOperationRunMutationInputSchema = z.object({
  mutation: z.string().min(1, "Mutation string is required"),
  count: z.number().optional(),
  stagedUploadPath: z.string().optional()
});
type BulkOperationRunMutationInput = z.infer<typeof BulkOperationRunMutationInputSchema>;

let shopifyClient: GraphQLClient;

const bulkOperationRunMutation = {
  name: "bulk-operation-run-mutation",
  description: "Run a bulk mutation operation in Shopify",
  schema: BulkOperationRunMutationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: BulkOperationRunMutationInput) => {
    const query = gql`
      mutation bulkOperationRunMutation($mutation: String!, $count: Int, $stagedUploadPath: String) {
        bulkOperationRunMutation(
          mutation: $mutation
          count: $count
          stagedUploadPath: $stagedUploadPath
        ) {
          bulkOperation {
            id
            status
            url
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      mutation: input.mutation,
      count: input.count,
      stagedUploadPath: input.stagedUploadPath
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.bulkOperationRunMutation;
    } catch (error) {
      console.error("Error executing bulkOperationRunMutation:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { bulkOperationRunMutation };