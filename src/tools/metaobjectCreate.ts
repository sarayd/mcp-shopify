import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FieldInputSchema = z.object({
  key: z.string(),
  value: z.string().or(z.array(z.string()))
});

const MetaobjectInputSchema = z.object({
  capabilities: z.object({
    publishable: z.object({
      status: z.enum(['ACTIVE', 'DRAFT'])
    }).optional()
  }).optional(),
  fields: z.array(FieldInputSchema),
  handle: z.string().optional(),
  type: z.string()
});

const MetaobjectCreateInputSchema = z.object({
  metaobject: MetaobjectInputSchema
});

type MetaobjectCreateInput = z.infer<typeof MetaobjectCreateInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectCreate = {
  name: "metaobject-create",
  description: "Create a metaobject in Shopify",
  schema: MetaobjectCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectCreateInput) => {
    const query = gql`
      mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            id
            handle
            type
            fields {
              key
              value
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
      return response.metaobjectCreate;
    } catch (error) {
      console.error("Error creating metaobject:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectCreate };