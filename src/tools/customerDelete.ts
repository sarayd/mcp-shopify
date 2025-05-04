import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerDeleteInputSchema = z.object({
  id: z.string().min(1, "Customer ID is required")
});
type CustomerDeleteInput = z.infer<typeof CustomerDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const customerDelete = {
  name: "customer-delete",
  description: "Delete a customer",
  schema: CustomerDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerDeleteInput) => {
    const query = gql`
      mutation customerDelete($input: CustomerDeleteInput!) {
        customerDelete(input: $input) {
          deletedCustomerId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerDelete;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerDelete };