import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TagsRemoveInputSchema = z.object({
  id: z.string().min(1, "Resource ID is required"),
  tags: z.array(z.string()).nonempty("At least one tag is required")
});
type TagsRemoveInput = z.infer<typeof TagsRemoveInputSchema>;

let shopifyClient: GraphQLClient;

const tagsRemove = {
  name: "tags-remove",
  description: "Remove tags from a resource",
  schema: TagsRemoveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: TagsRemoveInput) => {
    const query = gql`
      mutation tagsRemove($id: ID!, $tags: [String!]!) {
        tagsRemove(id: $id, tags: $tags) {
          node {
            id
          }
          tagsUserErrors {
            code
            field
            message
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
      tags: input.tags
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.tagsRemove;
    } catch (error) {
      console.error("Error removing tags:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { tagsRemove };