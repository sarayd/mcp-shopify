import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const InventoryAdjustQuantityChangeInputSchema = z.object({
  delta: z.number().int(),
  locationId: z.string(),
  variantId: z.string()
});

const InventoryAdjustQuantitiesInputSchema = z.object({
  changes: z.array(InventoryAdjustQuantityChangeInputSchema).nonempty("At least one change is required"),
  name: z.string().optional(),
  reason: z.string().optional(),
  referenceDocumentUri: z.string().optional()
});

type InventoryAdjustQuantitiesInput = z.infer<typeof InventoryAdjustQuantitiesInputSchema>;

let shopifyClient: GraphQLClient;

const inventoryAdjustQuantities = {
  name: "inventory-adjust-quantities",
  description: "Adjust inventory quantities for multiple variants",
  schema: InventoryAdjustQuantitiesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventoryAdjustQuantitiesInput) => {
    const query = gql`
      mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
        inventoryAdjustQuantities(input: $input) {
          inventoryAdjustmentGroup {
            id
            createdAt
            name
            reason
            referenceDocumentUri
            changes {
              id
              delta
              variant {
                id
              }
              location {
                id
              }
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
      return response.inventoryAdjustQuantities;
    } catch (error) {
      console.error("Error adjusting inventory quantities:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventoryAdjustQuantities };