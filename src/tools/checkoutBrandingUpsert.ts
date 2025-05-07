import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomizationSchema = z.object({
  checkbox: z.object({
    cornerRadius: z.string().optional(),
    background: z.string().optional()
  }).optional(),
  control: z.object({
    border: z.string().optional(),
    color: z.string().optional(),
    cornerRadius: z.string().optional(),
    labelPosition: z.enum(['INSIDE', 'OUTSIDE']).optional()
  }).optional(),
  select: z.object({
    border: z.string().optional(),
    background: z.string().optional(),
    cornerRadius: z.string().optional()
  }).optional(),
  textField: z.object({
    border: z.string().optional(),
    background: z.string().optional(),
    cornerRadius: z.string().optional()
  }).optional(),
  selectIcon: z.object({
    foreground: z.string().optional()
  }).optional(),
  typography: z.object({
    size: z.string().optional(),
    primary: z.object({
      name: z.string().optional(),
      base64Data: z.string().optional(),
      weight: z.string().optional()
    }).optional(),
    secondary: z.object({
      name: z.string().optional(),
      base64Data: z.string().optional(),
      weight: z.string().optional()
    }).optional()
  }).optional(),
  header: z.object({
    alignment: z.enum(['LEFT', 'CENTER']).optional(),
    position: z.enum(['START', 'END']).optional()
  }).optional(),
  headingLevel1: z.object({
    typography: z.object({
      size: z.string().optional(),
      base64Data: z.string().optional(),
      weight: z.string().optional()
    }).optional()
  }).optional(),
  headingLevel2: z.object({
    typography: z.object({
      size: z.string().optional(),
      base64Data: z.string().optional(),
      weight: z.string().optional()
    }).optional()
  }).optional(),
  headingLevel3: z.object({
    typography: z.object({
      size: z.string().optional(),
      base64Data: z.string().optional(),
      weight: z.string().optional()
    }).optional()
  }).optional(),
  global: z.object({
    cornerRadius: z.string().optional(),
    typography: z.object({
      letterCase: z.enum(['NONE', 'UPPER', 'LOWER', 'TITLE']).optional(),
      kerning: z.string().optional(),
      tracking: z.string().optional()
    }).optional()
  }).optional(),
  primaryButton: z.object({
    background: z.string().optional(),
    border: z.string().optional(),
    cornerRadius: z.string().optional(),
    blockPadding: z.string().optional(),
    inlinePadding: z.string().optional()
  }).optional(),
  secondaryButton: z.object({
    background: z.string().optional(),
    border: z.string().optional(),
    cornerRadius: z.string().optional(),
    blockPadding: z.string().optional(),
    inlinePadding: z.string().optional()
  }).optional(),
  color: z.object({
    primary: z.string().optional(),
    background: z.string().optional(),
    error: z.string().optional()
  }).optional()
});

const CheckoutBrandingInputSchema = z.object({
  customizations: CustomizationSchema.optional()
});

const schema = z.object({
  input: CheckoutBrandingInputSchema
});

let shopifyClient: GraphQLClient;

const checkoutBrandingUpsert = {
  name: "checkout-branding-upsert",
  description: "Updates the checkout branding configuration",
  schema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: z.infer<typeof schema>) => {
    const query = gql`
      mutation checkoutBrandingUpsert($input: CheckoutBrandingInput!) {
        checkoutBrandingUpsert(input: $input) {
          checkoutBranding {
            id
            customizations {
              checkbox {
                cornerRadius
                background
              }
              control {
                border
                color
                cornerRadius
                labelPosition
              }
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
      const response: any = await shopifyClient.request(query, { input: input.input });
      return response.checkoutBrandingUpsert;
    } catch (error) {
      console.error("Error executing checkoutBrandingUpsert:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { checkoutBrandingUpsert };