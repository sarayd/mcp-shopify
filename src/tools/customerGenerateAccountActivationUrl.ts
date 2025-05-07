import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerGenerateAccountActivationUrlInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required")
});
type CustomerGenerateAccountActivationUrlInput = z.infer<typeof CustomerGenerateAccountActivationUrlInputSchema>;

let shopifyClient: GraphQLClient;

const customerGenerateAccountActivationUrl = {
  name: "customer-generate-account-activation-url",
  description: "Generate an account activation URL for a customer",
  schema: CustomerGenerateAccountActivationUrlInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerGenerateAccountActivationUrlInput) => {
    const query = gql`
      mutation customerGenerateAccountActivationUrl($input: CustomerGenerateAccountActivationUrlInput!) {
        customerGenerateAccountActivationUrl(input: $input) {
          accountActivationUrl
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        customerId: input.customerId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerGenerateAccountActivationUrl;
    } catch (error) {
      console.error("Error generating customer account activation URL:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerGenerateAccountActivationUrl };