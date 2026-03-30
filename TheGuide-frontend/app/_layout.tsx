import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState, store } from '@/store/store';
import { logout } from '@/store/userSlice';

export const unstable_settings = {
  anchor: '(tabs)',
};

function CustomDrawer(props: any) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>

      <View style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.appName}>THE GUIDE</Text>
      </View>

      <View style={styles.separator} />

      <View>
        <DrawerItem
          label="Mes plans"
          onPress={() => router.push('/(tabs)/my-plans')}
          focused={pathname === '/my-plans'}
          icon={({ color }) => <Text style={{ color, fontSize: 18 }}>📋</Text>}
        />
        <DrawerItem
          label="Mes services"
          onPress={() => router.push('/(tabs)/my-activities')}
          focused={pathname === '/my-activities'}
          icon={({ color }) => <Text style={{ color, fontSize: 18 }}>🛎️</Text>}
        />
      </View>

      {/* BAS */}
      <View style={styles.bottomItem}>

        {/* 👤 USER JUSTE AU-DESSUS DU DIVIDER */}
        {user.isAuthenticated && (
          <View style={styles.userContainer}>
            <Image source={{ uri: user.image! }} style={styles.userImage} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        )}

        {/* 👇 DIVIDER ENTRE USER ET ACTION */}
        <View style={styles.bottomSeparator} />

        {user.isAuthenticated ? (
          <DrawerItem
            label="Se déconnecter"
            onPress={() => dispatch(logout())}
            icon={({ color }) => <Text style={{ color, fontSize: 18 }}>🚪</Text>}
          />
        ) : (
          <DrawerItem
            label="S'authentifier"
            onPress={() => router.push('/(tabs)/auth')}
            focused={pathname === '/auth'}
            icon={({ color }) => <Text style={{ color, fontSize: 18 }}>🔐</Text>}
          />
        )}
      </View>

    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer drawerContent={(props) => <CustomDrawer {...props} />}>
            <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
            <Drawer.Screen name="(tabs)/profile" />
            <Drawer.Screen name="(tabs)/page2" />
            <Drawer.Screen name="(tabs)/page3" />
          </Drawer>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  logo: { width: 42, height: 42 },
  appName: { fontSize: 20, fontWeight: 'bold' },

  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    marginBottom: 8,
  },

  bottomItem: {
    marginTop: 'auto',
  },

  bottomSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    marginVertical: 10,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },

  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
});