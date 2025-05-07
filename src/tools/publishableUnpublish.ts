import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublishableUnpublishInputSchema = z.object({
  id: z.string().min(1, "Publishable ID is required")
});
type PublishableUnpublishInput = z.infer<typeof PublishableUnpublishInputSchema>;

let shopifyClient: GraphQLClient;

const publishableUnpublish = {
  name: "publishable-unpublish",
  description: "Unpublish a publishable resource",
  schema: PublishableUnpublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PublishableUnpublishInput) => {
    const query = gql`
      mutation publishableUnpublish($id: ID!) {
        publishableUnpublish(id: $id) {
          publishable {
            id
            publishedOnCurrentPublication
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
      return response.publishableUnpublish;
    } catch (error) {
      console.error("Error unpublishing resource:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { publishableUnpublish };