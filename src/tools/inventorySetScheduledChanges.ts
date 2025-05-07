import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ScheduledChangeInputSchema = z.object({
  inventoryItemId: z.string(),
  availableQuantity: z.number().int(),
  scheduleTimestamp: z.string()
});

const InventorySetScheduledChangesInputSchema = z.object({
  changes: z.array(ScheduledChangeInputSchema).nonempty("At least one scheduled change is required"),
  reason: z.string().optional(),
  referenceDocumentUri: z.string().url().optional()
});

type InventorySetScheduledChangesInput = z.infer<typeof InventorySetScheduledChangesInputSchema>;

let shopifyClient: GraphQLClient;

const inventorySetScheduledChanges = {
  name: "inventory-set-scheduled-changes",
  description: "Schedule future inventory quantity changes",
  schema: InventorySetScheduledChangesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InventorySetScheduledChangesInput) => {
    const query = gql`
      mutation inventorySetScheduledChanges($input: InventorySetScheduledChangesInput!) {
        inventorySetScheduledChanges(input: $input) {
          scheduledChanges {
            changes {
              id
              inventoryItem {
                id
              }
              availableQuantity
              activatesAt
            }
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
        changes: input.changes,
        reason: input.reason,
        referenceDocumentUri: input.referenceDocumentUri
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.inventorySetScheduledChanges;
    } catch (error) {
      console.error("Error setting scheduled inventory changes:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { inventorySetScheduledChanges };