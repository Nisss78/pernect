import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AnalysisTheme } from "../components/ThemeSelector";

export function useIntegratedAnalysis() {
  const [isCreating, setIsCreating] = useState(false);

  // 完了済みの診断結果を取得
  const allResults = useQuery(api.testResults.listByUser, {});

  // 分析履歴を取得
  const analysisHistory = useQuery(api.integratedAnalyses.listByUser, {});

  // 分析作成mutation
  const createAnalysisMutation = useMutation(api.integratedAnalyses.create);

  // 最新の診断結果のみを抽出（テストスラグごとに1つ）
  const latestResultsByTest = useCallback(() => {
    if (!allResults) return [];

    const byTestSlug = new Map<string, (typeof allResults)[0]>();
    for (const result of allResults) {
      const slug = result.test?.slug;
      if (!slug) continue;

      const existing = byTestSlug.get(slug);
      if (!existing || result.completedAt > existing.completedAt) {
        byTestSlug.set(slug, result);
      }
    }

    return Array.from(byTestSlug.values()).map((result) => ({
      _id: result._id,
      testSlug: result.test?.slug || "",
      resultType: result.resultType,
      testTitle: result.test?.title,
      testIcon: result.test?.icon,
      gradientStart: result.test?.gradientStart,
      gradientEnd: result.test?.gradientEnd,
    }));
  }, [allResults]);

  // 分析を作成
  const createAnalysis = useCallback(
    async (selectedResultIds: Id<"testResults">[], theme: AnalysisTheme) => {
      setIsCreating(true);
      try {
        const result = await createAnalysisMutation({
          selectedResultIds,
          theme,
        });
        return result;
      } finally {
        setIsCreating(false);
      }
    },
    [createAnalysisMutation]
  );

  return {
    // データ
    completedResults: latestResultsByTest(),
    analysisHistory: analysisHistory || [],

    // ローディング状態
    isLoading: allResults === undefined || analysisHistory === undefined,
    isCreating,

    // アクション
    createAnalysis,
  };
}

export function useAnalysisDetail(analysisId: Id<"integratedAnalyses"> | null) {
  const analysis = useQuery(
    api.integratedAnalyses.getById,
    analysisId ? { analysisId } : "skip"
  );

  const removeAnalysisMutation = useMutation(api.integratedAnalyses.remove);

  const removeAnalysis = useCallback(async () => {
    if (!analysisId) return;
    await removeAnalysisMutation({ analysisId });
  }, [analysisId, removeAnalysisMutation]);

  return {
    analysis,
    isLoading: analysis === undefined,
    removeAnalysis,
  };
}
