import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AddressInputSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  zip: z.string().optional()
});

const CompanyLocationAssignAddressInputSchema = z.object({
  companyLocationId: z.string().min(1, "Company location ID is required"),
  address: AddressInputSchema
});

type CompanyLocationAssignAddressInput = z.infer<typeof CompanyLocationAssignAddressInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationAssignAddress = {
  name: "company-location-assign-address",
  description: "Assign an address to a company location",
  schema: CompanyLocationAssignAddressInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationAssignAddressInput) => {
    const query = gql`
      mutation companyLocationAssignAddress($input: CompanyLocationAssignAddressInput!) {
        companyLocationAssignAddress(input: $input) {
          companyLocation {
            id
            address {
              address1
              address2
              city
              country
              countryCode
              phone
              province
              provinceCode
              zip
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
        companyLocationId: input.companyLocationId,
        address: input.address
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyLocationAssignAddress;
    } catch (error) {
      console.error("Error assigning address to company location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationAssignAddress };