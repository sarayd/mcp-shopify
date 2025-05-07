import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const InventoryActivateInputSchema = z.object({
  inventoryItemId: z.string().min(1, "Inventory Item ID is required"),
  locationId: z.string().min(1, "Location ID is required"),
  available: z.number().int().optional(),
  onHand: z.number().int().optional(),
  stockAtLegacyLocation: z.boolean().optional()
});
type InventoryActivateInput = z.infer<typeof InventoryActivateInputSchema>;

let shopifyClient: GraphQLClient;

const inventoryActivate = {
  name: "inventory-activate",
  description: "Activate inventory at a location",
  schema: InventoryActivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventoryActivateInput) => {
    const query = gql`
      mutation inventoryActivate(
        $inventoryItemId: ID!
        $locationId: ID!
        $available: Int
        $onHand: Int
        $stockAtLegacyLocation: Boolean
      ) {
        inventoryActivate(
          inventoryItemId: $inventoryItemId
          locationId: $locationId
          available: $available
          onHand: $onHand
          stockAtLegacyLocation: $stockAtLegacyLocation
        ) {
          inventoryLevel {
            id
            available
            item {
              id
            }
            location {
              id
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, {
        inventoryItemId: input.inventoryItemId,
        locationId: input.locationId,
        available: input.available,
        onHand: input.onHand,
        stockAtLegacyLocation: input.stockAtLegacyLocation
      });
      return response.inventoryActivate;
    } catch (error) {
      console.error("Error activating inventory:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventoryActivate };