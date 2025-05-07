import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublicationInputSchema = z.object({
  channelId: z.string().min(1, "Channel ID is required"),
  publishDate: z.string().optional()
});

const CollectionPublishInputSchema = z.object({
  id: z.string().min(1, "Collection ID is required"),
  input: z.object({
    publications: z.array(PublicationInputSchema).nonempty("At least one publication is required")
  })
});

type CollectionPublishInput = z.infer<typeof CollectionPublishInputSchema>;

let shopifyClient: GraphQLClient;

const collectionPublish = {
  name: "collection-publish",
  description: "Publish a collection to selected channels",
  schema: CollectionPublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CollectionPublishInput) => {
    const query = gql`
      mutation collectionPublish($id: ID!, $input: CollectionPublishInput!) {
        collectionPublish(id: $id, input: $input) {
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.collectionPublish;
    } catch (error) {
      console.error("Error publishing collection:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { collectionPublish };