import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FlowTriggerReceiveInputSchema = z.object({
  handle: z.string().min(1, "Handle is required"),
  namespace: z.string().min(1, "Namespace is required"),
  payload: z.string().min(1, "Payload is required")
});
type FlowTriggerReceiveInput = z.infer<typeof FlowTriggerReceiveInputSchema>;

let shopifyClient: GraphQLClient;

const flowTriggerReceive = {
  name: "flow-trigger-receive",
  description: "Trigger a flow using flowTriggerReceive mutation",
  schema: FlowTriggerReceiveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FlowTriggerReceiveInput) => {
    const query = gql`
      mutation flowTriggerReceive($input: FlowTriggerReceiveInput!) {
        flowTriggerReceive(input: $input) {
          flowTrigger {
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
      input: {
        handle: input.handle,
        namespace: input.namespace,
        payload: input.payload
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.flowTriggerReceive;
    } catch (error) {
      console.error("Error executing flowTriggerReceive:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { flowTriggerReceive };