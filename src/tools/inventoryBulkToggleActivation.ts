import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const InventoryItemUpdateSchema = z.object({
  activate: z.boolean(),
  inventoryItemId: z.string(),
  locationId: z.string()
});
type InventoryItemUpdate = z.infer<typeof InventoryItemUpdateSchema>;

const InventoryBulkToggleActivationInputSchema = z.object({
  inventoryItemUpdates: z.array(InventoryItemUpdateSchema).nonempty("At least one inventory item update is required")
});
type InventoryBulkToggleActivationInput = z.infer<typeof InventoryBulkToggleActivationInputSchema>;

let shopifyClient: GraphQLClient;

const inventoryBulkToggleActivation = {
  name: "inventory-bulk-toggle-activation",
  description: "Bulk toggle activation status for inventory items",
  schema: InventoryBulkToggleActivationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventoryBulkToggleActivationInput) => {
    const query = gql`
      mutation inventoryBulkToggleActivation($inventoryItemUpdates: [InventoryBulkToggleActivationInput!]!) {
        inventoryBulkToggleActivation(inventoryItemUpdates: $inventoryItemUpdates) {
          inventoryLevels {
            id
            available
            activated
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
    const variables = { inventoryItemUpdates: input.inventoryItemUpdates };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.inventoryBulkToggleActivation;
    } catch (error) {
      console.error("Error executing inventoryBulkToggleActivation:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventoryBulkToggleActivation };