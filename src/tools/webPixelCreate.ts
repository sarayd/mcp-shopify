import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebPixelSettingsSchema = z.object({
  accountID: z.string().optional(),
  apiClientId: z.string().optional(),
  apiVersion: z.string().optional(),
  customerDataProvider: z.string().optional(),
  eventPayloadVersion: z.string().optional(),
  gaClientId: z.string().optional(),
  gaSessionNonce: z.string().optional(),
  pixelId: z.string().optional(),
  runtimeContext: z.string().optional(),
  shopId: z.string().optional(),
  source: z.string().optional(),
  standardPixelExtensionId: z.string().optional(),
  type: z.string().optional()
});

const WebPixelCreateInputSchema = z.object({
  settings: WebPixelSettingsSchema
});

type WebPixelCreateInput = z.infer<typeof WebPixelCreateInputSchema>;

let shopifyClient: GraphQLClient;

const webPixelCreate = {
  name: "web-pixel-create",
  description: "Create a web pixel in Shopify",
  schema: WebPixelCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: WebPixelCreateInput) => {
    const query = gql`
      mutation webPixelCreate($input: WebPixelInput!) {
        webPixelCreate(webPixel: $input) {
          userErrors {
            field
            message
          }
          webPixel {
            id
            settings
          }
        }
      }
    `;

    const variables = { input };
    
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.webPixelCreate;
    } catch (error) {
      console.error("Error creating web pixel:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { webPixelCreate };