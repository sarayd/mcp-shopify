import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldAccessSchema = z.object({
  admin: z.enum(['READ_AND_WRITE', 'READ']).optional(),
  storefront: z.enum(['READ_AND_WRITE', 'READ']).optional(),
  storefrontApi: z.enum(['READ_AND_WRITE', 'READ']).optional()
});

const MetafieldValidationSchema = z.object({
  name: z.enum(['CHOICES', 'COLLECTION_REFERENCE', 'PAGE_REFERENCE', 'PRODUCT_REFERENCE', 'VARIANT_REFERENCE']),
  value: z.string()
});

const StandardMetafieldDefinitionEnableInputSchema = z.object({
  ownerType: z.enum(['ARTICLE', 'BLOG', 'COLLECTION', 'COMPANY', 'CUSTOMER', 'DRAFT_ORDER', 'LOCATION', 'ORDER', 'PAGE', 'PRODUCT', 'PRODUCT_VARIANT', 'SHOP']),
  namespace: z.string(),
  key: z.string(),
  type: z.enum(['BOOLEAN', 'COLOR', 'DATE', 'DATE_TIME', 'DIMENSION', 'JSON', 'MONEY', 'MULTI_LINE_TEXT_FIELD', 'NUMBER_DECIMAL', 'NUMBER_INTEGER', 'RATING', 'SINGLE_LINE_TEXT_FIELD', 'URL', 'VOLUME', 'WEIGHT']),
  name: z.string().optional(),
  description: z.string().optional(),
  pin: z.boolean().optional(),
  pinnedPosition: z.number().int().optional(),
  access: MetafieldAccessSchema.optional(),
  validations: z.array(MetafieldValidationSchema).optional()
});

type StandardMetafieldDefinitionEnableInput = z.infer<typeof StandardMetafieldDefinitionEnableInputSchema>;

let shopifyClient: GraphQLClient;

const standardMetafieldDefinitionEnable = {
  name: "standard-metafield-definition-enable",
  description: "Enable a standard metafield definition",
  schema: StandardMetafieldDefinitionEnableInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StandardMetafieldDefinitionEnableInput) => {
    const query = gql`
      mutation standardMetafieldDefinitionEnable($input: StandardMetafieldDefinitionEnableInput!) {
        standardMetafieldDefinitionEnable(input: $input) {
          standardMetafieldDefinition {
            id
            name
            namespace
            key
            description
            ownerType
            pinnedPosition
            validations {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = { input };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.standardMetafieldDefinitionEnable;
    } catch (error) {
      console.error("Error enabling standard metafield definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { standardMetafieldDefinitionEnable };