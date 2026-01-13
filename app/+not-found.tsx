import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Typography } from '../components/ui/Typography';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-black">
        <Typography variant="h1" className="mb-4">
          This screen doesn&apos;t exist.
        </Typography>
        <Link href="/" className="mt-4 py-4">
          <Typography variant="link">Go to home screen!</Typography>
        </Link>
      </View>
    </>
  );
}
