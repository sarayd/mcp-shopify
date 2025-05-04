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

const ArticleInputSchema = z.object({
  author: z.object({
    email: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
  }).optional(),
  content: z.string().optional(),
  contentHtml: z.string().optional(),
  excerpt: z.string().optional(),
  handle: z.string().optional(),
  id: z.string(),
  metafields: z.array(MetafieldInputSchema).optional(),
  publishedAt: z.string().optional(),
  seo: z.object({
    description: z.string().optional(),
    title: z.string().optional()
  }).optional(),
  tags: z.array(z.string()).optional(),
  title: z.string().optional()
});

const ArticleUpdateInputSchema = z.object({
  id: z.string().min(1, "Article ID is required"),
  input: ArticleInputSchema
});

type ArticleUpdateInput = z.infer<typeof ArticleUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const articleUpdate = {
  name: "article-update",
  description: "Update an article in Shopify",
  schema: ArticleUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ArticleUpdateInput) => {
    const query = gql`
      mutation articleUpdate($id: ID!, $input: ArticleInput!) {
        articleUpdate(id: $id, input: $input) {
          article {
            id
            title
            handle
            content
            contentHtml
            excerpt
            publishedAt
            tags
            seo {
              description
              title
            }
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
      return response.articleUpdate;
    } catch (error) {
      console.error("Error updating article:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { articleUpdate };