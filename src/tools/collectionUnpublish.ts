import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CollectionUnpublishInputSchema = z.object({
  id: z.string().min(1, "Collection ID is required"),
  channelIds: z.array(z.string()).optional()
});
type CollectionUnpublishInput = z.infer<typeof CollectionUnpublishInputSchema>;

let shopifyClient: GraphQLClient;

const collectionUnpublish = {
  name: "collection-unpublish",
  description: "Unpublish a collection from selected sales channels",
  schema: CollectionUnpublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CollectionUnpublishInput) => {
    const query = gql`
      mutation collectionUnpublish($id: ID!, $channelIds: [ID!]) {
        collectionUnpublish(id: $id, channelIds: $channelIds) {
          collection {
            id
            title
          }
          shop {
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
      id: input.id,
      channelIds: input.channelIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.collectionUnpublish;
    } catch (error) {
      console.error("Error unpublishing collection:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { collectionUnpublish };