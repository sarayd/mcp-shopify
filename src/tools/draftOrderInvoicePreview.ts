import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DraftOrderInvoicePreviewInputSchema = z.object({
  id: z.string().min(1, "Draft order ID is required"),
  email: z.string().email().optional()
});
type DraftOrderInvoicePreviewInput = z.infer<typeof DraftOrderInvoicePreviewInputSchema>;

let shopifyClient: GraphQLClient;

const draftOrderInvoicePreview = {
  name: "draft-order-invoice-preview",
  description: "Preview a draft order invoice",
  schema: DraftOrderInvoicePreviewInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DraftOrderInvoicePreviewInput) => {
    const query = gql`
      mutation draftOrderInvoicePreview($id: ID!, $email: String) {
        draftOrderInvoicePreview(id: $id, email: $email) {
          previewHtml
          previewSubject
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      email: input.email
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.draftOrderInvoicePreview;
    } catch (error) {
      console.error("Error previewing draft order invoice:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { draftOrderInvoicePreview };