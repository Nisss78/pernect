import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatScreenProps {
  onBack: () => void;
}

export function AIChatScreen({ onBack }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！私はあなたの自己発見をサポートするパーソナルAIです。何でも気軽に聞いてください。',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'ご質問ありがとうございます。自己分析についてもっと深く考えてみましょう。あなたはどんな時に最も自分らしさを感じますか？',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full bg-secondary mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3 flex-1">
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ borderRadius: 20 }}
          >
            <Ionicons name="chatbubbles" size={20} color="white" />
          </LinearGradient>
          <View>
            <Text className="text-lg font-bold text-foreground">AIチャット</Text>
            <Text className="text-xs text-muted-foreground">パーソナルAIアシスタント</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-3 ${message.isUser ? 'items-end' : 'items-start'}`}
            >
              {!message.isUser && (
                <View className="flex-row items-center gap-2 mb-1">
                  <LinearGradient
                    colors={['#8b5cf6', '#ec4899']}
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ borderRadius: 12 }}
                  >
                    <Ionicons name="sparkles" size={12} color="white" />
                  </LinearGradient>
                  <Text className="text-xs text-muted-foreground">pernect AI</Text>
                </View>
              )}
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-primary rounded-tr-sm'
                    : 'bg-secondary rounded-tl-sm'
                }`}
              >
                <Text
                  className={`text-base ${
                    message.isUser ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 py-3 border-t border-border bg-background">
          <View className="flex-row items-end gap-2">
            <View className="flex-1 bg-secondary rounded-2xl px-4 py-2 min-h-[44px] max-h-[120px]">
              <TextInput
                className="text-base text-foreground"
                placeholder="メッセージを入力..."
                placeholderTextColor="#94a3b8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim()}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                inputText.trim() ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? 'white' : '#94a3b8'}
              />
            </TouchableOpacity>
          </View>
          {/* Safe area spacer */}
          <View className="h-6" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
