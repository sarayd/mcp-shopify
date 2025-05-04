import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SegmentUpdateInputSchema = z.object({
  id: z.string().min(1, "Segment ID is required"),
  input: z.object({
    name: z.string().optional(),
    query: z.string().optional(),
    description: z.string().optional(),
    feedback: z.string().optional()
  })
});
type SegmentUpdateInput = z.infer<typeof SegmentUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const segmentUpdate = {
  name: "segment-update",
  description: "Update a customer segment in Shopify",
  schema: SegmentUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SegmentUpdateInput) => {
    const query = gql`
      mutation segmentUpdate($id: ID!, $input: SegmentInput!) {
        segmentUpdate(id: $id, input: $input) {
          segment {
            id
            name
            query
            description
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
      return response.segmentUpdate;
    } catch (error) {
      console.error("Error updating segment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { segmentUpdate };