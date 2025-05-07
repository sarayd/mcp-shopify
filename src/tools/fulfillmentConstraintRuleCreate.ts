import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const RequiredStateConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'IN', 'NOT_IN']),
  value: z.string()
});

const RequiredStateSchema = z.object({
  condition: RequiredStateConditionSchema,
  failureMessage: z.string().optional()
});

const MetafieldSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const FulfillmentConstraintRuleInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(['SHIPPING', 'INVENTORY']),
  enabled: z.boolean().optional(),
  failureAction: z.enum(['CANCEL_FULFILLMENT', 'MARK_AS_WARNING']).optional(),
  metafields: z.array(MetafieldSchema).optional(),
  requiredStates: z.array(RequiredStateSchema).optional()
});

type FulfillmentConstraintRuleInput = z.infer<typeof FulfillmentConstraintRuleInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentConstraintRuleCreate = {
  name: "fulfillment-constraint-rule-create",
  description: "Create a fulfillment constraint rule",
  schema: FulfillmentConstraintRuleInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentConstraintRuleInput) => {
    const query = gql`
      mutation fulfillmentConstraintRuleCreate($input: FulfillmentConstraintRuleInput!) {
        fulfillmentConstraintRuleCreate(input: $input) {
          fulfillmentConstraintRule {
            id
            name
            category
            enabled
            failureAction
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
      return response.fulfillmentConstraintRuleCreate;
    } catch (error) {
      console.error("Error creating fulfillment constraint rule:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentConstraintRuleCreate };