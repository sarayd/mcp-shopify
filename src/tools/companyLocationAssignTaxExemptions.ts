import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TaxExemptionSchema = z.enum([
  'EXEMPT_ALL',
  'CA_STATUS_CARD_EXEMPTION',
  'CA_DIPLOMAT_EXEMPTION',
  'CA_BC_RESELLER_EXEMPTION',
  'CA_MB_RESELLER_EXEMPTION',
  'CA_SK_RESELLER_EXEMPTION',
  'CA_BC_COMMERCIAL_FISHERY_EXEMPTION',
  'CA_MB_COMMERCIAL_FISHERY_EXEMPTION',
  'CA_NS_COMMERCIAL_FISHERY_EXEMPTION',
  'CA_PE_COMMERCIAL_FISHERY_EXEMPTION',
  'CA_SK_COMMERCIAL_FISHERY_EXEMPTION',
  'CA_BC_PRODUCTION_AND_MACHINERY_EXEMPTION',
  'CA_SK_PRODUCTION_AND_MACHINERY_EXEMPTION',
  'CA_BC_SUB_CONTRACTOR_EXEMPTION',
  'CA_SK_SUB_CONTRACTOR_EXEMPTION',
  'CA_BC_CONTRACTOR_EXEMPTION',
  'CA_SK_CONTRACTOR_EXEMPTION',
  'CA_ON_PURCHASE_EXEMPTION',
  'CA_MB_FARMER_EXEMPTION',
  'CA_NS_FARMER_EXEMPTION',
  'CA_SK_FARMER_EXEMPTION'
]);

const CompanyLocationAssignTaxExemptionsInputSchema = z.object({
  companyLocationId: z.string().min(1, "Company Location ID is required"),
  taxExemptions: z.array(TaxExemptionSchema).nonempty("At least one tax exemption is required")
});

type CompanyLocationAssignTaxExemptionsInput = z.infer<typeof CompanyLocationAssignTaxExemptionsInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationAssignTaxExemptions = {
  name: "company-location-assign-tax-exemptions",
  description: "Assign tax exemptions to a company location",
  schema: CompanyLocationAssignTaxExemptionsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationAssignTaxExemptionsInput) => {
    const query = gql`
      mutation companyLocationAssignTaxExemptions($companyLocationId: ID!, $taxExemptions: [TaxExemption!]!) {
        companyLocationAssignTaxExemptions(
          companyLocationId: $companyLocationId
          taxExemptions: $taxExemptions
        ) {
          companyLocation {
            id
            taxExemptions
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      companyLocationId: input.companyLocationId,
      taxExemptions: input.taxExemptions
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyLocationAssignTaxExemptions;
    } catch (error) {
      console.error("Error assigning tax exemptions:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationAssignTaxExemptions };