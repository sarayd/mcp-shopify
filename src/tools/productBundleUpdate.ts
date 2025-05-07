import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ComponentInputSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive()
});

const ProductBundleUpdateInputSchema = z.object({
  id: z.string().min(1, "Bundle ID is required"),
  input: z.object({
    components: z.array(ComponentInputSchema).optional(),
    productId: z.string().optional(),
    title: z.string().optional()
  })
});

type ProductBundleUpdateInput = z.infer<typeof ProductBundleUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const productBundleUpdate = {
  name: "product-bundle-update",
  description: "Update a product bundle",
  schema: ProductBundleUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductBundleUpdateInput) => {
    const query = gql`
      mutation productBundleUpdate($id: ID!, $input: ProductBundleInput!) {
        productBundleUpdate(id: $id, input: $input) {
          productBundle {
            id
            title
            components {
              id
              quantity
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
      return response.productBundleUpdate;
    } catch (error) {
      console.error("Error updating product bundle:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productBundleUpdate };