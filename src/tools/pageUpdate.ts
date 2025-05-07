import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const PageInputSchema = z.object({
  body: z.string().optional(),
  handle: z.string().optional(),
  id: z.string().min(1, "Page ID is required"),
  isPublished: z.boolean().optional(),
  metafields: z.array(MetafieldInputSchema).optional(),
  publishedAt: z.string().datetime().optional(),
  seo: z.object({
    description: z.string().optional(),
    title: z.string().optional()
  }).optional(),
  templateSuffix: z.string().optional(),
  title: z.string().optional()
});

type PageInput = z.infer<typeof PageInputSchema>;

let shopifyClient: GraphQLClient;

const pageUpdate = {
  name: "page-update",
  description: "Update an existing page",
  schema: PageInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PageInput) => {
    const query = gql`
      mutation pageUpdate($input: PageInput!) {
        pageUpdate(input: $input) {
          page {
            id
            title
            handle
            bodySummary
            publishedAt
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.pageUpdate;
    } catch (error) {
      console.error("Error updating page:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { pageUpdate };