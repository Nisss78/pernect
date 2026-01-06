/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lastLover from "../lastLover.js";
import type * as scoring from "../scoring.js";
import type * as seedBig5Questions from "../seedBig5Questions.js";
import type * as seedEvidenceBasedTests from "../seedEvidenceBasedTests.js";
import type * as seedLastLoverCompatibility from "../seedLastLoverCompatibility.js";
import type * as seedLastLoverTest from "../seedLastLoverTest.js";
import type * as seedLastLoverTypes from "../seedLastLoverTypes.js";
import type * as seedTests from "../seedTests.js";
import type * as shareLinks from "../shareLinks.js";
import type * as testAnswers from "../testAnswers.js";
import type * as testResults from "../testResults.js";
import type * as tests from "../tests.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  lastLover: typeof lastLover;
  scoring: typeof scoring;
  seedBig5Questions: typeof seedBig5Questions;
  seedEvidenceBasedTests: typeof seedEvidenceBasedTests;
  seedLastLoverCompatibility: typeof seedLastLoverCompatibility;
  seedLastLoverTest: typeof seedLastLoverTest;
  seedLastLoverTypes: typeof seedLastLoverTypes;
  seedTests: typeof seedTests;
  shareLinks: typeof shareLinks;
  testAnswers: typeof testAnswers;
  testResults: typeof testResults;
  tests: typeof tests;
  users: typeof users;
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
