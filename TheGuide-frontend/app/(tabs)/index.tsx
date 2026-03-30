import ActivityCard from '@/components/ActivityCard';
import PlanTitle from '@/components/PlanTitle';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { consumeReset, setCurrentPlanId } from '@/store/planSlice';
import { addPlan, PlanData, updatePlan } from '@/store/plansSlice';

// Configuration de l'API
const API_URL = 'http://192.168.43.70:3000/api';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const resetTrigger = useAppSelector((state) => state.plan.resetTrigger);
  const currentPlanId = useAppSelector((state) => state.plan.currentPlanId);
  const plans = useAppSelector((state) => state.plans.plans);
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['25%', '49%', '49%'];

  // Récupérer le plan actuel depuis le store
  const currentPlan = currentPlanId ? plans.find(p => p.id === currentPlanId) : null;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      bottomSheetRef.current?.snapToIndex(2);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      bottomSheetRef.current?.snapToIndex(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Réinitialiser le plan quand resetTrigger est true
  useEffect(() => {
    if (resetTrigger) {
      dispatch(setCurrentPlanId(null));
      setPrompt('');
      dispatch(consumeReset());
    }
  }, [resetTrigger, dispatch]);

  const handleGeneratePlan = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setModifying(false);
    try {
      const response = await fetch(`${API_URL}/plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération du plan');
      }

      if (data.success && data.plan) {
        const generatedPlanData: PlanData = {
          title: data.plan.title,
          location: data.plan.location,
          countryFlag: data.plan.countryFlag,
          items: data.plan.items.map((item: any) => ({
            date: item.date,
            time: item.time,
            name: item.name,
            image: item.image,
            characteristics: item.characteristics || {}
          }))
        };
        
        const newPlanId = data.plan.id || Date.now().toString();
        dispatch(addPlan({
          id: newPlanId,
          planData: generatedPlanData
        }));
        
        dispatch(setCurrentPlanId(newPlanId));
        
        setPrompt('');
        bottomSheetRef.current?.collapse();
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      
    } catch (error: any) {
      console.error('Erreur:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de générer le plan. Vérifiez votre connexion au serveur.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModifyPlan = async () => {
    if (!prompt.trim() || !currentPlan) return;
    
    setLoading(true);
    setModifying(true);
    try {
      const response = await fetch(`${API_URL}/plan/modify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          currentPlan: {
            title: currentPlan.planData.title,
            location: currentPlan.planData.location,
            countryFlag: currentPlan.planData.countryFlag,
            items: currentPlan.planData.items
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification du plan');
      }

      if (data.success && data.plan) {
        const modifiedPlanData: PlanData = {
          title: data.plan.title,
          location: data.plan.location,
          countryFlag: data.plan.countryFlag,
          items: data.plan.items.map((item: any) => ({
            date: item.date,
            time: item.time,
            name: item.name,
            image: item.image,
            characteristics: item.characteristics || {}
          }))
        };
        
        // Mettre à jour le plan existant
        dispatch(updatePlan({
          id: currentPlan.id,
          planData: modifiedPlanData
        }));
        
        setPrompt('');
        bottomSheetRef.current?.collapse();
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      
    } catch (error: any) {
      console.error('Erreur:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de modifier le plan. Vérifiez votre connexion au serveur.'
      );
    } finally {
      setLoading(false);
      setModifying(false);
    }
  };

const handleSendPrompt = () => {
  if (currentPlan) {
    handleModifyPlan();
  } else {
    handleGeneratePlan();
  }
};
  const bulletItems = [
    { icon: "🎯", text: "Votre objectif de voyage (détente, aventure, culture, etc.)" },
    { icon: "📍", text: "Votre destination" },
    { icon: "📅", text: "Votre date de départ et de retour (avec les heures si possible)" },
    { icon: "💰", text: "Votre budget" },
    { icon: "⚠️", text: "Vos contraintes (allergies, lieux à voir absolument, mobilité réduite, etc.)" },
    { icon: "🏠", text: "Votre lieu de départ" },
    { icon: "🎨", text: "Vos centres d'intérêt (gastronomie, histoire, nature, etc.)" },
    { icon: "👥", text: "Le nombre et le type de personnes (ou d'animaux) qui vous accompagnent" }
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Contenu principal */}
      {!currentPlan ? (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo centré */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
          </View>

          {/* Texte de description complet */}
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <View style={styles.titleDecoration}>
                <View style={styles.titleLineLeft} />
                <Ionicons name="sparkles" size={24} color="#0d3f4a" style={styles.titleIcon} />
                <View style={styles.titleLineRight} />
              </View>
              <ThemedText style={styles.title}>
                Décrivez votre voyage
              </ThemedText>
              <ThemedText style={styles.titleSub}>
                pour obtenir le plan le plus adapté possible.
              </ThemedText>
            </View>
            
            <View style={styles.subtitleContainer}>
              <View style={styles.subtitleLine} />
              <ThemedText style={styles.subtitle}>
                N'oubliez pas d'inclure
              </ThemedText>
              <View style={styles.subtitleLine} />
            </View>
            
            <View style={styles.bulletList}>
              {bulletItems.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.iconContainer}>
                    <ThemedText style={styles.bulletIcon}>{item.icon}</ThemedText>
                  </View>
                  <ThemedText style={styles.bulletText}>{item.text}</ThemedText>
                </View>
              ))}
            </View>
            
            <View style={styles.noteContainer}>
              <Ionicons name="bulb-outline" size={20} color="#0d3f4a" style={styles.noteIcon} />
              <ThemedText style={styles.note}>
                Sachez que vous pouvez modifier le plan automatiquement grâce à notre IA : il vous suffit de lui indiquer vos changements directement dans le même champ de texte.
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView 
          style={styles.planContainer}
          contentContainerStyle={styles.planContent}
          showsVerticalScrollIndicator={false}
        >
          <PlanTitle title={currentPlan.planData.title} />

          {/* Liste des activités */}
          {currentPlan.planData.items.map((item: any, index: number) => (
            <ActivityCard
              key={index}
              item={item}
              onBook={() => alert(`Réservation pour ${item.name}`)}
              onReview={() => alert(`Avis pour ${item.name}`)}
            />
          ))}
          
          <TouchableWithoutFeedback onPress={() => bottomSheetRef.current?.expand()}>
            <View style={styles.modifyButton}>
              <Ionicons name="create-outline" size={20} color="#0d3f4a" />
              <ThemedText style={styles.modifyText}>Modifier mon plan</ThemedText>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}

      {/* Bottom Sheet avec ombre gradient */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.topGradient}
          />
          <BottomSheetView style={[styles.bottomSheetContainer, { paddingBottom: keyboardHeight }]}>
            <ScrollView 
              style={styles.instructionsScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.instructionsScrollContent}
            >
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder={currentPlan ? "Je préfère un autre style de restaurant..." : "Je voyage au Japon du 15/10 au 30/10 depuis Rabat. Budget 25000 DH pour 2 adultes. J'aime la culture et la gastronomie. Attention : je suis végétarien et j'ai déjà visité Tokyo"}
                  placeholderTextColor="#999"
                  multiline
                  value={prompt}
                  onChangeText={setPrompt}
                  editable={!loading}
                  textAlignVertical="center"
                />
                <TouchableWithoutFeedback onPress={handleSendPrompt}>
                  <View style={[styles.generateButton, loading && styles.generateButtonDisabled]}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Ionicons name="send" size={24} color="#fff" />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </ScrollView>
          </BottomSheetView>
        </View>
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 25,
    paddingBottom: 18,
  },
  logo: {
    width: 220,
    height: 220,
  },
  textContainer: {
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titleLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  titleLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  titleIcon: {
    marginHorizontal: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  titleSub: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#666',
    letterSpacing: -0.2,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 12,
    letterSpacing: 0.5,
  },
  bulletList: {
    marginBottom: 28,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff5f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bulletIcon: {
    fontSize: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  note: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 19,
  },
  planContainer: {
    flex: 1,
  },
  planContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modifyText: {
    fontSize: 15,
    color: '#0d3f4a',
    fontWeight: '500',
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
    height: 4,
  },
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  instructionsScroll: {
    flex: 1,
  },
  instructionsScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    fontSize: 16,
    textAlignVertical: 'center',
    minHeight: 112
  },
  generateButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0d3f4a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
});