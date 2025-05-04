import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FieldInputSchema = z.object({
  key: z.string(),
  value: z.string().or(z.array(z.string())).optional()
});

const MetaobjectUpdateInputSchema = z.object({
  id: z.string().min(1, "Metaobject ID is required"),
  metaobject: z.object({
    capabilities: z.object({
      publishable: z.object({
        status: z.enum(['ACTIVE', 'DRAFT']).optional()
      }).optional()
    }).optional(),
    fields: z.array(FieldInputSchema).optional(),
    handle: z.string().optional(),
    type: z.string().optional()
  })
});

type MetaobjectUpdateInput = z.infer<typeof MetaobjectUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const metaobjectUpdate = {
  name: "metaobject-update",
  description: "Update a metaobject",
  schema: MetaobjectUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetaobjectUpdateInput) => {
    const query = gql`
      mutation metaobjectUpdate($id: ID!, $metaobject: MetaobjectInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
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
      id: input.id,
      metaobject: input.metaobject
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metaobjectUpdate;
    } catch (error) {
      console.error("Error updating metaobject:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metaobjectUpdate };