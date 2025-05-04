import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublishablePublishToCurrentChannelInputSchema = z.object({
  id: z.string().min(1, "Resource ID is required"),
  input: z.object({
    publishDate: z.string().optional(),
    shouldPublish: z.boolean()
  })
});
type PublishablePublishToCurrentChannelInput = z.infer<typeof PublishablePublishToCurrentChannelInputSchema>;

let shopifyClient: GraphQLClient;

const publishablePublishToCurrentChannel = {
  name: "publishable-publish-to-current-channel",
  description: "Publish a publishable resource to the current channel",
  schema: PublishablePublishToCurrentChannelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PublishablePublishToCurrentChannelInput) => {
    const query = gql`
      mutation publishablePublishToCurrentChannel($id: ID!, $input: PublishablePublishToCurrentChannelInput!) {
        publishablePublishToCurrentChannel(id: $id, input: $input) {
          publishable {
            availablePublicationCount
            resourcePublicationCount
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
      input: {
        publishDate: input.input.publishDate,
        shouldPublish: input.input.shouldPublish
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.publishablePublishToCurrentChannel;
    } catch (error) {
      console.error("Error publishing to current channel:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { publishablePublishToCurrentChannel };