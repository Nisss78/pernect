import { useQuery } from "convex/react";
import { useMemo, useCallback } from "react";

import { api } from "../../../convex/_generated/api";

interface DiagnosticResult {
  testSlug: string;
  resultType: string;
  scores?: Record<string, number>;
  percentiles?: Record<string, number>;
  completedAt?: string;
}

export function useIntegratedProfile() {
  // Fetch integrated profile with all latest results
  const profile = useQuery(api.testResults.getIntegratedProfile);

  // Fetch all historical results
  const allResults = useQuery(api.testResults.listByUser, {});

  // Get latest result for each test
  const latestByTest = useMemo(() => {
    if (!profile?.profiles) return {};

    return profile.profiles.reduce((acc, p) => {
      acc[p.testSlug] = {
        testSlug: p.testSlug,
        resultType: p.resultType,
        scores: p.scores,
        percentiles: p.percentiles,
        completedAt: p.completedAt,
      };
      return acc;
    }, {} as Record<string, DiagnosticResult>);
  }, [profile]);

  // Convert to array for grid display
  const diagnosticsList = useMemo(() => {
    if (!profile?.profiles) return [];

    return profile.profiles.map((p) => ({
      testSlug: p.testSlug,
      resultType: p.resultType,
    }));
  }, [profile]);

  // Get history for a specific test
  const getHistoryForTest = useCallback(
    (testSlug: string) => {
      if (!allResults) return [];

      return allResults.filter((r) => r.test?.slug === testSlug);
    },
    [allResults]
  );

  // Check if a specific test has been completed
  const hasCompletedTest = useCallback(
    (testSlug: string) => {
      return testSlug in latestByTest;
    },
    [latestByTest]
  );

  // Get count of completed tests
  const completedTestCount = useMemo(() => {
    return Object.keys(latestByTest).length;
  }, [latestByTest]);

  return {
    // Data
    latestResults: latestByTest,
    diagnosticsList,
    totalTests: profile?.totalTests ?? 0,

    // Loading state
    isLoading: profile === undefined,

    // Utility functions
    getHistoryForTest,
    hasCompletedTest,
    completedTestCount,
  };
}
