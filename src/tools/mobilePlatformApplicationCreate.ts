import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AndroidApplicationInputSchema = z.object({
  applicationId: z.string(),
  name: z.string(),
  storeListingAssetUploadId: z.string().optional()
});

const AppleApplicationInputSchema = z.object({
  bundleId: z.string(),
  name: z.string(),
  storeListingAssetUploadId: z.string().optional()
});

const MobilePlatformApplicationCreateInputSchema = z.object({
  input: z.object({
    android: AndroidApplicationInputSchema.optional(),
    apple: AppleApplicationInputSchema.optional()
  })
});

type MobilePlatformApplicationCreateInput = z.infer<typeof MobilePlatformApplicationCreateInputSchema>;

let shopifyClient: GraphQLClient;

const mobilePlatformApplicationCreate = {
  name: "mobile-platform-application-create",
  description: "Create a mobile platform application for Android or iOS",
  schema: MobilePlatformApplicationCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MobilePlatformApplicationCreateInput) => {
    const query = gql`
      mutation mobilePlatformApplicationCreate($input: MobilePlatformApplicationCreateInput!) {
        mobilePlatformApplicationCreate(input: $input) {
          mobilePlatformApplication {
            ... on AppleMobilePlatformApplication {
              id
              bundleId
              name
              appClipsEnabled
              appClipApplicationBundleId
              universalLinksEnabled
              sharedWebCredentialsEnabled
            }
            ... on AndroidMobilePlatformApplication {
              id
              applicationId
              name
              appLinksEnabled
              sha256CertFingerprints
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.mobilePlatformApplicationCreate;
    } catch (error) {
      console.error("Error creating mobile platform application:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { mobilePlatformApplicationCreate };