import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AndroidApplicationInputSchema = z.object({
  applicationId: z.string().optional(),
  sha256CertFingerprints: z.array(z.string()).optional(),
  appLinksEnabled: z.boolean().optional()
});

const AppleApplicationInputSchema = z.object({
  appId: z.string().optional(),
  universalLinksEnabled: z.boolean().optional(),
  sharedWebCredentialsEnabled: z.boolean().optional(),
  appClipsEnabled: z.boolean().optional(),
  appClipApplicationId: z.string().optional()
});

const MobilePlatformApplicationUpdateInputSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  input: z.object({
    android: AndroidApplicationInputSchema.optional(),
    apple: AppleApplicationInputSchema.optional()
  })
});

type MobilePlatformApplicationUpdateInput = z.infer<typeof MobilePlatformApplicationUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const mobilePlatformApplicationUpdate = {
  name: "mobile-platform-application-update",
  description: "Update a mobile platform application configuration",
  schema: MobilePlatformApplicationUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MobilePlatformApplicationUpdateInput) => {
    const query = gql`
      mutation mobilePlatformApplicationUpdate($id: ID!, $input: MobilePlatformApplicationInput!) {
        mobilePlatformApplicationUpdate(id: $id, input: $input) {
          mobilePlatformApplication {
            ... on AppleApplication {
              id
              appId
              universalLinksEnabled
              sharedWebCredentialsEnabled
              appClipsEnabled
              appClipApplicationId
            }
            ... on AndroidApplication {
              id
              applicationId
              sha256CertFingerprints
              appLinksEnabled
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
      id: input.id,
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.mobilePlatformApplicationUpdate;
    } catch (error) {
      console.error("Error updating mobile platform application:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { mobilePlatformApplicationUpdate };