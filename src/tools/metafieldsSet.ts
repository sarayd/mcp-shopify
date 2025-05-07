import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  description: z.string().optional(),
  key: z.string().min(1),
  namespace: z.string().min(1),
  ownerId: z.string().min(1),
  type: z.string().min(1),
  value: z.string().min(1)
});
type MetafieldInput = z.infer<typeof MetafieldInputSchema>;

const MetafieldsSetInputSchema = z.object({
  metafields: z.array(MetafieldInputSchema).nonempty("At least one metafield is required")
});
type MetafieldsSetInput = z.infer<typeof MetafieldsSetInputSchema>;

let shopifyClient: GraphQLClient;

const metafieldsSet = {
  name: "metafields-set",
  description: "Set multiple metafields on a resource",
  schema: MetafieldsSetInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetafieldsSetInput) => {
    const query = gql`
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            namespace
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { metafields: input.metafields };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metafieldsSet;
    } catch (error) {
      console.error("Error setting metafields:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metafieldsSet };