/**
 * Convex用 AI分析モジュール
 *
 * OpenRouter API経由でClaude等のLLMを使用して分析を生成します
 * APIキーは環境変数 OPENROUTER_API_KEY から取得します
 */

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-sonnet-4";

export interface AnalysisInput {
  theme: string;
  selectedResults: Array<{
    resultType: string;
    testSlug: string;
    testTitle?: string;
    scores?: any;
    analysis?: any;
  }>;
}

interface AnalysisOutput {
  title: string;
  summary: string;
  insights: string[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

/**
 * OpenRouter APIを呼び出す共通関数
 */
async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  options?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY が設定されていません");
  }

  const model = options?.model ?? DEFAULT_MODEL;
  const maxTokens = options?.maxTokens ?? 2000;
  const temperature = options?.temperature ?? 0.7;

  const response = await fetch(OPENROUTER_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://pernect.app",
      "X-Title": "Pernect",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API error:", response.status, errorText);
    throw new Error(`AI APIエラー: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 統合分析を生成
 */
async function generateAnalysisWithAI(
  input: AnalysisInput
): Promise<AnalysisOutput> {
  const prompt = buildAnalysisPrompt(input);

  const content = await callOpenRouter([
    {
      role: "system",
      content:
        "あなたはプロフィール心理学者兼キャリアカウンセラーです。" +
        "複数の診断テストの結果を統合し、包括的でパーソナライズされた分析を提供してください。" +
        "回答は日本語で、具体例を交えて分かりやすく説明してください。",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);

  return parseAIResponse(content);
}

/**
 * 分析用のプロンプトを構築
 */
function buildAnalysisPrompt(input: AnalysisInput): string {
  const { theme, selectedResults } = input;

  const themeNames: Record<string, string> = {
    love: "恋愛",
    career: "キャリア",
    general: "総合",
  };

  const themeName = themeNames[theme] || theme;

  const resultsText = selectedResults
    .map(
      (result) =>
        `- ${result.testTitle || result.testSlug}: ${result.resultType}`
    )
    .join("\n");

  return `
以下の診断テストの結果に基づいて、「${themeName}」に関する統合分析を行ってください。

【診断結果】
${resultsText}

【分析内容】
1. タイトル: 分析のタイトル（魅力的で簡潔なタイトル）
2. summary: 一行要約（全体を要約した1〜2文）
3. insights: 主要インサイト（3〜5個の洞察）
4. strengths: 強み（3個）
5. challenges: 課題（3個）
6. recommendations: アドバイス（3個）

以下のJSON形式で回答してください：
{
  "title": "タイトル",
  "summary": "要約",
  "insights": ["インサイト1", "インサイト2", ...],
  "strengths": ["強み1", "強み2", ...],
  "challenges": ["課題1", "課題2", ...],
  "recommendations": ["アドバイス1", "アドバイス2", ...]
}
`;
}

/**
 * AI応答を解析して構造化
 */
function parseAIResponse(content: string): AnalysisOutput {
  try {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    const quoteMatch = content.match(/"(\{[^}]*\})"/);
    if (quoteMatch) {
      return JSON.parse(quoteMatch[1]);
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("AI応答のパースに失敗:", error);
    console.log("Raw content:", content);
    return parseTextFallback(content);
  }
}

/**
 * テキスト解析のフォールバック
 */
function parseTextFallback(content: string): AnalysisOutput {
  return {
    title: "統合分析レポート",
    summary: content.slice(0, 100) + "...",
    insights: extractSections(content, ["洞察", "インサイト", "特徴"]).slice(0, 5),
    strengths: extractSections(content, ["強み", "長所"]).slice(0, 3),
    challenges: extractSections(content, ["課題", "改善点"]).slice(0, 3),
    recommendations: extractSections(content, ["アドバイス", "おすすめ"]).slice(0, 3),
  };
}

/**
 * キーワードを含むセクションを抽出
 */
function extractSections(
  content: string,
  keywords: string[]
): string[] {
  const sections: string[] = [];
  const lines = content.split("\n");

  let currentSection = "";
  for (const line of lines) {
    const trimmedLine = line.trim();
    const isKeyword = keywords.some((kw) => trimmedLine.includes(kw));
    const isListItem = trimmedLine.startsWith("-") || trimmedLine.startsWith("•");

    if ((isKeyword || isListItem) && currentSection) {
      sections.push(currentSection.trim());
      currentSection = "";
    }

    if (isListItem) {
      currentSection = trimmedLine.replace(/^[-•]\s*/, "");
    }
  }

  if (currentSection) {
    sections.push(currentSection.trim());
  }

  return sections.filter((s) => s.length > 0);
}

// ============================================================
// 深掘り相性分析（プレミアム機能）
// ============================================================

export interface DeepCompatibilityInput {
  user1Name: string;
  user2Name: string;
  user1Tests: Array<{ testSlug: string; resultType: string; scores?: any }>;
  user2Tests: Array<{ testSlug: string; resultType: string; scores?: any }>;
  basicAnalysis: {
    overallCompatibility: number;
    strengths: string[];
    challenges: string[];
    insights: Array<{ category: string; score: number }>;
  };
}

export interface DeepCompatibilityOutput {
  title: string;
  overview: string;
  sections: Array<{
    category: string;
    insight: string;
    advice: string;
  }>;
  hiddenDynamics: string;
  growthPath: string;
}

function buildDeepCompatibilityPrompt(input: DeepCompatibilityInput): string {
  const user1Results = input.user1Tests
    .map((t) => `  - ${t.testSlug}: ${t.resultType}`)
    .join("\n");
  const user2Results = input.user2Tests
    .map((t) => `  - ${t.testSlug}: ${t.resultType}`)
    .join("\n");

  const dimensionScores = input.basicAnalysis.insights
    .map((i) => `  - ${i.category}: ${i.score}%`)
    .join("\n");

  return `
あなたは臨床心理学と対人関係の専門家です。
2人のユーザーの診断データと基本相性分析を基に、**深掘り相性分析**を生成してください。

表面的な相性スコアの裏にある「なぜこの2人はこうなるのか」を心理学的に読み解いてください。
回答は日本語で、具体的なシチュエーション例を交えてください。

【${input.user1Name}の診断結果】
${user1Results}

【${input.user2Name}の診断結果】
${user2Results}

【基本相性スコア】
総合: ${input.basicAnalysis.overallCompatibility}%
${dimensionScores}

【基本分析の強み】
${input.basicAnalysis.strengths.map((s) => `- ${s}`).join("\n")}

【基本分析の課題】
${input.basicAnalysis.challenges.map((c) => `- ${c}`).join("\n")}

【出力形式】
以下のJSON形式で回答してください：
{
  "title": "2人の関係を表す魅力的なタイトル（15文字以内）",
  "overview": "2人の関係性の本質を深く読み解いた概要（200-300文字）",
  "sections": [
    {
      "category": "カテゴリ名",
      "insight": "この2人特有の深い洞察（100-150文字、具体例を含む）",
      "advice": "具体的なアクションアドバイス（80-120文字）"
    }
  ],
  "hiddenDynamics": "表面に見えない関係のダイナミクスや無意識のパターン（150-200文字）",
  "growthPath": "2人が一緒に成長するための具体的なロードマップ（150-200文字）"
}

sectionsは以下の5カテゴリで生成してください：
1. コミュニケーションパターン
2. 感情の交差点
3. 価値観と人生観
4. 衝突と修復のサイクル
5. 長期的な関係の深化
`;
}

function parseDeepCompatibilityResponse(content: string): DeepCompatibilityOutput {
  try {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(content);
  } catch {
    return {
      title: "深掘り相性レポート",
      overview: content.slice(0, 300),
      sections: [
        {
          category: "コミュニケーションパターン",
          insight: "お二人のコミュニケーションには独特のリズムがあります。",
          advice: "日常の小さな会話を大切にしましょう。",
        },
      ],
      hiddenDynamics: "表面的な相性の裏には、深い補完関係が隠れています。",
      growthPath: "お互いの違いを「学び」として捉え、段階的に理解を深めていきましょう。",
    };
  }
}

export async function generateDeepCompatibilityAnalysis(
  input: DeepCompatibilityInput
): Promise<DeepCompatibilityOutput> {
  const prompt = buildDeepCompatibilityPrompt(input);

  const content = await callOpenRouter(
    [
      {
        role: "system",
        content: "あなたは臨床心理学と対人関係の専門家です。JSON形式で回答してください。",
      },
      { role: "user", content: prompt },
    ],
    { maxTokens: 3000 }
  );

  return parseDeepCompatibilityResponse(content);
}

/**
 * 統合分析を生成する
 */
export async function generateAnalysis(
  input: AnalysisInput,
  useAI: boolean = true
): Promise<AnalysisOutput> {
  if (!useAI) {
    throw new Error("AI分析が無効化されています");
  }

  return await generateAnalysisWithAI(input);
}
