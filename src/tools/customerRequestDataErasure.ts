import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerRequestDataErasureInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required").describe("The ID of the customer whose data should be erased.")
});
type CustomerRequestDataErasureInput = z.infer<typeof CustomerRequestDataErasureInputSchema>;

let shopifyClient: GraphQLClient;

const customerRequestDataErasure = {
  name: "customer-request-data-erasure",
  description: "Request erasure of customer data from Shopify",
  schema: CustomerRequestDataErasureInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerRequestDataErasureInput) => {
    const query = gql`
      mutation customerRequestDataErasure($customerId: ID!) {
        customerRequestDataErasure(customerId: $customerId) {
          job {
            id
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
      return response.customerRequestDataErasure;
    } catch (error) {
      console.error("Error requesting customer data erasure:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerRequestDataErasure };