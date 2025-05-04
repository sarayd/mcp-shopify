import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyLocationDeleteInputSchema = z.object({
  id: z.string().min(1, "Location ID is required")
});
type CompanyLocationDeleteInput = z.infer<typeof CompanyLocationDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationsDelete = {
  name: "company-locations-delete",
  description: "Delete a company location",
  schema: CompanyLocationDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationDeleteInput) => {
    const query = gql`
      mutation companyLocationDelete($id: ID!) {
        companyLocationDelete(id: $id) {
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
      return response.companyLocationDelete;
    } catch (error) {
      console.error("Error deleting company location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationsDelete };