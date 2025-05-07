import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const StagedUploadTargetInputSchema = z.object({
  filename: z.string(),
  httpMethod: z.enum(['POST', 'PUT']),
  mimeType: z.string(),
  resource: z.enum(['BULK_MUTATION_VARIABLES', 'COLLECTION_IMAGE', 'FILE', 'IMAGE', 'PRODUCT_IMAGE', 'SHOP_IMAGE']),
  fileSize: z.string().optional(),
  resourceUrl: z.string().optional()
});

const StagedUploadTargetsGenerateInputSchema = z.object({
  input: z.array(StagedUploadTargetInputSchema).nonempty("At least one upload target is required")
});

type StagedUploadTargetsGenerateInput = z.infer<typeof StagedUploadTargetsGenerateInputSchema>;

let shopifyClient: GraphQLClient;

const stagedUploadTargetsGenerate = {
  name: "staged-upload-targets-generate",
  description: "Generate staged upload targets for file uploads",
  schema: StagedUploadTargetsGenerateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StagedUploadTargetsGenerateInput) => {
    const query = gql`
      mutation stagedUploadTargetsGenerate($input: [StagedUploadTargetInput!]!) {
        stagedUploadTargetsGenerate(input: $input) {
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
      return response.stagedUploadTargetsGenerate;
    } catch (error) {
      console.error("Error generating staged upload targets:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { stagedUploadTargetsGenerate };