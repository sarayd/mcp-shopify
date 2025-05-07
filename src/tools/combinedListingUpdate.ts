import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating a combined listing
const CombinedListingUpdateInputSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  updates: z
    .object({
      title: z.string().optional(),
      price: z.string().optional()
    })
    .optional()
});

type CombinedListingUpdateInput = z.infer<typeof CombinedListingUpdateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const combinedListingUpdate = {
  name: "combined-listing-update",
  description: "Update a combined listing in Shopify",
  schema: CombinedListingUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CombinedListingUpdateInput) => {
    try {
      const { listingId, updates } = input;

      // Convert listing ID to GID format if not already
      const formattedListingId = listingId.startsWith("gid://")
        ? listingId
        : `gid://shopify/CombinedListing/${listingId}`;

      const query = gql`
        mutation combinedListingUpdate($input: CombinedListingInput!) {
          combinedListingUpdate(input: $input) {
            listing {
              id
              title
              price
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        input: {
          id: formattedListingId,
          ...updates
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        combinedListingUpdate: {
          listing: {
            id: string;
            title: string | null;
            price: string | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.combinedListingUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update combined listing: ${data.combinedListingUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { listing } = data.combinedListingUpdate;
      return {
        listing: listing
          ? {
              id: listing.id,
              title: listing.title,
              price: listing.price
            }
          : null
      };
    } catch (error) {
      console.error("Error updating combined listing:", error);
      throw new Error(
        `Failed to update combined listing: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { combinedListingUpdate };