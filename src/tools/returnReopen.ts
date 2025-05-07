import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnReopenInputSchema = z.object({
  id: z.string().min(1, "Return ID is required"),
  note: z.string().optional()
});
type ReturnReopenInput = z.infer<typeof ReturnReopenInputSchema>;

let shopifyClient: GraphQLClient;

const returnReopen = {
  name: "return-reopen",
  description: "Reopen a closed return",
  schema: ReturnReopenInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReturnReopenInput) => {
    const query = gql`
      mutation returnReopen($id: ID!, $note: String) {
        returnReopen(id: $id, note: $note) {
          return {
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
    const variables = {
      id: input.id,
      note: input.note
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.returnReopen;
    } catch (error) {
      console.error("Error reopening return:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { returnReopen };