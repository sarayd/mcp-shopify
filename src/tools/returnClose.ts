import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnCloseInputSchema = z.object({
  returnId: z.string().min(1, "Return ID is required"),
  note: z.string().optional()
});
type ReturnCloseInput = z.infer<typeof ReturnCloseInputSchema>;

let shopifyClient: GraphQLClient;

const returnClose = {
  name: "return-close",
  description: "Close a return in Shopify",
  schema: ReturnCloseInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReturnCloseInput) => {
    const query = gql`
      mutation returnClose($returnId: ID!, $note: String) {
        returnClose(input: {
          returnId: $returnId
          note: $note
        }) {
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
      returnId: input.returnId,
      note: input.note
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.returnClose;
    } catch (error) {
      console.error("Error closing return:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { returnClose };