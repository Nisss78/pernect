import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Citation {
  authors: string[];
  title: string;
  year: number;
  doi?: string;
  url?: string;
}

interface CitationInfoProps {
  citation?: Citation | null;
  compact?: boolean;
}

export default function CitationInfo({
  citation,
  compact = false,
}: CitationInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citation) {
    return null;
  }

  const formatAuthors = (authors: string[]) => {
    if (authors.length === 1) {
      return authors[0];
    }
    if (authors.length === 2) {
      return `${authors[0]} & ${authors[1]}`;
    }
    return `${authors[0]} et al.`;
  };

  const handleOpenLink = async () => {
    const url = citation.doi
      ? `https://doi.org/${citation.doi}`
      : citation.url;

    if (!url) {
      Alert.alert("リンクなし", "この診断にはリンク情報がありません");
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("エラー", "リンクを開けませんでした");
      }
    } catch {
      Alert.alert("エラー", "リンクを開けませんでした");
    }
  };

  // コンパクト表示（一行）
  if (compact) {
    return (
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center py-2"
      >
        <Ionicons name="book-outline" size={14} color="#64748b" />
        <Text className="text-xs text-muted-foreground ml-1.5">
          {formatAuthors(citation.authors)} ({citation.year})
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={14}
          color="#64748b"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>
    );
  }

  // 通常表示
  return (
    <View className="bg-muted/50 rounded-2xl p-4 mt-4">
      {/* ヘッダー */}
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-full bg-accent/20 items-center justify-center mr-3">
          <Ionicons name="book-outline" size={16} color="#8b5cf6" />
        </View>
        <Text className="text-sm font-semibold text-foreground">
          科学的根拠
        </Text>
      </View>

      {/* 著者と年 */}
      <Text className="text-sm text-foreground mb-1">
        {formatAuthors(citation.authors)} ({citation.year})
      </Text>

      {/* タイトル */}
      <Text className="text-sm text-muted-foreground italic mb-3">
        "{citation.title}"
      </Text>

      {/* リンクボタン */}
      {(citation.doi || citation.url) && (
        <TouchableOpacity
          onPress={handleOpenLink}
          className="flex-row items-center"
        >
          <Ionicons name="open-outline" size={14} color="#2563eb" />
          <Text className="text-sm text-primary ml-1.5">
            {citation.doi ? `DOI: ${citation.doi}` : "詳細を見る"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// 出典情報の折りたたみ可能なセクション
export function CitationSection({
  citation,
  defaultExpanded = false,
}: {
  citation?: Citation | null;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!citation) {
    return null;
  }

  return (
    <View className="mt-4">
      {/* トグルヘッダー */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between py-2"
      >
        <View className="flex-row items-center">
          <Ionicons name="flask-outline" size={18} color="#64748b" />
          <Text className="text-sm font-medium text-muted-foreground ml-2">
            科学的根拠について
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#64748b"
        />
      </TouchableOpacity>

      {/* 展開時のコンテンツ */}
      {isExpanded && <CitationInfo citation={citation} />}
    </View>
  );
}
