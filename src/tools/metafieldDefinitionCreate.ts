import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldDefinitionInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  namespace: z.string().min(1, "Namespace is required"),
  key: z.string().min(1, "Key is required"),
  description: z.string().optional(),
  type: z.enum([
    "boolean",
    "color",
    "date",
    "date_time",
    "dimension",
    "json",
    "money",
    "multi_line_text_field",
    "number_decimal",
    "number_integer",
    "rating",
    "single_line_text_field",
    "url",
    "volume",
    "weight"
  ]),
  ownerType: z.enum([
    "ARTICLE",
    "BLOG",
    "COLLECTION",
    "CUSTOMER",
    "DRAFT_ORDER",
    "ORDER",
    "PAGE",
    "PRODUCT",
    "PRODUCT_VARIANT",
    "SHOP"
  ]),
  validations: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).optional(),
  visibleToStorefrontApi: z.boolean().optional(),
  pinned: z.boolean().optional()
});

type MetafieldDefinitionInput = z.infer<typeof MetafieldDefinitionInputSchema>;

let shopifyClient: GraphQLClient;

const metafieldDefinitionCreate = {
  name: "metafield-definition-create",
  description: "Create a metafield definition",
  schema: MetafieldDefinitionInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetafieldDefinitionInput) => {
    const query = gql`
      mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          metafieldDefinition {
            id
            name
            namespace
            key
            description
            type
            ownerType
            validations {
              name
              value
            }
            visibleToStorefrontApi
            pinned
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;
    const variables = { definition: input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metafieldDefinitionCreate;
    } catch (error) {
      console.error("Error creating metafield definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metafieldDefinitionCreate };