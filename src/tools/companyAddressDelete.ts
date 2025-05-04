import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyAddressDeleteInputSchema = z.object({
  id: z.string().min(1, "Company address ID is required")
});
type CompanyAddressDeleteInput = z.infer<typeof CompanyAddressDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const companyAddressDelete = {
  name: "company-address-delete",
  description: "Delete a company address",
  schema: CompanyAddressDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyAddressDeleteInput) => {
    const query = gql`
      mutation companyAddressDelete($id: ID!) {
        companyAddressDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyAddressDelete;
    } catch (error) {
      console.error("Error deleting company address:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyAddressDelete };