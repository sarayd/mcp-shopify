import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PubSubWebhookSubscriptionCreateInputSchema = z.object({
  callbackUrl: z.string().url(),
  format: z.enum(['JSON']).optional(),
  includeFields: z.array(z.string()).optional(),
  legacyUrlPattern: z.boolean().optional(),
  metafieldNamespaces: z.array(z.string()).optional(),
  privateMetafieldNamespaces: z.array(z.string()).optional(),
  topic: z.enum([
    'APP_PURCHASES_ONE_TIME_UPDATE',
    'APP_SUBSCRIPTIONS_UPDATE',
    'BULK_OPERATIONS_FINISH',
    'CHANNELS_DELETE',
    'COLLECTIONS_CREATE',
    'COLLECTIONS_DELETE',
    'COLLECTIONS_UPDATE',
    'CUSTOMERS_CREATE',
    'CUSTOMERS_DELETE',
    'CUSTOMERS_DISABLE',
    'CUSTOMERS_ENABLE',
    'CUSTOMERS_UPDATE',
    'CUSTOMER_GROUPS_CREATE',
    'CUSTOMER_GROUPS_DELETE',
    'CUSTOMER_GROUPS_UPDATE',
    'CUSTOMER_PAYMENT_METHODS_CREATE',
    'CUSTOMER_PAYMENT_METHODS_REVOKE',
    'CUSTOMER_PAYMENT_METHODS_UPDATE',
    'DISPUTES_CREATE',
    'DISPUTES_UPDATE',
    'DOMAINS_CREATE',
    'DOMAINS_DESTROY',
    'DOMAINS_UPDATE',
    'DRAFT_ORDERS_CREATE',
    'DRAFT_ORDERS_DELETE',
    'DRAFT_ORDERS_UPDATE',
    'FULFILLMENT_EVENTS_CREATE',
    'FULFILLMENT_EVENTS_DELETE',
    'FULFILLMENTS_CREATE',
    'FULFILLMENTS_UPDATE',
    'INVENTORY_ITEMS_CREATE',
    'INVENTORY_ITEMS_DELETE',
    'INVENTORY_ITEMS_UPDATE',
    'INVENTORY_LEVELS_CONNECT',
    'INVENTORY_LEVELS_DISCONNECT',
    'INVENTORY_LEVELS_UPDATE',
    'LOCALES_CREATE',
    'LOCALES_UPDATE',
    'LOCATIONS_ACTIVATE',
    'LOCATIONS_CREATE',
    'LOCATIONS_DEACTIVATE',
    'LOCATIONS_DELETE',
    'LOCATIONS_UPDATE',
    'MARKETS_CREATE',
    'MARKETS_DELETE',
    'MARKETS_UPDATE',
    'ORDERS_CANCELLED',
    'ORDERS_CREATE',
    'ORDERS_DELETE',
    'ORDERS_EDITED',
    'ORDERS_FULFILLED',
    'ORDERS_PAID',
    'ORDERS_PARTIALLY_FULFILLED',
    'ORDERS_UPDATED',
    'ORDER_TRANSACTIONS_CREATE',
    'PRODUCTS_CREATE',
    'PRODUCTS_DELETE',
    'PRODUCTS_UPDATE',
    'PRODUCT_LISTINGS_ADD',
    'PRODUCT_LISTINGS_REMOVE',
    'PRODUCT_LISTINGS_UPDATE',
    'PRODUCT_PUBLICATIONS_CREATE',
    'PRODUCT_PUBLICATIONS_DELETE',
    'PRODUCT_PUBLICATIONS_UPDATE',
    'PROFILES_CREATE',
    'PROFILES_DELETE',
    'PROFILES_UPDATE',
    'REFUNDS_CREATE',
    'SCHEDULED_PRODUCT_LISTINGS_ADD',
    'SCHEDULED_PRODUCT_LISTINGS_REMOVE',
    'SCHEDULED_PRODUCT_LISTINGS_UPDATE',
    'SELLING_PLAN_GROUPS_CREATE',
    'SELLING_PLAN_GROUPS_DELETE',
    'SELLING_PLAN_GROUPS_UPDATE',
    'SHOP_UPDATE',
    'SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE',
    'SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS',
    'SUBSCRIPTION_CONTRACTS_CREATE',
    'SUBSCRIPTION_CONTRACTS_UPDATE',
    'TENDER_TRANSACTIONS_CREATE',
    'THEMES_CREATE',
    'THEMES_DELETE',
    'THEMES_PUBLISH',
    'THEMES_UPDATE'
  ])
});

type PubSubWebhookSubscriptionCreateInput = z.infer<typeof PubSubWebhookSubscriptionCreateInputSchema>;

let shopifyClient: GraphQLClient;

const pubSubWebhookSubscriptionCreate = {
  name: "pub-sub-webhook-subscription-create",
  description: "Create a pub/sub webhook subscription",
  schema: PubSubWebhookSubscriptionCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PubSubWebhookSubscriptionCreateInput) => {
    const query = gql`
      mutation pubSubWebhookSubscriptionCreate($input: PubSubWebhookSubscriptionInput!) {
        pubSubWebhookSubscriptionCreate(input: $input) {
          pubSubWebhookSubscription {
            id
            callbackUrl
            format
            topic
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    try {
      const response: any = await shopifyClient.request(query, { input });
      return response.pubSubWebhookSubscriptionCreate;
    } catch (error) {
      console.error("Error creating pub/sub webhook subscription:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { pubSubWebhookSubscriptionCreate };