import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerMergeInputSchema = z.object({
  customerOneId: z.string().min(1, "First customer ID is required"),
  customerTwoId: z.string().min(1, "Second customer ID is required"),
  overrideFields: z.object({
    addresses: z.boolean().optional(),
    emailMarketing: z.boolean().optional(),
    email: z.boolean().optional(),
    firstName: z.boolean().optional(),
    lastName: z.boolean().optional(),
    phone: z.boolean().optional(),
    taxExemptions: z.boolean().optional()
  }).optional()
});
type CustomerMergeInput = z.infer<typeof CustomerMergeInputSchema>;

let shopifyClient: GraphQLClient;

const customerMerge = {
  name: "customer-merge",
  description: "Merge two customers into a single customer",
  schema: CustomerMergeInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerMergeInput) => {
    const query = gql`
      mutation customerMerge($customerOneId: ID!, $customerTwoId: ID!, $overrideFields: CustomerMergeOverrideFields) {
        customerMerge(customerOneId: $customerOneId, customerTwoId: $customerTwoId, overrideFields: $overrideFields) {
          resultingCustomer {
            id
            email
            firstName
            lastName
          }
          job {
            id
            done
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      customerOneId: input.customerOneId,
      customerTwoId: input.customerTwoId,
      overrideFields: input.overrideFields
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerMerge;
    } catch (error) {
      console.error("Error merging customers:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerMerge };