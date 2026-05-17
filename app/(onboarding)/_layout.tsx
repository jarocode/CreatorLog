import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="platforms" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="reminders" />
    </Stack>
  );
}
