import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetaobjectFieldInputSchema = z.object({
  key: z.string(),
  value: z.string()
});

const MetaobjectHandleInputSchema = z.object({
  handle: z.string(),
  type: z.string()
});

const MetaobjectUpsertInputSchema = z.object({
  capabilities: z.object({
    publishable: z.object({
      status: z.enum(['ACTIVE', 'DRAFT'])
    }).optional()
  }).optional(),
  fields: z.array(MetaobjectFieldInputSchema),
  handle: MetaobjectHandleInputSchema
});

type MetaobjectUpsertInput = z.infer<typeof MetaobjectUpsertInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectUpsert = {
  name: "metaobject-upsert",
  description: "Upsert a metaobject in Shopify",
  schema: MetaobjectUpsertInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectUpsertInput) => {
    const query = gql`
      mutation metaobjectUpsert($handle: MetaobjectHandleInput!, $fields: [MetaobjectFieldInput!]!, $capabilities: MetaobjectCapabilityInput) {
        metaobjectUpsert(handle: $input.handle, fields: $input.fields, capabilities: $input.capabilities) {
          metaobject {
            handle
            id
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

    const variables = {
      handle: input.handle,
      fields: input.fields,
      capabilities: input.capabilities
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metaobjectUpsert;
    } catch (error) {
      console.error("Error upserting metaobject:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectUpsert };