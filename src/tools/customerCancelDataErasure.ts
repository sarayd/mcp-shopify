import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerCancelDataErasureInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required").describe("The ID of the customer to cancel data erasure for")
});
type CustomerCancelDataErasureInput = z.infer<typeof CustomerCancelDataErasureInputSchema>;

let shopifyClient: GraphQLClient;

const customerCancelDataErasure = {
  name: "customer-cancel-data-erasure",
  description: "Cancel a scheduled data erasure for a customer",
  schema: CustomerCancelDataErasureInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerCancelDataErasureInput) => {
    const query = gql`
      mutation customerCancelDataErasure($customerId: ID!) {
        customerCancelDataErasure(customerId: $customerId) {
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
      return response.customerCancelDataErasure;
    } catch (error) {
      console.error("Error canceling customer data erasure:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerCancelDataErasure };