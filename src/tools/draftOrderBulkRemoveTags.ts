import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DraftOrderBulkRemoveTagsInputSchema = z.object({
  draftOrderIds: z.array(z.string()).nonempty("At least one draft order ID is required"),
  tags: z.array(z.string()).nonempty("At least one tag is required")
});
type DraftOrderBulkRemoveTagsInput = z.infer<typeof DraftOrderBulkRemoveTagsInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderBulkRemoveTags = {
  name: "draft-order-bulk-remove-tags",
  description: "Remove tags from multiple draft orders",
  schema: DraftOrderBulkRemoveTagsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderBulkRemoveTagsInput) => {
    const query = gql`
      mutation draftOrderBulkRemoveTags($draftOrderIds: [ID!]!, $tags: [String!]!) {
        draftOrderBulkRemoveTags(draftOrderIds: $draftOrderIds, tags: $tags) {
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
      draftOrderIds: input.draftOrderIds,
      tags: input.tags
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.draftOrderBulkRemoveTags;
    } catch (error) {
      console.error("Error removing tags from draft orders:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderBulkRemoveTags };