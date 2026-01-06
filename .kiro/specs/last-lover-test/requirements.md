# Requirements Document

## Introduction

最後の恋人診断（Last Lover Test）は、韓国発の人気恋愛性格診断です。恋愛における行動パターンや価値観を4つの軸で分析し、16種類の恋愛キャラクタータイプに分類します。SNSでシェアしやすいビジュアルリッチな結果画面を提供し、若年層ユーザーのエンゲージメント向上とバイラル拡散を目指します。

## Requirements

### Requirement 1: 診断テストの基本構造

**Objective:** ユーザーとして、シナリオベースの恋愛診断質問に回答することで、自分の恋愛タイプを発見したい。

#### Acceptance Criteria

1. WHEN ユーザーが最後の恋人診断を開始する THEN システムは12〜16問のシナリオベース質問を順番に表示する SHALL
2. WHEN 各質問が表示される THEN システムは2択の選択肢を提示する SHALL
3. WHEN ユーザーが選択肢を選ぶ THEN システムは対応する診断軸のスコアを記録する SHALL
4. WHILE ユーザーが診断中である THE システムは進捗バーで現在の進行状況を表示する SHALL
5. WHERE 質問が4つの診断軸（E/I、S/N、T/F、J/P）に対応している THE システムは各軸3〜4問ずつ均等に配分する SHALL

### Requirement 2: 4つの診断軸によるタイプ判定

**Objective:** システムとして、ユーザーの回答を4つの軸で分析し、16種類のタイプのいずれかに分類したい。

#### Acceptance Criteria

1. WHEN 全ての質問への回答が完了する THEN システムは4つの軸それぞれの傾向を算出する SHALL
2. IF E/I軸でE傾向が優勢である THEN システムはタイプコードの1文字目をEとする SHALL
3. IF E/I軸でI傾向が優勢である THEN システムはタイプコードの1文字目をIとする SHALL
4. IF S/N軸でS傾向が優勢である THEN システムはタイプコードの2文字目をSとする SHALL
5. IF S/N軸でN傾向が優勢である THEN システムはタイプコードの2文字目をNとする SHALL
6. IF T/F軸でT傾向が優勢である THEN システムはタイプコードの3文字目をTとする SHALL
7. IF T/F軸でF傾向が優勢である THEN システムはタイプコードの3文字目をFとする SHALL
8. IF J/P軸でJ傾向が優勢である THEN システムはタイプコードの4文字目をJとする SHALL
9. IF J/P軸でP傾向が優勢である THEN システムはタイプコードの4文字目をPとする SHALL

### Requirement 3: 16種類の恋愛キャラクタータイプ

**Objective:** ユーザーとして、自分のタイプに対応する可愛いキャラクター名と詳細な説明を見たい。

#### Acceptance Criteria

1. WHEN タイプ判定が完了する THEN システムは対応するキャラクター名を表示する SHALL
2. WHEN 結果画面が表示される THEN システムはタイプの恋愛傾向説明を表示する SHALL
3. WHEN 結果画面が表示される THEN システムはタイプの強みと弱みを表示する SHALL
4. WHERE 16タイプそれぞれに THE システムは固有のキャラクター名、説明文、恋愛傾向を保持する SHALL
5. WHEN 結果画面が表示される THEN システムは恋愛における行動パターンの特徴を表示する SHALL

### Requirement 4: 相性診断機能

**Objective:** ユーザーとして、自分のタイプと相性の良いタイプ・悪いタイプを知りたい。

#### Acceptance Criteria

1. WHEN 結果画面が表示される THEN システムは相性の良いタイプを最大3つ表示する SHALL
2. WHEN 結果画面が表示される THEN システムは相性の注意が必要なタイプを最大2つ表示する SHALL
3. WHEN 相性タイプが表示される THEN システムは相性の理由を簡潔に説明する SHALL
4. WHERE 相性情報が表示される THE システムは相手タイプのキャラクター名も併せて表示する SHALL

### Requirement 5: ビジュアルリッチな結果画面

