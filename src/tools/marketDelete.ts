import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketDeleteInputSchema = z.object({
  id: z.string().min(1, "Market ID is required")
});
type MarketDeleteInput = z.infer<typeof MarketDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const marketDelete = {
  name: "market-delete",
  description: "Delete a market",
  schema: MarketDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketDeleteInput) => {
    const query = gql`
      mutation marketDelete($id: ID!) {
        marketDelete(id: $id) {
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
      return response.marketDelete;
    } catch (error) {
      console.error("Error deleting market:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketDelete };