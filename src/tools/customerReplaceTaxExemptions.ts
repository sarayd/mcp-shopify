import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TaxExemptionEnum = z.enum([
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

const CustomerReplaceTaxExemptionsInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  taxExemptions: z.array(TaxExemptionEnum).min(0)
});

type CustomerReplaceTaxExemptionsInput = z.infer<typeof CustomerReplaceTaxExemptionsInputSchema>;

let shopifyClient: GraphQLClient;

const customerReplaceTaxExemptions = {
  name: "customer-replace-tax-exemptions",
  description: "Replace tax exemptions for a customer",
  schema: CustomerReplaceTaxExemptionsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerReplaceTaxExemptionsInput) => {
    const query = gql`
      mutation customerReplaceTaxExemptions($customerId: ID!, $taxExemptions: [TaxExemption!]!) {
        customerReplaceTaxExemptions(customerId: $customerId, taxExemptions: $taxExemptions) {
          customer {
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
      customerId: input.customerId,
      taxExemptions: input.taxExemptions
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerReplaceTaxExemptions;
    } catch (error) {
      console.error("Error replacing customer tax exemptions:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerReplaceTaxExemptions };