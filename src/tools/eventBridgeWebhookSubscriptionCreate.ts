import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebhookSubscriptionTopicSchema = z.enum([
  'BULK_OPERATIONS_FINISH', 'CARTS_CREATE', 'CARTS_UPDATE', 'CHANNELS_DELETE',
  'CHANNELS_UPDATE', 'COLLECTIONS_CREATE', 'COLLECTIONS_DELETE', 'COLLECTIONS_UPDATE',
  'COLLECTION_LISTINGS_ADD', 'COLLECTION_LISTINGS_REMOVE', 'COLLECTION_LISTINGS_UPDATE',
  'COLLECTION_PUBLICATIONS_CREATE', 'COLLECTION_PUBLICATIONS_DELETE',
  'COLLECTION_PUBLICATIONS_UPDATE', 'CUSTOMERS_CREATE', 'CUSTOMERS_DELETE',
  'CUSTOMERS_DISABLE', 'CUSTOMERS_ENABLE', 'CUSTOMERS_UPDATE', 'CUSTOMER_GROUPS_CREATE',
  'CUSTOMER_GROUPS_DELETE', 'CUSTOMER_GROUPS_UPDATE', 'CUSTOMER_PAYMENT_METHODS_CREATE',
  'CUSTOMER_PAYMENT_METHODS_REVOKE', 'CUSTOMER_PAYMENT_METHODS_UPDATE', 'DISPUTES_CREATE',
  'DISPUTES_UPDATE', 'DOMAINS_CREATE', 'DOMAINS_DESTROY', 'DOMAINS_UPDATE',
  'DRAFT_ORDERS_CREATE', 'DRAFT_ORDERS_DELETE', 'DRAFT_ORDERS_UPDATE',
  'FULFILLMENTS_CREATE', 'FULFILLMENTS_UPDATE', 'FULFILLMENT_EVENTS_CREATE',
  'FULFILLMENT_ORDERS_CANCELLATION_REQUEST_ACCEPTED',
  'FULFILLMENT_ORDERS_CANCELLATION_REQUEST_REJECTED',
  'FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED', 'FULFILLMENT_ORDERS_HOLD_RELEASED',
  'FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_LOCAL_DELIVERY',
  'FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_PICKUP', 'FULFILLMENT_ORDERS_MOVED',
  'FULFILLMENT_ORDERS_ORDER_ROUTING_COMPLETE', 'FULFILLMENT_ORDERS_PLACED_ON_HOLD',
  'FULFILLMENT_ORDERS_REJECTED', 'FULFILLMENT_ORDERS_RESCHEDULED',
  'INVENTORY_ITEMS_CREATE', 'INVENTORY_ITEMS_DELETE', 'INVENTORY_ITEMS_UPDATE',
  'INVENTORY_LEVELS_CONNECT', 'INVENTORY_LEVELS_DISCONNECT', 'INVENTORY_LEVELS_UPDATE',
  'LOCALES_CREATE', 'LOCALES_UPDATE', 'LOCATIONS_ACTIVATE', 'LOCATIONS_CREATE',
  'LOCATIONS_DEACTIVATE', 'LOCATIONS_DELETE', 'LOCATIONS_UPDATE', 'MARKETS_CREATE',
  'MARKETS_DELETE', 'MARKETS_UPDATE', 'ORDERS_CANCELLED', 'ORDERS_CREATE',
  'ORDERS_DELETE', 'ORDERS_EDITED', 'ORDERS_FULFILLED', 'ORDERS_PAID',
  'ORDERS_PARTIALLY_FULFILLED', 'ORDERS_UPDATED', 'ORDER_TRANSACTIONS_CREATE',
  'PRODUCTS_CREATE', 'PRODUCTS_DELETE', 'PRODUCTS_UPDATE', 'PRODUCT_LISTINGS_ADD',
  'PRODUCT_LISTINGS_REMOVE', 'PRODUCT_LISTINGS_UPDATE', 'PRODUCT_PUBLICATIONS_CREATE',
  'PRODUCT_PUBLICATIONS_DELETE', 'PRODUCT_PUBLICATIONS_UPDATE',
  'PRODUCT_VARIANT_LISTINGS_ADD', 'PRODUCT_VARIANT_LISTINGS_REMOVE',
  'PRODUCT_VARIANT_LISTINGS_UPDATE', 'PRODUCT_VARIANT_PUBLICATIONS_CREATE',
  'PRODUCT_VARIANT_PUBLICATIONS_DELETE', 'PRODUCT_VARIANT_PUBLICATIONS_UPDATE',
  'PROFILES_CREATE', 'PROFILES_DELETE', 'PROFILES_UPDATE', 'REFUNDS_CREATE',
  'SCHEDULED_PRODUCT_LISTINGS_ADD', 'SCHEDULED_PRODUCT_LISTINGS_REMOVE',
  'SCHEDULED_PRODUCT_LISTINGS_UPDATE', 'SEGMENTS_CREATE', 'SEGMENTS_DELETE',
  'SEGMENTS_UPDATE', 'SELLING_PLAN_GROUPS_CREATE', 'SELLING_PLAN_GROUPS_DELETE',
  'SELLING_PLAN_GROUPS_UPDATE', 'SHOP_UPDATE', 'SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED',
  'SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE', 'SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS',
  'SUBSCRIPTION_BILLING_CYCLE_EDITS_CREATE', 'SUBSCRIPTION_BILLING_CYCLE_EDITS_DELETE',
  'SUBSCRIPTION_BILLING_CYCLE_EDITS_UPDATE', 'SUBSCRIPTION_CONTRACTS_CREATE',
  'SUBSCRIPTION_CONTRACTS_UPDATE', 'TENDER_TRANSACTIONS_CREATE', 'THEMES_CREATE',
  'THEMES_DELETE', 'THEMES_PUBLISH', 'THEMES_UPDATE'
]);

const WebhookSubscriptionInput = z.object({
  arn: z.string().min(1, "ARN is required"),
  format: z.enum(['JSON']),
  metafieldNamespaces: z.array(z.string()).optional(),
  privateMetafieldNamespaces: z.array(z.string()).optional(),
  subscriptionFilter: z.object({
    field: z.string(),
    relation: z.enum(['EQUALS']),
    value: z.string()
  }).optional(),
  topics: z.array(WebhookSubscriptionTopicSchema).min(1, "At least one topic is required")
});

const EventBridgeWebhookSubscriptionCreateInputSchema = z.object({
  webhookSubscription: WebhookSubscriptionInput
});

type EventBridgeWebhookSubscriptionCreateInput = z.infer<typeof EventBridgeWebhookSubscriptionCreateInputSchema>;

let shopifyClient: GraphQLClient;

const eventBridgeWebhookSubscriptionCreate = {
  name: "event-bridge-webhook-subscription-create",
  description: "Create an EventBridge webhook subscription",
  schema: EventBridgeWebhookSubscriptionCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: EventBridgeWebhookSubscriptionCreateInput) => {
    const query = gql`
      mutation eventBridgeWebhookSubscriptionCreate($input: EventBridgeWebhookSubscriptionInput!) {
        eventBridgeWebhookSubscriptionCreate(input: $input) {
          eventBridgeWebhookSubscription {
            id
            arn
            format
            topics
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input: input.webhookSubscription };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.eventBridgeWebhookSubscriptionCreate;
    } catch (error) {
      console.error("Error creating EventBridge webhook subscription:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { eventBridgeWebhookSubscriptionCreate };