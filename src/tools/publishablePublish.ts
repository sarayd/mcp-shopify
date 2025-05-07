import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublishablePublishInputSchema = z.object({
  id: z.string().min(1, "Resource ID is required"),
  input: z.object({
    availableAt: z.string().datetime().optional(),
    publishDate: z.string().datetime().optional()
  }).optional()
});
type PublishablePublishInput = z.infer<typeof PublishablePublishInputSchema>;

let shopifyClient: GraphQLClient;

const publishablePublish = {
  name: "publishable-publish",
  description: "Publish a publishable resource",
  schema: PublishablePublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PublishablePublishInput) => {
    const query = gql`
      mutation publishablePublish($id: ID!, $input: PublishablePublishInput) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            availableAt
            publishedAt
            resourceId
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.publishablePublish;
    } catch (error) {
      console.error("Error publishing resource:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { publishablePublish };