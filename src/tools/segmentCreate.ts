import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SegmentCreateInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  query: z.string().min(1, "Query is required"),
  returnQuery: z.string().optional()
});
type SegmentCreateInput = z.infer<typeof SegmentCreateInputSchema>;

let shopifyClient: GraphQLClient;

const segmentCreate = {
  name: "segment-create",
  description: "Create a new customer segment",
  schema: SegmentCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SegmentCreateInput) => {
    const query = gql`
      mutation segmentCreate($input: SegmentCreateInput!) {
        segmentCreate(input: $input) {
          segment {
            id
            name
            query
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
      return response.segmentCreate;
    } catch (error) {
      console.error("Error creating segment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { segmentCreate };