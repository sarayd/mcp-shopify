import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnApproveRequestInputSchema = z.object({
  id: z.string().min(1, "Return ID is required"),
  notifyCustomer: z.boolean().optional()
});
type ReturnApproveRequestInput = z.infer<typeof ReturnApproveRequestInputSchema>;

let shopifyClient: GraphQLClient;

const returnApproveRequest = {
  name: "return-approve-request",
  description: "Approve a return request in Shopify",
  schema: ReturnApproveRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReturnApproveRequestInput) => {
    const query = gql`
      mutation returnApproveRequest($input: ReturnApproveRequestInput!) {
        returnApproveRequest(input: $input) {
          return {
            id
            status
            returnLineItems(first: 10) {
              edges {
                node {
                  id
                  quantity
                }
              }
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
      input: {
        id: input.id,
        notifyCustomer: input.notifyCustomer
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.returnApproveRequest;
    } catch (error) {
      console.error("Error approving return request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { returnApproveRequest };