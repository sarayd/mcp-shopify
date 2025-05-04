import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  description: z.string().optional(),
  id: z.string().optional(),
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const PrivateMetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  owner: z.string(),
  valueInput: z.object({
    value: z.string(),
    valueType: z.string()
  })
});

const CollectionRuleInputSchema = z.object({
  column: z.string(),
  condition: z.string(),
  relation: z.string()
});

const CollectionUpdateInputSchema = z.object({
  id: z.string().min(1, "Collection ID is required"),
  input: z.object({
    descriptionHtml: z.string().optional(),
    handle: z.string().optional(),
    image: z.object({
      altText: z.string().optional(),
      id: z.string().optional(),
      src: z.string().optional()
    }).optional(),
    metafields: z.array(MetafieldInputSchema).optional(),
    privateMetafields: z.array(PrivateMetafieldInputSchema).optional(),
    products: z.object({
      add: z.array(z.string()).optional(),
      remove: z.array(z.string()).optional()
    }).optional(),
    ruleSet: z.object({
      appliedDisjunctively: z.boolean().optional(),
      rules: z.array(CollectionRuleInputSchema)
    }).optional(),
    seo: z.object({
      description: z.string().optional(),
      title: z.string().optional()
    }).optional(),
    sortOrder: z.string().optional(),
    title: z.string().optional()
  })
});

type CollectionUpdateInput = z.infer<typeof CollectionUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const collectionUpdate = {
  name: "collection-update",
  description: "Update a collection",
  schema: CollectionUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CollectionUpdateInput) => {
    const query = gql`
      mutation collectionUpdate($id: ID!, $input: CollectionInput!) {
        collectionUpdate(id: $id, input: $input) {
          collection {
            id
            title
            handle
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.collectionUpdate;
    } catch (error) {
      console.error("Error updating collection:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { collectionUpdate };