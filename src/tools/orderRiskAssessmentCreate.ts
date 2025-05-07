import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderRiskAssessmentFactsSchema = z.object({
  message: z.string(),
  sourceId: z.string(),
  sourceType: z.string()
});

const OrderRiskAssessmentCreateInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  riskLevel: z.enum(["HIGH", "LOW", "MEDIUM"]),
  facts: OrderRiskAssessmentFactsSchema
});
type OrderRiskAssessmentCreateInput = z.infer<typeof OrderRiskAssessmentCreateInputSchema>;

let shopifyClient: GraphQLClient;

const orderRiskAssessmentCreate = {
  name: "order-risk-assessment-create",
  description: "Create a risk assessment for an order",
  schema: OrderRiskAssessmentCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderRiskAssessmentCreateInput) => {
    const query = gql`
      mutation orderRiskAssessmentCreate($input: OrderRiskAssessmentCreateInput!) {
        orderRiskAssessmentCreate(input: $input) {
          orderRiskAssessment {
            id
            riskLevel
            facts {
              message
              sourceId
              sourceType
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
        orderId: input.orderId,
        riskLevel: input.riskLevel,
        facts: input.facts
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderRiskAssessmentCreate;
    } catch (error) {
      console.error("Error creating order risk assessment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderRiskAssessmentCreate };