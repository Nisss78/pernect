import React from 'react';
import { View } from 'react-native';

/**
 * スケルトンローディングコンポーネント
 *
 * コンテンツが読み込まれている間に表示されるプレースホルダー
 * ユーザーに「読み込み中」を視覚的に伝え、待機時間を短く感じさせる効果
 */

interface SkeletonProps {
  /** 幅（例: 'w-full', 'w-12', 100） */
  width?: string | number;
  /** 高さ（例: 'h-4', 'h-12', 50） */
  height?: string | number;
  /** 角丸（例: 'rounded', 'rounded-full', 8） */
  borderRadius?: string | number;
  /** Tailwindクラス（追加のスタイル） */
  className?: string;
  /** アニメーションの速度（秒単位） */
  duration?: number;
}

/**
 * 基本スケルトン
 */
export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  borderRadius = 'rounded',
  className = '',
  duration = 1.5,
}: SkeletonProps) {
  return (
    <View
      className={`bg-muted animate-pulse ${borderRadius} ${className}`}
      style={{
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
        borderRadius: typeof borderRadius === 'number' ? borderRadius : undefined,
        animationDuration: `${duration}s`,
      }}
    />
  );
}

/**
 * テスト用カードスケルトン
 * 人気のテスト、おすすめテストなどの横スクロールカード用
 */
export function TestCardSkeleton() {
  return (
    <View className="bg-card rounded-3xl p-5 border border-border/40 overflow-hidden">
      {/* アイコンとバッジ */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="w-14 h-14 bg-muted rounded-2xl" />
        <View className="w-20 h-7 bg-muted rounded-full" />
      </View>

      {/* タイトル */}
      <View className="w-3/4 h-6 bg-muted rounded-xl mb-2" />
      <View className="w-full h-4 bg-muted rounded-lg mb-1" />
      <View className="w-2/3 h-4 bg-muted rounded-lg mb-6" />

      {/* メタ情報 */}
      <View className="flex-row gap-3">
        <View className="w-16 h-7 bg-muted rounded-lg" />
        <View className="w-20 h-7 bg-muted rounded-lg" />
      </View>
    </View>
  );
}

/**
 * グリッドカードスケルトン
 * 「あなたへのおすすめ」セクションの2カラムカード用
 */
export function GridCardSkeleton() {
  return (
    <View className="w-[48%] bg-card rounded-[24px] p-5 border border-border/40">
      {/* アイコン */}
      <View className="w-13 h-13 bg-muted rounded-2xl mb-4 self-start" />

      {/* タイトル */}
      <View className="w-full h-5 bg-muted rounded-lg mb-2" />
      <View className="w-2/3 h-4 bg-muted rounded mb-4" />

      {/* メタ情報 */}
      <View className="flex-row gap-2">
        <View className="w-14 h-6 bg-muted rounded-lg" />
        <View className="w-16 h-6 bg-muted rounded-lg" />
      </View>
    </View>
  );
}

/**
 * リストアイテムスケルトン
 * 縦スクロールのリスト項目用
 */
export function ListItemSkeleton() {
  return (
    <View className="bg-card rounded-2xl p-4 border border-border/40 flex-row items-center">
      {/* アバター */}
      <View className="w-12 h-12 bg-muted rounded-full mr-4" />

      {/* テキストエリア */}
      <View className="flex-1">
        <View className="w-3/4 h-4 bg-muted rounded mb-2" />
        <View className="w-1/2 h-3 bg-muted rounded" />
      </View>

      {/* アクションアイコン */}
      <View className="w-8 h-8 bg-muted rounded-lg" />
    </View>
  );
}

/**
 * プロフィールヘッダースケルトン
 */
export function ProfileHeaderSkeleton() {
  return (
    <View className="px-6 pt-14 pb-6">
      <View className="flex-row items-center">
        {/* アバター */}
        <View className="w-20 h-20 bg-muted rounded-full mr-4" />

        {/* テキスト情報 */}
        <View className="flex-1">
          <View className="w-32 h-5 bg-muted rounded-lg mb-2" />
          <View className="w-24 h-4 bg-muted rounded mb-1" />
          <View className="w-16 h-3 bg-muted rounded" />
        </View>

        {/* アクションボタン */}
        <View className="w-10 h-10 bg-muted rounded-xl" />
      </View>

      {/* 統計セクション */}
      <View className="flex-row justify-between mt-6 pt-6 border-t border-border">
        <View className="items-center">
          <View className="w-8 h-5 bg-muted rounded mb-1" />
          <View className="w-12 h-3 bg-muted rounded" />
        </View>
        <View className="items-center">
          <View className="w-8 h-5 bg-muted rounded mb-1" />
          <View className="w-12 h-3 bg-muted rounded" />
        </View>
        <View className="items-center">
          <View className="w-8 h-5 bg-muted rounded mb-1" />
          <View className="w-12 h-3 bg-muted rounded" />
        </View>
      </View>
    </View>
  );
}

/**
 * テスト質問スケルトン
 */
export function TestQuestionSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="px-6 pt-14 pb-4">
        <View className="w-full h-2 bg-muted rounded-full mb-4" />
        <View className="w-3/4 h-6 bg-muted rounded-lg mb-4" />
        <View className="w-full h-16 bg-muted rounded-xl" />
      </View>

      {/* 選択肢 */}
      <View className="px-6 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="w-full h-14 bg-muted rounded-2xl" />
        ))}
      </View>
    </View>
  );
}

/**
 * フレンドリストスケルトン
 */
export function FriendListSkeleton() {
  return (
    <View className="gap-3">
      {[1, 2, 3].map((i) => (
        <ListItemSkeleton key={i} />
      ))}
    </View>
  );
}

/**
 * 統計カードスケルトン
 * ダッシュボードや分析画面のカード用
 */
export function StatsCardSkeleton() {
  return (
    <View className="bg-card rounded-3xl p-5 border border-border/40">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="w-8 h-8 bg-muted rounded-xl" />
        <View className="w-16 h-4 bg-muted rounded" />
      </View>

      {/* 数値 */}
      <View className="w-24 h-8 bg-muted rounded-xl mb-2" />
      <View className="w-32 h-3 bg-muted rounded mb-4" />

      {/* チャートプレースホルダー */}
      <View className="w-full h-24 bg-muted/50 rounded-xl" />
    </View>
  );
}

/**
 * タブスケルトン
 * ボトムナビゲーションの代わりに使用する中間状態
 */
export function TabSkeleton() {
  return (
    <View className="flex-row justify-around py-3 bg-card border-t border-border">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="w-12 h-12 bg-muted rounded-xl" />
      ))}
    </View>
  );
}
