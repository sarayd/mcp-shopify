import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for removing a delivery profile
const DeliveryProfileRemoveInputSchema = z.object({
  id: z.string().min(1, "Delivery profile ID is required")
});

type DeliveryProfileRemoveInput = z.infer<typeof DeliveryProfileRemoveInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const deliveryProfileRemove = {
  name: "delivery-profile-remove",
  description: "Remove a delivery profile in Shopify",
  schema: DeliveryProfileRemoveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryProfileRemoveInput) => {
    try {
      const { id } = input;

      // Convert ID to GID format if not already
      const formattedId = id.startsWith("gid://")
        ? id
        : `gid://shopify/DeliveryProfile/${id}`;

      const query = gql`
        mutation deliveryProfileRemove($id: ID!) {
          deliveryProfileRemove(id: $id) {
            deletedProfileId
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { id: formattedId };

      const data = (await shopifyClient.request(query, variables)) as {
        deliveryProfileRemove: {
          deletedProfileId: string | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.deliveryProfileRemove.userErrors.length > 0) {
        throw new Error(
          `Failed to remove delivery profile: ${data.deliveryProfileRemove.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        deletedProfileId: data.deliveryProfileRemove.deletedProfileId
      };
    } catch (error) {
      console.error("Error removing delivery profile:", error);
      throw new Error(
        `Failed to remove delivery profile: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { deliveryProfileRemove };