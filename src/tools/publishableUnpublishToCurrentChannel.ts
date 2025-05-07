import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for unpublishing a resource
const PublishableUnpublishToCurrentChannelInputSchema = z.object({
  id: z.string().min(1, "Resource ID is required")
});

type PublishableUnpublishToCurrentChannelInput = z.infer<
  typeof PublishableUnpublishToCurrentChannelInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const publishableUnpublishToCurrentChannel = {
  name: "publishable-unpublish-to-current-channel",
  description: "Unpublish a resource from the current sales channel in Shopify",
  schema: PublishableUnpublishToCurrentChannelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PublishableUnpublishToCurrentChannelInput) => {
    try {
      const { id } = input;

      // Assume ID is already in GID format (e.g., Product or Collection)
      const formattedId = id.startsWith("gid://") ? id : `gid://shopify/Product/${id}`;

      const query = gql`
        mutation publishableUnpublishToCurrentChannel($id: ID!) {
          publishableUnpublishToCurrentChannel(id: $id) {
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { id: formattedId };

      const data = (await shopifyClient.request(query, variables)) as {
        publishableUnpublishToCurrentChannel: {
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.publishableUnpublishToCurrentChannel.userErrors.length > 0) {
        throw new Error(
          `Failed to unpublish resource: ${data.publishableUnpublishToCurrentChannel.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        success: true,
        resourceId: formattedId
      };
    } catch (error) {
      console.error("Error unpublishing resource:", error);
      throw new Error(
        `Failed to unpublish resource: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { publishableUnpublishToCurrentChannel };