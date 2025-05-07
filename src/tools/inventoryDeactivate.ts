import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const InventoryDeactivateInputSchema = z.object({
  inventoryLevelId: z.string().min(1, "Inventory Level ID is required")
});
type InventoryDeactivateInput = z.infer<typeof InventoryDeactivateInputSchema>;

let shopifyClient: GraphQLClient;

const inventoryDeactivate = {
  name: "inventory-deactivate",
  description: "Deactivate an inventory level",
  schema: InventoryDeactivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventoryDeactivateInput) => {
    const query = gql`
      mutation inventoryDeactivate($inventoryLevelId: ID!) {
        inventoryDeactivate(inventoryLevelId: $inventoryLevelId) {
          inventoryLevel {
            id
            available
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { inventoryLevelId: input.inventoryLevelId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.inventoryDeactivate;
    } catch (error) {
      console.error("Error deactivating inventory:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventoryDeactivate };