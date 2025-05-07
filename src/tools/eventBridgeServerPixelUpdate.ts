import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SettingSchema = z.object({
  key: z.string(),
  value: z.string()
});

const EventBridgeServerPixelUpdateInputSchema = z.object({
  id: z.string().min(1, "Event Bridge Server Pixel ID is required"),
  webPixelId: z.string().optional(),
  apiClientId: z.string().optional(),
  settings: z.array(SettingSchema).optional()
});

type EventBridgeServerPixelUpdateInput = z.infer<typeof EventBridgeServerPixelUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const eventBridgeServerPixelUpdate = {
  name: "event-bridge-server-pixel-update",
  description: "Updates an Event Bridge Server Pixel",
  schema: EventBridgeServerPixelUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: EventBridgeServerPixelUpdateInput) => {
    const query = gql`
      mutation eventBridgeServerPixelUpdate($input: EventBridgeServerPixelUpdateInput!) {
        eventBridgeServerPixelUpdate(input: $input) {
          eventBridgeServerPixel {
            id
            webPixelId
            apiClientId
            settings {
              key
              value
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
        id: input.id,
        webPixelId: input.webPixelId,
        apiClientId: input.apiClientId,
        settings: input.settings
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.eventBridgeServerPixelUpdate;
    } catch (error) {
      console.error("Error updating event bridge server pixel:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { eventBridgeServerPixelUpdate };