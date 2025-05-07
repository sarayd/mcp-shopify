import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FieldDefinitionCreateSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.string(),
  validations: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).optional(),
  required: z.boolean().optional()
});

const FieldDefinitionUpdateSchema = z.object({
  key: z.string(),
  name: z.string().optional(),
  validations: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).optional(),
  required: z.boolean().optional()
});

const MetaobjectDefinitionUpdateInputSchema = z.object({
  id: z.string().min(1, "Metaobject definition ID is required"),
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
    fieldDefinitions: z.object({
      create: z.array(FieldDefinitionCreateSchema).optional(),
      update: z.array(FieldDefinitionUpdateSchema).optional(),
      delete: z.array(z.string()).optional()
    }).optional(),
    name: z.string().optional(),
    resetFieldOrder: z.boolean().optional()
  })
});

type MetaobjectDefinitionUpdateInput = z.infer<typeof MetaobjectDefinitionUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectDefinitionUpdate = {
  name: "metaobject-definition-update",
  description: "Update a metaobject definition",
  schema: MetaobjectDefinitionUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectDefinitionUpdateInput) => {
    const query = gql`
      mutation metaobjectDefinitionUpdate($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
        metaobjectDefinitionUpdate(id: $id, definition: $definition) {
          metaobjectDefinition {
            id
            name
            type
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
      definition: input.definition
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metaobjectDefinitionUpdate;
    } catch (error) {
      console.error("Error updating metaobject definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectDefinitionUpdate };