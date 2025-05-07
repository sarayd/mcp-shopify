import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CollectionDeleteInputSchema = z.object({
  id: z.string().min(1, "Collection ID is required")
});
type CollectionDeleteInput = z.infer<typeof CollectionDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const collectionDelete = {
  name: "collection-delete",
  description: "Delete a collection",
  schema: CollectionDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CollectionDeleteInput) => {
    const query = gql`
      mutation collectionDelete($id: ID!) {
        collectionDelete(input: { id: $id }) {
          deletedCollectionId
          shop {
            id
            name
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
      return response.collectionDelete;
    } catch (error) {
      console.error("Error deleting collection:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { collectionDelete };