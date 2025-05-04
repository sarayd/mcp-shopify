import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ActivityDeliveryStatusSchema = z.object({
  activityId: z.string().min(1, "Activity ID is required"),
  deliveryStatus: z.enum(["SENT", "FAILED", "PENDING"])
});

const AbandonmentUpdateActivitiesDeliveryStatusesInputSchema = z.object({
  id: z.string().min(1, "Abandonment ID is required"),
  activities: z.array(ActivityDeliveryStatusSchema).nonempty("At least one activity is required")
});

type AbandonmentUpdateActivitiesDeliveryStatusesInput = z.infer<typeof AbandonmentUpdateActivitiesDeliveryStatusesInputSchema>;

let shopifyClient: GraphQLClient;

const abandonmentUpdateActivitiesDeliveryStatuses = {
  name: "abandonment-update-activities-delivery-statuses",
  description: "Update delivery statuses for abandonment activities",
  schema: AbandonmentUpdateActivitiesDeliveryStatusesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: AbandonmentUpdateActivitiesDeliveryStatusesInput) => {
    const query = gql`
      mutation abandonmentUpdateActivitiesDeliveryStatuses($id: ID!, $activities: [ActivityDeliveryStatusInput!]!) {
        abandonmentUpdateActivitiesDeliveryStatuses(id: $id, activities: $activities) {
          abandonment {
            id
            activities {
              id
              deliveryStatus
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
      activities: input.activities
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.abandonmentUpdateActivitiesDeliveryStatuses;
    } catch (error) {
      console.error("Error updating abandonment activities delivery statuses:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { abandonmentUpdateActivitiesDeliveryStatuses };