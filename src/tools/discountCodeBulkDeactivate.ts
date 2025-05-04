import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountCodeBulkDeactivateInputSchema = z.object({
  search: z.string().optional(),
  ids: z.array(z.string()).optional(),
  savedSearchId: z.string().optional()
}).refine(
  data => data.search !== undefined || data.ids !== undefined || data.savedSearchId !== undefined,
  "At least one of search, ids, or savedSearchId must be provided"
);

type DiscountCodeBulkDeactivateInput = z.infer<typeof DiscountCodeBulkDeactivateInputSchema>;

let shopifyClient: GraphQLClient;

const discountCodeBulkDeactivate = {
  name: "discount-code-bulk-deactivate",
  description: "Bulk deactivate discount codes based on search criteria or IDs",
  schema: DiscountCodeBulkDeactivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeBulkDeactivateInput) => {
    const query = gql`
      mutation discountCodeBulkDeactivate($search: String, $ids: [ID!], $savedSearchId: ID) {
        discountCodeBulkDeactivate(search: $search, ids: $ids, savedSearchId: $savedSearchId) {
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
      search: input.search,
      ids: input.ids,
      savedSearchId: input.savedSearchId
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountCodeBulkDeactivate;
    } catch (error) {
      console.error("Error executing discountCodeBulkDeactivate:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountCodeBulkDeactivate };