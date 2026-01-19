/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as apiKeys from "../apiKeys.js";
import type * as auditLogs from "../auditLogs.js";
import type * as featureFlags from "../featureFlags.js";
import type * as helpers from "../helpers.js";
import type * as invites from "../invites.js";
import type * as memberships from "../memberships.js";
import type * as notifications from "../notifications.js";
import type * as onboarding from "../onboarding.js";
import type * as orgs from "../orgs.js";
import type * as permissions from "../permissions.js";
import type * as purchases from "../purchases.js";
import type * as stripe from "../stripe.js";
import type * as subscriptions from "../subscriptions.js";
import type * as usage from "../usage.js";
import type * as users from "../users.js";
import type * as webhooks from "../webhooks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  apiKeys: typeof apiKeys;
  auditLogs: typeof auditLogs;
  featureFlags: typeof featureFlags;
  helpers: typeof helpers;
  invites: typeof invites;
  memberships: typeof memberships;
  notifications: typeof notifications;
  onboarding: typeof onboarding;
  orgs: typeof orgs;
  permissions: typeof permissions;
  purchases: typeof purchases;
  stripe: typeof stripe;
  subscriptions: typeof subscriptions;
  usage: typeof usage;
  users: typeof users;
  webhooks: typeof webhooks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
