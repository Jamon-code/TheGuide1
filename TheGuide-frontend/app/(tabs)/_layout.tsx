import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch } from '@/store/hooks';
import { triggerReset } from '@/store/planSlice';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleAddService = () => {
    router.push('/add-service');
  };

  const handleAddPlan = () => {
    dispatch(triggerReset());
    router.push('/');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0d3f4a",
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mon plan',
          tabBarIcon: ({ color }) => <MaterialIcons color={color} size={28} name="map" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorer',
          headerShown: true,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="my-plans" 
        options={{ 
          href: null, 
          title: 'Mes plans', 
          headerShown: true,
          headerRight: () => (
            <TouchableWithoutFeedback onPress={handleAddPlan}>
              <View style={{ marginRight: 16 }}>
                <Ionicons name="add" size={24} color="#0d3f4a" />
              </View>
            </TouchableWithoutFeedback>
          ),
        }} 
      />
      <Tabs.Screen 
        name="my-activities" 
        options={{ 
          href: null, 
          title: 'Mes services', 
          headerShown: true,
          headerRight: () => (
            <TouchableWithoutFeedback onPress={handleAddService}>
              <View style={{ marginRight: 16 }}>
                <Ionicons name="add" size={24} color="#0d3f4a" />
              </View>
            </TouchableWithoutFeedback>
          ),
        }} 
      />
      <Tabs.Screen 
        name="auth" 
        options={{ 
          href: null, 
          title: "S'authentifier", 
          headerShown: true 
        }} 
      />
      <Tabs.Screen 
        name="add-service" 
        options={{ 
          href: null, 
          title: "Ajouter un service", 
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="edit-service" 
        options={{ 
          href: null, 
          title: "Modifier un service", 
          headerShown: true,
        }} 
      />
    </Tabs>
  );
}