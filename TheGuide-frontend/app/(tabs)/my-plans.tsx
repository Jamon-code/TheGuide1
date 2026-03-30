import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import PlanCard from '@/components/PlanCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentPlanId } from '@/store/planSlice';
import { deletePlan, Plan } from '@/store/plansSlice';

export default function MyPlansScreen() {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((state) => state.plans.plans);

  const handleAddPlan = () => {
    console.log("Ajouter un plan");
    Alert.alert("Ajouter", "Navigation vers le formulaire d'ajout de plan");
  };

  const handleEdit = (plan: Plan) => {
    // Définir l'ID du plan actuel dans le store
    dispatch(setCurrentPlanId(plan.id));
    // Naviguer vers l'index pour afficher le plan
    router.push('/');
  };

  const handleDelete = (plan: Plan) => {
    Alert.alert(
      "Supprimer",
      `Voulez-vous vraiment supprimer le plan: ${plan.planData.title} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            dispatch(deletePlan(plan.id));
          }
        }
      ]
    );
  };

  const handleCardPress = (plan: Plan) => {
    // Définir l'ID du plan actuel dans le store
    dispatch(setCurrentPlanId(plan.id));
    // Naviguer vers l'index pour afficher le plan
    router.push('/');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {plans.map((plan) => (
          <TouchableWithoutFeedback key={plan.id} onPress={() => handleCardPress(plan)}>
            <View>
              <PlanCard
                plan={plan}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </View>
          </TouchableWithoutFeedback>
        ))}
        
        {plans.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Aucun plan pour le moment
            </ThemedText>
            <ThemedText style={styles.emptySubText}>
              Cliquez sur le bouton + pour créer votre premier plan
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 25,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});