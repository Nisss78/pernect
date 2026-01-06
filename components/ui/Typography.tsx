import { Text, TextProps } from 'react-native';

export const Typography = ({ 
  variant = 'body', 
  className = '', 
  children, 
  ...props 
}: TextProps & { variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'link' }) => {

  const styles = {
    h1: "text-3xl font-bold text-slate-900 dark:text-white",
    h2: "text-2xl font-bold text-slate-900 dark:text-white",
    h3: "text-xl font-semibold text-slate-900 dark:text-white",
    body: "text-base text-slate-700 dark:text-slate-300",
    caption: "text-sm text-slate-500 dark:text-slate-400",
    link: "text-base text-blue-600 dark:text-blue-400 underline",
  };

  return (
    <Text className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </Text>
  );
};
