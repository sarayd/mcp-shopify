import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DraftOrderDuplicateInputSchema = z.object({
  id: z.string().min(1, "Draft order ID is required")
});
type DraftOrderDuplicateInput = z.infer<typeof DraftOrderDuplicateInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderDuplicate = {
  name: "draft-order-duplicate",
  description: "Duplicate an existing draft order",
  schema: DraftOrderDuplicateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderDuplicateInput) => {
    const query = gql`
      mutation draftOrderDuplicate($id: ID!) {
        draftOrderDuplicate(id: $id) {
          draftOrder {
            id
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
      return response.draftOrderDuplicate;
    } catch (error) {
      console.error("Error duplicating draft order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderDuplicate };