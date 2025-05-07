import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const StagedUploadInputSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  resource: z.enum([
    'BULK_MUTATION_VARIABLES',
    'COLLECTION_IMAGE',
    'FILE',
    'IMAGE',
    'PRODUCT_IMAGE',
    'SHOP_IMAGE'
  ])
});
type StagedUploadInput = z.infer<typeof StagedUploadInputSchema>;

const StagedUploadsCreateInputSchema = z.object({
  input: z.array(StagedUploadInputSchema).nonempty("At least one upload input is required")
});
type StagedUploadsCreateInput = z.infer<typeof StagedUploadsCreateInputSchema>;

let shopifyClient: GraphQLClient;

const stagedUploadsCreate = {
  name: "staged-uploads-create",
  description: "Generate temporary URLs and parameters for uploading files to Shopify",
  schema: StagedUploadsCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StagedUploadsCreateInput) => {
    const query = gql`
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            parameters {
              name
              value
            }
            resourceUrl
            url
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input: input.input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.stagedUploadsCreate;
    } catch (error) {
      console.error("Error creating staged uploads:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { stagedUploadsCreate };