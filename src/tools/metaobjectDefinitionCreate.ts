import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FieldDefinitionSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.object({
    name: z.string(),
    validations: z.array(z.object({
      name: z.string(),
      value: z.string()
    })).optional()
  }),
  description: z.string().optional(),
  required: z.boolean().optional(),
  validations: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).optional()
});

const MetaobjectDefinitionInputSchema = z.object({
  definition: z.object({
    access: z.object({
      storefront: z.boolean().optional(),
      admin: z.boolean().optional()
    }).optional(),
    capabilities: z.object({
      publishable: z.object({
        enabled: z.boolean()
      }).optional()
    }).optional(),
    description: z.string().optional(),
    displayNameKey: z.string().optional(),
    fieldDefinitions: z.array(FieldDefinitionSchema),
    name: z.string(),
    type: z.string().regex(/^[a-zA-Z0-9_-]{3,255}$/)
  })
});

type MetaobjectDefinitionInput = z.infer<typeof MetaobjectDefinitionInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectDefinitionCreate = {
  name: "metaobject-definition-create",
  description: "Create a new metaobject definition",
  schema: MetaobjectDefinitionInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectDefinitionInput) => {
    const query = gql`
      mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition {
            id
            name
            type
            access {
              admin
              storefront
            }
            capabilities {
              publishable {
                enabled
              }
            }
            fieldDefinitions {
              name
              key
              type {
                name
              }
              required
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.metaobjectDefinitionCreate;
    } catch (error) {
      console.error("Error creating metaobject definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectDefinitionCreate };