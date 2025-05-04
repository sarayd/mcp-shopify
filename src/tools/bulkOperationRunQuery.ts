import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BulkOperationRunQueryInputSchema = z.object({
  query: z.string().min(1, "Query is required")
});
type BulkOperationRunQueryInput = z.infer<typeof BulkOperationRunQueryInputSchema>;

let shopifyClient: GraphQLClient;

const bulkOperationRunQuery = {
  name: "bulk-operation-run-query",
  description: "Run a bulk operation query in Shopify",
  schema: BulkOperationRunQueryInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: BulkOperationRunQueryInput) => {
    const query = gql`
      mutation bulkOperationRunQuery($query: String!) {
        bulkOperationRunQuery(query: $query) {
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
    const variables = { query: input.query };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.bulkOperationRunQuery;
    } catch (error) {
      console.error("Error executing bulk operation query:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { bulkOperationRunQuery };