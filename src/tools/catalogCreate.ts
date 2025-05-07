import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CatalogContextSchema = z.object({
  country: z.string().optional(),
  language: z.string().optional(),
  market: z.string().optional()
});

const CatalogCreateInputSchema = z.object({
  input: z.object({
    context: CatalogContextSchema,
    priceListId: z.string().optional(),
    publicationId: z.string().optional(),
    status: z.enum(['ACTIVE', 'DRAFT']),
    title: z.string().min(1, "Title is required")
  })
});

type CatalogCreateInput = z.infer<typeof CatalogCreateInputSchema>;

let shopifyClient: GraphQLClient;

const catalogCreate = {
  name: "catalog-create",
  description: "Create a new catalog in Shopify",
  schema: CatalogCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CatalogCreateInput) => {
    const query = gql`
      mutation catalogCreate($input: CatalogCreateInput!) {
        catalogCreate(input: $input) {
          catalog {
            id
            title
            status
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
      return response.catalogCreate;
    } catch (error) {
      console.error("Error creating catalog:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { catalogCreate };