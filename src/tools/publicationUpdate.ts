import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublicationUpdateInputSchema = z.object({
  id: z.string().min(1, "Publication ID is required"),
  input: z.object({
    autoPublish: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    publishDate: z.string().optional(),
    publishablesToAdd: z.array(z.string()).max(50).optional(),
    publishablesToRemove: z.array(z.string()).max(50).optional()
  })
});
type PublicationUpdateInput = z.infer<typeof PublicationUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const publicationUpdate = {
  name: "publication-update",
  description: "Update a publication in Shopify",
  schema: PublicationUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PublicationUpdateInput) => {
    const query = gql`
      mutation publicationUpdate($id: ID!, $input: PublicationInput!) {
        publicationUpdate(id: $id, input: $input) {
          publication {
            id
            name
            autoPublish
            isPublished
            publishDate
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
      return response.publicationUpdate;
    } catch (error) {
      console.error("Error updating publication:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { publicationUpdate };