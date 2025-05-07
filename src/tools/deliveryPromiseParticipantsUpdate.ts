import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryMethodDefinitionSchema = z.object({
  methodType: z.enum(["LOCAL", "NONE", "PICKUP", "RETAIL", "SHIPPING"]),
  maxPromiseDate: z.string().optional(),
  minPromiseDate: z.string().optional(),
  promiseApplicableTo: z.enum(["DELIVERY", "READY_FOR_PICKUP"]).optional()
});

const DeliveryPromiseServiceLevelSchema = z.object({
  name: z.string(),
  deliveryMethodDefinition: DeliveryMethodDefinitionSchema
});

const DeliveryPromiseParticipantsUpdateInputSchema = z.object({
  deliveryPromiseParticipantIds: z.array(z.string()).nonempty("At least one participant ID is required"),
  deliveryPromiseServiceLevel: DeliveryPromiseServiceLevelSchema
});

type DeliveryPromiseParticipantsUpdateInput = z.infer<typeof DeliveryPromiseParticipantsUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const deliveryPromiseParticipantsUpdate = {
  name: "delivery-promise-participants-update",
  description: "Update delivery promise participants with new service level settings",
  schema: DeliveryPromiseParticipantsUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryPromiseParticipantsUpdateInput) => {
    const query = gql`
      mutation deliveryPromiseParticipantsUpdate($input: DeliveryPromiseParticipantsUpdateInput!) {
        deliveryPromiseParticipantsUpdate(input: $input) {
          deliveryPromiseParticipants {
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
        deliveryPromiseParticipantIds: input.deliveryPromiseParticipantIds,
        deliveryPromiseServiceLevel: input.deliveryPromiseServiceLevel
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.deliveryPromiseParticipantsUpdate;
    } catch (error) {
      console.error("Error updating delivery promise participants:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryPromiseParticipantsUpdate };