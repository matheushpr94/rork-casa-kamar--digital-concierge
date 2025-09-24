import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BookingProvider } from "@/contexts/booking-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Voltar" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="admin/menu" options={{ title: "Cardápio Admin" }} />
      <Stack.Screen name="admin/orders" options={{ title: "Pedidos Admin" }} />
      <Stack.Screen name="admin/settings" options={{ title: "Configurações Admin" }} />
      <Stack.Screen name="service/[id]" options={{ title: "Serviço" }} />
      <Stack.Screen name="meals-summary" options={{ title: "Resumo das Refeições" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <GestureHandlerRootView style={styles.gestureHandler}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </BookingProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});