import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ComponentInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer")
});

const ProductBundleCreateInputSchema = z.object({
  input: z.object({
    components: z.array(ComponentInputSchema).nonempty("At least one component is required"),
    title: z.string().min(1, "Title is required")
  })
});

type ProductBundleCreateInput = z.infer<typeof ProductBundleCreateInputSchema>;

let shopifyClient: GraphQLClient;

const productBundleCreate = {
  name: "product-bundle-create",
  description: "Create a new product bundle",
  schema: ProductBundleCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductBundleCreateInput) => {
    const query = gql`
      mutation productBundleCreate($input: ProductBundleCreateInput!) {
        productBundleCreate(input: $input) {
          productBundle {
            id
            title
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
      return response.productBundleCreate;
    } catch (error) {
      console.error("Error creating product bundle:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productBundleCreate };