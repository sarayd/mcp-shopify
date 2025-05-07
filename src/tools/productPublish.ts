import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PublicationInputSchema = z.object({
  channelId: z.string().min(1, "Channel ID is required"),
  publishDate: z.string().optional()
});

const ProductPublishInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  input: z.object({
    productId: z.string().min(1, "Product ID is required"),
    publications: z.array(PublicationInputSchema).optional()
  })
});

type ProductPublishInput = z.infer<typeof ProductPublishInputSchema>;

let shopifyClient: GraphQLClient;

const productPublish = {
  name: "product-publish",
  description: "Publish a product to selected channels",
  schema: ProductPublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductPublishInput) => {
    const query = gql`
      mutation productPublish($id: ID!, $input: ProductPublishInput!) {
        productPublish(id: $id, input: $input) {
          product {
            id
            publishedOnCurrentChannel
          }
          shop {
            id
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
      return response.productPublish;
    } catch (error) {
      console.error("Error publishing product:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productPublish };