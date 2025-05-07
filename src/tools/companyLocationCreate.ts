import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyLocationInputSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  companyId: z.string().min(1, "Company ID is required"),
  countryCode: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  province: z.string().optional(),
  zip: z.string().optional()
});
type CompanyLocationInput = z.infer<typeof CompanyLocationInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationCreate = {
  name: "company-location-create",
  description: "Create a new company location",
  schema: CompanyLocationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationInput) => {
    const query = gql`
      mutation companyLocationCreate($input: CompanyLocationInput!) {
        companyLocationCreate(input: $input) {
          companyLocation {
            id
            name
            address1
            address2
            city
            province
            zip
            countryCode
            phone
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyLocationCreate;
    } catch (error) {
      console.error("Error creating company location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationCreate };