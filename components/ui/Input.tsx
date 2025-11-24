import { Text, TextInput, TextInputProps, View } from 'react-native';

export const Input = ({ 
  label,
  error,
  className = '',
  ...props 
}: TextInputProps & { label?: string; error?: string }) => {
  return (
    <View className="w-full mb-4">
      {label && <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</Text>}
      <TextInput 
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 ${error ? 'border-red-500' : ''} ${className}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
};