**Objective:** ユーザーとして、SNSでシェアしたくなるような魅力的な結果画面を見たい。

#### Acceptance Criteria

1. WHEN 結果画面が表示される THEN システムはピンク〜パープル系のグラデーション背景を適用する SHALL
2. WHEN 結果画面が表示される THEN システムはアニメーション付きで結果を表示する SHALL
3. WHERE キャラクタータイプが表示される THE システムは対応する絵文字またはアイコンを表示する SHALL
4. WHEN 結果が確定する THEN システムはフェードイン等のアニメーションで結果を演出する SHALL
5. WHERE 4つの軸スコアが表示される THE システムは視覚的なバーまたはチャートで傾向を表示する SHALL

### Requirement 6: 質問画面のUI/UX

**Objective:** ユーザーとして、恋愛診断らしい雰囲気で楽しく質問に回答したい。

#### Acceptance Criteria

1. WHEN 質問画面が表示される THEN システムは恋愛テーマに合ったピンク〜パープル系のデザインを適用する SHALL
2. WHEN 質問文が表示される THEN システムは関連する絵文字を質問テキストに含める SHALL
3. WHEN 選択肢が表示される THEN システムは各選択肢をタップしやすいカード形式で表示する SHALL
4. WHEN ユーザーが選択肢をタップする THEN システムは選択アニメーションを表示する SHALL
5. WHILE 診断が進行中である THE システムは画面上部に進捗インジケーターを表示する SHALL

### Requirement 7: 診断結果の保存と履歴

**Objective:** ユーザーとして、過去の診断結果を後から確認したい。

#### Acceptance Criteria

1. WHEN 診断が完了する THEN システムは結果をConvexデータベースに保存する SHALL
2. WHEN ユーザーが結果画面を閉じる THEN システムは結果をプロフィール画面から参照可能にする SHALL
3. IF ユーザーが同じ診断を再度受ける THEN システムは新しい結果を上書きまたは追加で保存する SHALL
4. WHERE 結果が保存される THE システムは診断日時も記録する SHALL

### Requirement 8: テスト一覧への統合

**Objective:** ユーザーとして、テスト一覧画面から最後の恋人診断を開始したい。

#### Acceptance Criteria

1. WHEN テスト一覧画面が表示される THEN システムは最後の恋人診断をカード形式で表示する SHALL
2. WHERE 診断カードが表示される THE システムはピンク〜パープル系のグラデーションを適用する SHALL
3. WHEN 診断カードが表示される THEN システムはハートアイコンを表示する SHALL
4. WHEN ユーザーがカードをタップする THEN システムは診断開始画面に遷移する SHALL
5. WHERE 診断の進行状態がある THE システムは未開始/進行中/完了のステータスバッジを表示する SHALL

### Requirement 9: データモデルとスキーマ

**Objective:** 開発者として、最後の恋人診断のデータを適切に管理したい。

#### Acceptance Criteria

1. WHERE 診断テストが定義される THE システムは既存のtestsテーブルスキーマに準拠する SHALL
2. WHERE 質問が定義される THE システムはtestQuestionsテーブルに診断軸情報を含める SHALL
3. WHERE 結果タイプが定義される THE システムはlastLoverTypesテーブルに16タイプの情報を保持する SHALL
4. WHERE 相性情報が定義される THE システムはlastLoverCompatibilityテーブルにタイプ間の相性を保持する SHALL
5. WHEN 診断結果が保存される THEN システムは4軸それぞれのスコアと最終タイプコードを保存する SHALL

### Requirement 10: パフォーマンスと信頼性

**Objective:** ユーザーとして、スムーズで信頼性の高い診断体験を得たい。

#### Acceptance Criteria

1. WHEN 質問間を遷移する THEN システムは300ms以内に次の質問を表示する SHALL
2. IF ネットワークエラーが発生する THEN システムはエラーメッセージを表示し再試行オプションを提供する SHALL
3. WHILE 診断が進行中である THE システムは回答を一時的にローカルにキャッシュする SHALL
4. IF アプリが中断される THEN システムは次回起動時に診断を再開可能にする SHALL
