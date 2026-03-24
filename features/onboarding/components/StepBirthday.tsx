import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Text, View } from 'react-native';

interface StepBirthdayProps {
  birthday: Date;
  onBirthdayChange: (date: Date) => void;
}

export function StepBirthday({ birthday, onBirthdayChange }: StepBirthdayProps) {
  return (
    <View className="flex-1 px-6 justify-center">
      <View className="items-center mb-8">
        <Text className="text-5xl mb-4">🎂</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          お誕生日は？
        </Text>
        <Text className="text-base text-muted-foreground text-center mt-2">
          あなたに合った分析をお届けします
        </Text>
      </View>

      <View className="items-center">
        <DateTimePicker
          value={birthday}
          mode="date"
          display="inline"
          onChange={(_, date) => {
            if (date) onBirthdayChange(date);
          }}
          maximumDate={new Date()}
          minimumDate={new Date(1920, 0, 1)}
          locale="ja"
          style={{ height: 320, width: 320 }}
          accentColor="#8b5cf6"
          textColor="#000000"
        />
      </View>
    </View>
  );
}
