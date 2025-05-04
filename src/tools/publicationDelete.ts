import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublicationDeleteInputSchema = z.object({
  id: z.string().min(1, "Publication ID is required").describe("The ID of the publication to delete")
});
type PublicationDeleteInput = z.infer<typeof PublicationDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const publicationDelete = {
  name: "publication-delete",
  description: "Delete a publication",
  schema: PublicationDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PublicationDeleteInput) => {
    const query = gql`
      mutation publicationDelete($id: ID!) {
        publicationDelete(id: $id) {
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
      return response.publicationDelete;
    } catch (error) {
      console.error("Error deleting publication:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { publicationDelete };