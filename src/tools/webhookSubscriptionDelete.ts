import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebhookSubscriptionDeleteInputSchema = z.object({
  id: z.string().min(1, "Webhook subscription ID is required").describe("The ID of the webhook subscription to delete")
});
type WebhookSubscriptionDeleteInput = z.infer<typeof WebhookSubscriptionDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const webhookSubscriptionDelete = {
  name: "webhook-subscription-delete",
  description: "Delete a webhook subscription",
  schema: WebhookSubscriptionDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: WebhookSubscriptionDeleteInput) => {
    const query = gql`
      mutation webhookSubscriptionDelete($id: ID!) {
        webhookSubscriptionDelete(id: $id) {
          deletedWebhookSubscriptionId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.webhookSubscriptionDelete;
    } catch (error) {
      console.error("Error deleting webhook subscription:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { webhookSubscriptionDelete };