import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DraftOrderCompleteInputSchema = z.object({
  id: z.string().min(1, "Draft order ID is required"),
  paymentPending: z.boolean().optional(),
  paymentGatewayId: z.string().optional(),
  sourceName: z.string().optional()
});
type DraftOrderCompleteInput = z.infer<typeof DraftOrderCompleteInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderComplete = {
  name: "draft-order-complete",
  description: "Complete a draft order",
  schema: DraftOrderCompleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderCompleteInput) => {
    const query = gql`
      mutation draftOrderComplete($input: DraftOrderCompleteInput!) {
        draftOrderComplete(input: $input) {
          draftOrder {
            id
            order {
              id
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
        paymentPending: input.paymentPending,
        paymentGatewayId: input.paymentGatewayId,
        sourceName: input.sourceName
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.draftOrderComplete;
    } catch (error) {
      console.error("Error completing draft order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderComplete };