/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as friendships from "../friendships.js";
import type * as integratedAnalyses from "../integratedAnalyses.js";
import type * as lastLover from "../lastLover.js";
import type * as profileSharing from "../profileSharing.js";
import type * as scoring from "../scoring.js";
import type * as seedBig5Questions from "../seedBig5Questions.js";
import type * as seedCareerAnchorsTest from "../seedCareerAnchorsTest.js";
import type * as seedEnneagramTest from "../seedEnneagramTest.js";
import type * as seedEvidenceBasedTests from "../seedEvidenceBasedTests.js";
import type * as seedLastLoverCompatibility from "../seedLastLoverCompatibility.js";
import type * as seedLastLoverTest from "../seedLastLoverTest.js";
import type * as seedLastLoverTypes from "../seedLastLoverTypes.js";
import type * as seedMbtiTest from "../seedMbtiTest.js";
import type * as seedSchwartzTest from "../seedSchwartzTest.js";
import type * as seedStrengthsTest from "../seedStrengthsTest.js";
import type * as seedTestFriends from "../seedTestFriends.js";
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
  friendships: typeof friendships;
  integratedAnalyses: typeof integratedAnalyses;
  lastLover: typeof lastLover;
  profileSharing: typeof profileSharing;
  scoring: typeof scoring;
  seedBig5Questions: typeof seedBig5Questions;
  seedCareerAnchorsTest: typeof seedCareerAnchorsTest;
  seedEnneagramTest: typeof seedEnneagramTest;
  seedEvidenceBasedTests: typeof seedEvidenceBasedTests;
  seedLastLoverCompatibility: typeof seedLastLoverCompatibility;
  seedLastLoverTest: typeof seedLastLoverTest;
  seedLastLoverTypes: typeof seedLastLoverTypes;
  seedMbtiTest: typeof seedMbtiTest;
  seedSchwartzTest: typeof seedSchwartzTest;
  seedStrengthsTest: typeof seedStrengthsTest;
  seedTestFriends: typeof seedTestFriends;
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
