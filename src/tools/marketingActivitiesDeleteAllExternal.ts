import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

let shopifyClient: GraphQLClient;

const marketingActivitiesDeleteAllExternal = {
  name: "marketing-activities-delete-all-external",
  description: "Delete all external marketing activities",
  schema: z.object({}),

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async () => {
    const query = gql`
      mutation marketingActivitiesDeleteAllExternal {
        marketingActivitiesDeleteAllExternal {
          jobId
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query);
      return response.marketingActivitiesDeleteAllExternal;
    } catch (error) {
      console.error("Error deleting external marketing activities:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketingActivitiesDeleteAllExternal };