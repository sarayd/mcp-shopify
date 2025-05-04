import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerSendAccountInviteEmailInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required")
});
type CustomerSendAccountInviteEmailInput = z.infer<typeof CustomerSendAccountInviteEmailInputSchema>;

let shopifyClient: GraphQLClient;

const customerSendAccountInviteEmail = {
  name: "customer-send-account-invite-email",
  description: "Send an account invite email to a customer",
  schema: CustomerSendAccountInviteEmailInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerSendAccountInviteEmailInput) => {
    const query = gql`
      mutation customerSendAccountInviteEmail($customerId: ID!) {
        customerSendAccountInviteEmail(customerId: $customerId) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { customerId: input.customerId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerSendAccountInviteEmail;
    } catch (error) {
      console.error("Error sending customer account invite email:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerSendAccountInviteEmail };