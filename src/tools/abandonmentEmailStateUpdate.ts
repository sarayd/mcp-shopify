import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AbandonmentEmailStateUpdateInputSchema = z.object({
  id: z.string().min(1, "ID is required"),
  emailState: z.enum(['SENT', 'SCHEDULED', 'UNSUBSCRIBED']),
  emailType: z.enum(['ABANDONED_CHECKOUT', 'ABANDONED_CART'])
});
type AbandonmentEmailStateUpdateInput = z.infer<typeof AbandonmentEmailStateUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const abandonmentEmailStateUpdate = {
  name: "abandonment-email-state-update",
  description: "Update the state of an abandonment email",
  schema: AbandonmentEmailStateUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: AbandonmentEmailStateUpdateInput) => {
    const query = gql`
      mutation abandonmentEmailStateUpdate($input: AbandonmentEmailStateUpdateInput!) {
        abandonmentEmailStateUpdate(input: $input) {
          abandonmentEmail {
            id
            emailState
            emailType
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
        emailState: input.emailState,
        emailType: input.emailType
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.abandonmentEmailStateUpdate;
    } catch (error) {
      console.error("Error updating abandonment email state:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { abandonmentEmailStateUpdate };