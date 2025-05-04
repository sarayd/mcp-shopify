import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DisputeEvidenceSchema = z.object({
  accessActivityLog: z.string().optional(),
  cancellationPolicyDisclosure: z.string().optional(),
  cancellationPolicyFile: z.object({ id: z.string() }).optional(),
  cancellationRebuttal: z.string().optional(),
  customerCommunicationFile: z.object({ id: z.string() }).optional(),
  customerEmailAddress: z.string().optional(),
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  refundPolicyDisclosure: z.string().optional(),
  refundPolicyFile: z.object({ id: z.string() }).optional(),
  refundRefusalExplanation: z.string().optional(),
  shippingAddress: z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
    province: z.string().optional(),
    provinceCode: z.string().optional(),
    zip: z.string().optional()
  }).optional(),
  shippingCarrier: z.string().optional(),
  shippingDate: z.string().optional(),
  shippingDocumentationFile: z.object({ id: z.string() }).optional(),
  shippingTrackingNumber: z.string().optional(),
  shippingTrackingUrl: z.string().optional(),
  uncategorizedFile: z.object({ id: z.string() }).optional(),
  uncategorizedText: z.string().optional()
});

const DisputeEvidenceUpdateInputSchema = z.object({
  id: z.string().min(1, "Dispute ID is required"),
  evidence: DisputeEvidenceSchema
});

type DisputeEvidenceUpdateInput = z.infer<typeof DisputeEvidenceUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const disputeEvidenceUpdate = {
  name: "dispute-evidence-update",
  description: "Update evidence for a Shopify Payments dispute",
  schema: DisputeEvidenceUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DisputeEvidenceUpdateInput) => {
    const query = gql`
      mutation disputeEvidenceUpdate($id: ID!, $evidence: DisputeEvidenceInput!) {
        disputeEvidenceUpdate(id: $id, evidence: $evidence) {
          disputeEvidence {
            id
            accessActivityLog
            cancellationPolicyDisclosure
            cancellationRebuttal
            customerEmailAddress
            customerFirstName
            customerLastName
            refundPolicyDisclosure
            refundRefusalExplanation
            shippingAddress {
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
            shippingCarrier
            shippingDate
            shippingTrackingNumber
            shippingTrackingUrl
            uncategorizedText
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      id: input.id,
      evidence: input.evidence
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.disputeEvidenceUpdate;
    } catch (error) {
      console.error("Error updating dispute evidence:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { disputeEvidenceUpdate };