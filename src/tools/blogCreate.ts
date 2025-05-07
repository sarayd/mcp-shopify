import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BlogInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string()).optional(),
  handle: z.string().optional(),
  seo: z.object({
    description: z.string().optional(),
    title: z.string().optional()
  }).optional(),
  tags: z.array(z.string()).optional(),
  templateSuffix: z.string().optional()
});
type BlogInput = z.infer<typeof BlogInputSchema>;

const BlogCreateInputSchema = z.object({
  input: BlogInputSchema
});
type BlogCreateInput = z.infer<typeof BlogCreateInputSchema>;

let shopifyClient: GraphQLClient;

const blogCreate = {
  name: "blog-create",
  description: "Create a new blog",
  schema: BlogCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: BlogCreateInput) => {
    const query = gql`
      mutation blogCreate($input: BlogInput!) {
        blogCreate(input: $input) {
          blog {
            id
            title
            handle
            templateSuffix
            authors {
              email
            }
            seo {
              description
              title
            }
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    try {
      const response: any = await shopifyClient.request(query, input);
      return response.blogCreate;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { blogCreate };