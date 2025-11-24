import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export const Button = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  loading = false,
  className = '',
  ...props 
}: TouchableOpacityProps & { title: string; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; loading?: boolean }) => {
  
  const baseStyle = "py-3 px-6 rounded-full items-center justify-center flex-row";
  const variants = {
    primary: "bg-blue-600 active:bg-blue-700",
    secondary: "bg-slate-800 active:bg-slate-900",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700",
    ghost: "bg-transparent",
  };
  
  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-slate-900 dark:text-white font-medium",
    ghost: "text-slate-600 dark:text-slate-400",
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} className="mr-2" />
      ) : null}
      <Text className={`${textVariants[variant]} text-base`}>{title}</Text>
    </TouchableOpacity>
  );
};
