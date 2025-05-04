import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const InventoryMoveQuantityChangeInputSchema = z.object({
  availableQuantityChange: z.number().int(),
  fromLocationId: z.string(),
  toLocationId: z.string(),
  inventoryItemId: z.string()
});

const InventoryMoveQuantitiesInputSchema = z.object({
  changes: z.array(InventoryMoveQuantityChangeInputSchema).nonempty("At least one change is required"),
  reason: z.string().optional(),
  referenceDocumentUri: z.string().optional()
});

type InventoryMoveQuantitiesInput = z.infer<typeof InventoryMoveQuantitiesInputSchema>;

let shopifyClient: GraphQLClient;

const inventoryMoveQuantities = {
  name: "inventory-move-quantities",
  description: "Move inventory quantities between locations",
  schema: InventoryMoveQuantitiesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventoryMoveQuantitiesInput) => {
    const query = gql`
      mutation inventoryMoveQuantities($input: InventoryMoveQuantitiesInput!) {
        inventoryMoveQuantities(input: $input) {
          inventoryAdjustmentGroup {
            id
            createdAt
            reason
            referenceDocumentUri
            changes {
              id
              delta
              name
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.inventoryMoveQuantities;
    } catch (error) {
      console.error("Error moving inventory quantities:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventoryMoveQuantities };