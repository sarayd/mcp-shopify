import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const GiftCardSendNotificationInputSchema = z.object({
  giftCardId: z.string().min(1, "Gift card ID is required"),
  email: z.string().email("Valid email is required"),
  customMessage: z.string().optional()
});
type GiftCardSendNotificationInput = z.infer<typeof GiftCardSendNotificationInputSchema>;

let shopifyClient: GraphQLClient;

const giftCardSendNotificationToRecipient = {
  name: "gift-card-send-notification-to-recipient",
  description: "Send a notification to a gift card recipient",
  schema: GiftCardSendNotificationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: GiftCardSendNotificationInput) => {
    const query = gql`
      mutation giftCardSendNotificationToRecipient($input: GiftCardSendNotificationToRecipientInput!) {
        giftCardSendNotificationToRecipient(input: $input) {
          giftCard {
            id
            lastCharacters
            expiresOn
            recipient {
              email
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
        giftCardId: input.giftCardId,
        email: input.email,
        customMessage: input.customMessage
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.giftCardSendNotificationToRecipient;
    } catch (error) {
      console.error("Error sending gift card notification:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { giftCardSendNotificationToRecipient };