import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketWebPresenceDeleteInputSchema = z.object({
  id: z.string().min(1, "Market web presence ID is required")
});
type MarketWebPresenceDeleteInput = z.infer<typeof MarketWebPresenceDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const marketWebPresenceDelete = {
  name: "market-web-presence-delete",
  description: "Delete a market web presence",
  schema: MarketWebPresenceDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketWebPresenceDeleteInput) => {
    const query = gql`
      mutation marketWebPresenceDelete($id: ID!) {
        marketWebPresenceDelete(id: $id) {
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
      return response.marketWebPresenceDelete;
    } catch (error) {
      console.error("Error deleting market web presence:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketWebPresenceDelete };