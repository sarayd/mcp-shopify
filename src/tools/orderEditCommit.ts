import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditCommitInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required"),
  notifyCustomer: z.boolean().optional(),
  staffNote: z.string().optional()
});
type OrderEditCommitInput = z.infer<typeof OrderEditCommitInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditCommit = {
  name: "order-edit-commit",
  description: "Commits an order edit to apply the changes to the order",
  schema: OrderEditCommitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditCommitInput) => {
    const query = gql`
      mutation orderEditCommit($input: OrderEditCommitInput!) {
        orderEditCommit(input: $input) {
          orderEdit {
            id
            status
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
        notifyCustomer: input.notifyCustomer,
        staffNote: input.staffNote
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditCommit;
    } catch (error) {
      console.error("Error committing order edit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditCommit };