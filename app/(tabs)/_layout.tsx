import { View, StyleSheet } from 'react-native';
import { NativeTabs } from 'expo-router/build/native-tabs';
import { Icon, Label } from 'expo-router/build/native-tabs/common/elements';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <NativeTabs
        tintColor="#8b5cf6"
        backgroundColor={null}
        labelStyle={{
          fontSize: 11,
          fontWeight: '500',
        }}
        blurEffect="systemMaterial"
      >
        <NativeTabs.Trigger name="index">
          <Label>ホーム</Label>
          <Icon sf={{ default: 'house', selected: 'house.fill' }} selectedColor="#8b5cf6" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="friends">
          <Label>フレンズ</Label>
          <Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} selectedColor="#8b5cf6" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <Label>プロフィール</Label>
          <Icon sf={{ default: 'person', selected: 'person.fill' }} selectedColor="#8b5cf6" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
