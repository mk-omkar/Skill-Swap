import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create-post"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-box-multiple"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="book-session"
        options={{
          title: 'Book',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-check"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen
        name="users"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="chat-room"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="star-circle"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />
    </Tabs>
  );
}