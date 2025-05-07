import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetaobjectBulkDeleteInputSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required")
});
type MetaobjectBulkDeleteInput = z.infer<typeof MetaobjectBulkDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectBulkDelete = {
  name: "metaobject-bulk-delete",
  description: "Bulk delete metaobjects by their IDs",
  schema: MetaobjectBulkDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectBulkDeleteInput) => {
    const query = gql`
      mutation metaobjectBulkDelete($ids: [ID!]!) {
        metaobjectBulkDelete(ids: $ids) {
          bulkDeleteMetaobjectJobId
          userErrors {
            field
            message
            code
          }
        }
      }
    `;
    const variables = { ids: input.ids };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metaobjectBulkDelete;
    } catch (error) {
      console.error("Error executing metaobjectBulkDelete:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectBulkDelete };