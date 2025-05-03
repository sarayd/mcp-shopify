import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating a PubSub server pixel
const PubSubServerPixelUpdateInputSchema = z.object({
  pixelId: z.string().min(1, "Pixel ID is required"),
  settings: z
    .object({
      accountId: z.string().optional(),
      enabled: z.boolean().optional()
    })
    .optional()
    .describe("Optional settings for the pixel, e.g., account ID or enabled status")
});

type PubSubServerPixelUpdateInput = z.infer<typeof PubSubServerPixelUpdateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const pubSubServerPixelUpdate = {
  name: "pub-sub-server-pixel-update",
  description: "Update a PubSub server pixel for analytics tracking in Shopify",
  schema: PubSubServerPixelUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PubSubServerPixelUpdateInput) => {
    try {
      const { pixelId, settings } = input;

      // Convert pixel ID to GID format if not already
      const formattedPixelId = pixelId.startsWith("gid://")
        ? pixelId
        : `gid://shopify/AppPixel/${pixelId}`;

      const query = gql`
        mutation pubSubServerPixelUpdate($pixelId: ID!, $settings: JSON) {
          pubSubServerPixelUpdate(pixelId: $pixelId, settings: $settings) {
            pixel {
              id
              app {
                id
                title
              }
              settings
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        pixelId: formattedPixelId,
        settings: settings ? JSON.stringify(settings) : null
      };

      const data = (await shopifyClient.request(query, variables)) as {
        pubSubServerPixelUpdate: {
          pixel: {
            id: string;
            app: { id: string; title: string } | null;
            settings: string | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.pubSubServerPixelUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update PubSub server pixel: ${data.pubSubServerPixelUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { pixel } = data.pubSubServerPixelUpdate;
      return {
        pixel: pixel
          ? {
              id: pixel.id,
              app: pixel.app ? { id: pixel.app.id, title: pixel.app.title } : null,
              settings: pixel.settings ? JSON.parse(pixel.settings) : null
            }
          : null
      };
    } catch (error) {
      console.error("Error updating PubSub server pixel:", error);
      throw new Error(
        `Failed to update PubSub server pixel: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { pubSubServerPixelUpdate };