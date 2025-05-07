import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerUpdateInputSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  input: z.object({
    acceptsMarketing: z.boolean().optional(),
    acceptsMarketingUpdatedAt: z.string().datetime().optional(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    locale: z.string().optional(),
    marketingOptInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN', 'UNKNOWN']).optional(),
    metafields: z.array(z.object({
      key: z.string(),
      namespace: z.string(),
      type: z.string(),
      value: z.string()
    })).optional(),
    note: z.string().optional(),
    phone: z.string().optional(),
    privateMetafields: z.array(z.object({
      key: z.string(),
      namespace: z.string(),
      valueInput: z.object({
        value: z.string(),
        valueType: z.enum(['STRING', 'INTEGER', 'JSON_STRING'])
      })
    })).optional(),
    smsMarketingConsent: z.object({
      marketingOptInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN', 'UNKNOWN']),
      marketingState: z.enum(['SUBSCRIBED', 'NOT_SUBSCRIBED', 'PENDING', 'UNSUBSCRIBED']),
      consentUpdatedAt: z.string().datetime()
    }).optional(),
    tags: z.array(z.string()).optional(),
    taxExempt: z.boolean().optional(),
    taxExemptions: z.array(z.enum([
      'EXEMPT_ALL',
      'EXEMPT_NONE',
      'EXEMPT_FEDERAL',
      'EXEMPT_STATE',
      'EXEMPT_COUNTY',
      'EXEMPT_MUNICIPAL'
    ])).optional()
  })
});

type CustomerUpdateInput = z.infer<typeof CustomerUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const customerUpdate = {
  name: "customer-update",
  description: "Update a customer's information",
  schema: CustomerUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerUpdateInput) => {
    const query = gql`
      mutation customerUpdate($id: ID!, $input: CustomerInput!) {
        customerUpdate(id: $id, input: $input) {
          customer {
            id
            email
            firstName
            lastName
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
      return response.customerUpdate;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerUpdate };