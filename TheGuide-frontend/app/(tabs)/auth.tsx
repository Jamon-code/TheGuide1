import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  AccessToken,
  LoginManager,
  Profile,
  Settings
} from 'react-native-fbsdk-next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { login } from '@/store/userSlice';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();
      Settings.initializeSDK();
      if (status === 'granted') {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    };
    requestTracking();
  }, []);

  const getUserFBData = () => {
    Profile.getCurrentProfile().then((currentProfile) => {
      if (currentProfile) {
        console.log('Profil Facebook:', currentProfile);

        dispatch(login({
          name: currentProfile.name,
          email: null,
          image: currentProfile.imageURL,
          facebookId: currentProfile.userID,
        }));

        router.back();
      }
    });
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email'
      ]);

      if (result.isCancelled) {
        console.log('Connexion annulée');
        Alert.alert('Annulé', 'Connexion Facebook annulée');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        console.log('AccessToken:', data);
        getUserFBData();
      }
    } catch (error) {
      console.error('Erreur Facebook login:', error);
      Alert.alert('Erreur', 'Impossible de se connecter avec Facebook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#0d3f4a', '#1a5f6e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Ionicons name="person-circle-outline" size={60} color="#fff" />
          </LinearGradient>
        </View>

        <ThemedText style={styles.title}>Bienvenue</ThemedText>
        <ThemedText style={styles.subtitle}>
          Connectez-vous pour une expérience sans limites
        </ThemedText>

        <TouchableOpacity
          onPress={handleFacebookLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <View style={styles.facebookButton}>
            <LinearGradient
              colors={loading ? ['#9b9b9b', '#7a7a7a'] : ['#1877f2', '#0c63d4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="logo-facebook" size={24} color="#fff" />
                <ThemedText style={styles.buttonText}>
                  {loading ? "Connexion en cours..." : "Se connecter avec Facebook"}
                </ThemedText>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            En continuant, vous acceptez nos
          </ThemedText>
          <TouchableOpacity onPress={() => Alert.alert("Conditions", "Conditions d'utilisation")}>
            <ThemedText style={styles.footerLink}> Conditions d'utilisation</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.footerText}> et notre </ThemedText>
          <TouchableOpacity onPress={() => Alert.alert("Politique", "Politique de confidentialité")}>
            <ThemedText style={styles.footerLink}>Politique de confidentialité</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.footerText}>.</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: 30,
  },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  facebookButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  buttonGradient: { paddingVertical: 14 },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: { fontSize: 12, color: '#999' },
  footerLink: { fontSize: 12, color: '#0d3f4a', fontWeight: '600' },
});