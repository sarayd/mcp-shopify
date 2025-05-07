import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SetQuantityInputSchema = z.object({
  availableQuantity: z.number().int(),
  locationId: z.string(),
  inventoryItemId: z.string()
});

const InventorySetOnHandQuantitiesInputSchema = z.object({
  reason: z.string(),
  referenceDocumentUri: z.string().optional(),
  setQuantities: z.array(SetQuantityInputSchema).nonempty("At least one quantity update is required")
});

type InventorySetOnHandQuantitiesInput = z.infer<typeof InventorySetOnHandQuantitiesInputSchema>;

let shopifyClient: GraphQLClient;

const inventorySetOnHandQuantities = {
  name: "inventory-set-on-hand-quantities",
  description: "Set on-hand quantities for inventory items at specific locations",
  schema: InventorySetOnHandQuantitiesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventorySetOnHandQuantitiesInput) => {
    const query = gql`
      mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
        inventorySetOnHandQuantities(input: $input) {
          inventoryAdjustmentGroup {
            createdAt
            reason
            referenceDocumentUri
            changes {
              name
              delta
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
      return response.inventorySetOnHandQuantities;
    } catch (error) {
      console.error("Error setting inventory quantities:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventorySetOnHandQuantities };