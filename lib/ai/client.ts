/**
 * AI APIクライアント
 *
 * OpenAI GPT-4またはAnthropic Claude APIを使用して統合分析を生成します
 * APIキーは環境変数から取得します
 */

interface AnalysisInput {
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
 * OpenAI APIを使用して分析を生成
 */
export async function generateAnalysisWithOpenAI(
  input: AnalysisInput
): Promise<AnalysisOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI APIキーが設定されていません");
  }

  // プロンプトを構築
  const prompt = buildAnalysisPrompt(input);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
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
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`AI APIエラー: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // AIの応答を解析して構造化
    return parseAIResponse(content);
  } catch (error) {
    console.error("AI分析生成エラー:", error);
    throw error;
  }
}

/**
 * Anthropic Claude APIを使用して分析を生成
 */
export async function generateAnalysisWithClaude(
  input: AnalysisInput
): Promise<AnalysisOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic APIキーが設定されていません");
  }

  const prompt = buildAnalysisPrompt(input);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`AI APIエラー: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    return parseAIResponse(content);
  } catch (error) {
    console.error("AI分析生成エラー:", error);
    throw error;
  }
}

/**
 * 分析用のプロンプトを構築
 */
function buildAnalysisPrompt(input: AnalysisInput): string {
  const { theme, selectedResults } = input;

  // テーマ名の日本語マッピング
  const themeNames: Record<string, string> = {
    love: "恋愛",
    career: "キャリア",
    general: "総合",
  };

  const themeName = themeNames[theme] || theme;

  // 診断結果を整形
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
1. タitle: 分析のタイトル（魅力的で簡潔なタイトル）
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
    // JSONを抽出するために ```json ```で囲まれた部分を探す
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // バッククォートで囲まれたJSONを探す
    const quoteMatch = content.match(/"(\{[^}]*\})"/);
    if (quoteMatch) {
      return JSON.parse(quoteMatch[1]);
    }

    // 直接JSONとしてパースを試みる
    return JSON.parse(content);
  } catch (error) {
    console.error("AI応答のパースに失敗:", error);
    console.log("Raw content:", content);

    // パース失敗時はフォールバックとしてテキスト解析
    return parseTextFallback(content);
  }
}

/**
 * テキスト解析のフォールバック
 */
function parseTextFallback(content: string): AnalysisOutput {
  const lines = content.split("\n").filter((line) => line.trim());

  // 簡単なキーワードベースの抽出
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

/**
 * 利用可能なAIプロバイダーをチェック
 */
export function getAvailableAIProvider(): "openai" | "anthropic" | null {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

/**
 * AI分析が利用可能かチェック
 */
export function isAIAnalysisAvailable(): boolean {
  return getAvailableAIProvider() !== null;
}

/**
 * 統合分析を生成する（AIまたはテンプレート）
 *
 * @param input - 分析入力データ
 * @param useAI - AIを使用するか（デフォルト: 環境変数にキーがあればtrue）
 * @returns 分析結果
 */
export async function generateAnalysis(
  input: AnalysisInput,
  useAI: boolean = true
): Promise<AnalysisOutput> {
  const hasAIKey = isAIAnalysisAvailable();

  // AI利用可能で、かつuseAIがtrueの場合はAI APIを使用
  if (useAI && hasAIKey) {
    const provider = getAvailableAIProvider();
    console.log(`Using ${provider} for AI analysis`);

    try {
      if (provider === "openai") {
        return await generateAnalysisWithOpenAI(input);
      } else if (provider === "anthropic") {
        return await generateAnalysisWithClaude(input);
      }
    } catch (error) {
      console.error("AI API呼び出しに失敗、テンプレートを使用します:", error);
      // フォールバック: 既存のテンプレートを使用
    }
  }

  // テンプレートベースの分析（フォールバック）
  return generateTemplateBasedAnalysis(input);
}

/**
 * テンプレートベースの分析生成（既存ロジック）
 */
function generateTemplateBasedAnalysis(
  input: AnalysisInput
): AnalysisOutput {
  const template = getTemplateForTheme(input.theme);

  // 診断結果の数に基づいて調整
  const insightCount = Math.min(input.selectedResults.length + 2, 5);

  return {
    title: template.title,
    summary: template.summaryTemplates[
      Math.floor(Math.random() * template.summaryTemplates.length)
    ],
    insights: selectRandom(template.insightTemplates, insightCount),
    strengths: selectRandom(template.strengthTemplates, 3),
    challenges: selectRandom(template.challengeTemplates, 3),
    recommendations: selectRandom(template.recommendationTemplates, 3),
  };
}

/**
 * テーマに応じたテンプレートを取得
 */
function getTemplateForTheme(theme: string) {
  const templates: Record<string, any> = {
    love: {
      title: "あなたの恋愛傾向分析",
      summaryTemplates: [
        "あなたは愛情深く、パートナーとの深い絆を大切にするタイプです。",
        "直感と感情のバランスが取れた恋愛スタイルを持っています。",
        "コミュニケーションを大切にし、相手の気持ちを理解しようとする姿勢があります。",
      ],
      insightTemplates: [
        "恋愛において、相手の感情を敏感に察知する能力があります。",
        "長期的な関係性を築くことに向いています。",
        "信頼関係を最も重要視する傾向があります。",
        "パートナーの成長をサポートすることに喜びを感じます。",
        "感情表現において、言葉よりも行動で示すことを好みます。",
      ],
      strengthTemplates: [
        "相手の気持ちを理解する共感力",
        "安定した関係を築く忍耐力",
        "愛情を惜しみなく与えられる",
        "相手を尊重するコミュニケーション力",
      ],
      challengeTemplates: [
        "自分の気持ちを素直に表現すること",
        "相手に期待しすぎてしまうこと",
        "自分の時間を確保するバランス",
        "意見の相違を建設的に解決すること",
      ],
      recommendationTemplates: [
        "定期的にパートナーと感謝の気持ちを共有しましょう",
        "自分自身の時間も大切にし、健全な関係を維持しましょう",
        "相手の言葉だけでなく、行動にも注目してみましょう",
        "小さな変化を楽しむ心の余裕を持ちましょう",
      ],
    },
    career: {
      title: "あなたのキャリア分析",
      summaryTemplates: [
        "あなたは目標達成に向けて着実に歩みを進めるタイプです。",
        "創造性と論理性のバランスが取れた仕事スタイルを持っています。",
        "チームワークと個人の力の両方を活かせる能力があります。",
      ],
      insightTemplates: [
        "問題解決において、複数の視点から考えることができます。",
        "長期的なキャリアビジョンを描く力があります。",
        "新しいスキルを習得する意欲が高いです。",
        "チーム内での調整役として力を発揮できます。",
        "困難な状況でも冷静に判断できる強さがあります。",
      ],
      strengthTemplates: [
        "計画を立てて実行する力",
        "コミュニケーション能力",
        "問題解決への積極的な姿勢",
        "継続的な学習意欲",
      ],
      challengeTemplates: [
        "完璧を求めすぎず、適切なタイミングで完了すること",
        "優先順位を明確にして集中すること",
        "ワークライフバランスを維持すること",
        "フィードバックを素直に受け入れること",
      ],
      recommendationTemplates: [
        "自分の強みを活かせる役割を積極的に探しましょう",
        "定期的にキャリアの方向性を見直しましょう",
        "ネットワークを広げ、様々な視点を取り入れましょう",
        "失敗を恐れず、新しい挑戦に踏み出しましょう",
      ],
    },
    general: {
      title: "あなたの総合分析",
      summaryTemplates: [
        "あなたは多面的な魅力を持ち、様々な状況に適応できる人です。",
        "バランスの取れた視点で物事を捉えることができます。",
        "自己成長への意欲が高く、常に向上を目指しています。",
      ],
      insightTemplates: [
        "内面の強さと外面の柔軟性を兼ね備えています。",
        "直感と論理の両方を活用して判断することができます。",
        "人間関係において、深さと広さの両方を大切にしています。",
        "変化を恐れず、新しい経験を受け入れる姿勢があります。",
        "自分らしさを保ちながら、周囲との調和を図れます。",
      ],
      strengthTemplates: [
        "適応力と柔軟性",
        "自己認識の深さ",
        "バランス感覚",
        "成長への意欲",
      ],
      challengeTemplates: [
        "多くの選択肢の中から決断すること",
        "全ての面でバランスを取ろうとしすぎること",
        "自分の限界を認めること",
        "優先順位を明確にすること",
      ],
      recommendationTemplates: [
        "自分の価値観に基づいた選択を心がけましょう",
        "小さな成功を積み重ね、自信を育てましょう",
        "他者との違いを個性として受け入れましょう",
        "定期的に振り返りの時間を設けましょう",
      ],
    },
  };

  return templates[theme] || templates.general;
}

/**
 * 配列からランダムに選択
 */
function selectRandom<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}
