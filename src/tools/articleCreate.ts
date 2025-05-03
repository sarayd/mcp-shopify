import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for creating a blog article
const ArticleCreateInputSchema = z.object({
  blogId: z.string().min(1, "Blog ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().optional()
});

type ArticleCreateInput = z.infer<typeof ArticleCreateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const articleCreate = {
  name: "article-create",
  description: "Create a blog article in Shopify",
  schema: ArticleCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ArticleCreateInput) => {
    try {
      const { blogId, title, content, author, published } = input;

      // Convert blog ID to GID format if not already
      const formattedBlogId = blogId.startsWith("gid://")
        ? blogId
        : `gid://shopify/Blog/${blogId}`;

      const query = gql`
        mutation articleCreate($input: ArticleInput!) {
          articleCreate(input: $input) {
            article {
              id
              title
              content
              author
              published
              blog {
                id
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
        input: {
          blogId: formattedBlogId,
          title,
          content,
          author,
          published
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        articleCreate: {
          article: {
            id: string;
            title: string;
            content: string | null;
            author: string | null;
            published: boolean;
            blog: { id: string; title: string } | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.articleCreate.userErrors.length > 0) {
        throw new Error(
          `Failed to create article: ${data.articleCreate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { article } = data.articleCreate;
      return {
        article: article
          ? {
              id: article.id,
              title: article.title,
              content: article.content,
              author: article.author,
              published: article.published,
              blog: article.blog ? { id: article.blog.id, title: article.blog.title } : null
            }
          : null
      };
    } catch (error) {
      console.error("Error creating article:", error);
      throw new Error(
        `Failed to create article: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { articleCreate };