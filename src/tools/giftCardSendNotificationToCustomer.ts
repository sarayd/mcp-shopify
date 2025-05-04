import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const GiftCardSendNotificationInputSchema = z.object({
  giftCardId: z.string().min(1, "Gift card ID is required"),
  email: z.string().email("Valid email is required"),
  customMessage: z.string().optional()
});
type GiftCardSendNotificationInput = z.infer<typeof GiftCardSendNotificationInputSchema>;

let shopifyClient: GraphQLClient;

const giftCardSendNotificationToCustomer = {
  name: "gift-card-send-notification-to-customer",
  description: "Send a notification email to a customer about their gift card",
  schema: GiftCardSendNotificationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: GiftCardSendNotificationInput) => {
    const query = gql`
      mutation giftCardSendNotificationToCustomer($input: GiftCardSendNotificationToCustomerInput!) {
        giftCardSendNotificationToCustomer(input: $input) {
          giftCard {
            id
            customer {
              id
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
      return response.giftCardSendNotificationToCustomer;
    } catch (error) {
      console.error("Error sending gift card notification:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { giftCardSendNotificationToCustomer };