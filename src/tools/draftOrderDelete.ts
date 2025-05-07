import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DraftOrderDeleteInputSchema = z.object({
  id: z.string().min(1, "Draft order ID is required")
});
type DraftOrderDeleteInput = z.infer<typeof DraftOrderDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderDelete = {
  name: "draft-order-delete",
  description: "Delete a draft order",
  schema: DraftOrderDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderDeleteInput) => {
    const query = gql`
      mutation draftOrderDelete($id: ID!) {
        draftOrderDelete(id: $id) {
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
      return response.draftOrderDelete;
    } catch (error) {
      console.error("Error deleting draft order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderDelete };