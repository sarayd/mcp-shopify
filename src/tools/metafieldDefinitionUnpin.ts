import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for unpinning a metafield definition
const MetafieldDefinitionUnpinInputSchema = z.object({
  id: z.string().min(1, "Metafield definition ID is required")
});

type MetafieldDefinitionUnpinInput = z.infer<typeof MetafieldDefinitionUnpinInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const metafieldDefinitionUnpin = {
  name: "metafield-definition-unpin",
  description: "Unpin a metafield definition in Shopify",
  schema: MetafieldDefinitionUnpinInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetafieldDefinitionUnpinInput) => {
    try {
      const { id } = input;

      // Convert ID to GID format if not already
      const formattedId = id.startsWith("gid://")
        ? id
        : `gid://shopify/MetafieldDefinition/${id}`;

      const query = gql`
        mutation metafieldDefinitionUnpin($id: ID!) {
          metafieldDefinitionUnpin(id: $id) {
            metafieldDefinition {
              id
              namespace
              key
              pinnedPosition
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { id: formattedId };

      const data = (await shopifyClient.request(query, variables)) as {
        metafieldDefinitionUnpin: {
          metafieldDefinition: {
            id: string;
            namespace: string;
            key: string;
            pinnedPosition: number | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.metafieldDefinitionUnpin.userErrors.length > 0) {
        throw new Error(
          `Failed to unpin metafield definition: ${data.metafieldDefinitionUnpin.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { metafieldDefinition } = data.metafieldDefinitionUnpin;
      return {
        metafieldDefinition: metafieldDefinition
          ? {
              id: metafieldDefinition.id,
              namespace: metafieldDefinition.namespace,
              key: metafieldDefinition.key,
              pinnedPosition: metafieldDefinition.pinnedPosition
            }
          : null
      };
    } catch (error) {
      console.error("Error unpinning metafield definition:", error);
      throw new Error(
        `Failed to unpin metafield definition: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { metafieldDefinitionUnpin };