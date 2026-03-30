import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import ActivityCard from '@/components/ActivityCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RootState } from '@/store/store';

import { deleteService } from '@/store/servicesSlice';
import { useDispatch } from 'react-redux';

const serviceTypes = [
  { label: "Tout", value: "tout" },
  { label: "Restauration", value: "restauration" },
  { label: "Transport", value: "transport" },
  { label: "Boutique", value: "boutique" },
  { label: "Activité", value: "activité" },
  { label: "Hébergement", value: "hebergement" },
  { label: "Guide", value: "guide" }
];

export default function MyServicesScreen() {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState("tout");

  const services = useSelector((state: RootState) => state.services.services);
  const user = useSelector((state: RootState) => state.user);

  // 👇 FILTRE PAR USER
  const myServices = services.filter(
    (service) => service.facebookId === user.facebookId
  );

  const filteredServices = selectedType === "tout"
    ? myServices
    : myServices.filter(service => service.typeName === selectedType);

  const handleEdit = (service: any) => {
    router.push(`/edit-service?id=${service.id}`);
  };

  const handleDelete = (service: any) => {
    Alert.alert(
      "Supprimer",
      `Voulez-vous vraiment supprimer le service: ${service.name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            dispatch(deleteService(service.id));
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.filterContainer}>
        <ThemedText style={styles.filterLabel}>Type de service :</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
            style={styles.picker}
            dropdownIconColor="#0d3f4a"
          >
            {serviceTypes.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView
        style={styles.servicesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContent}
      >
        {filteredServices.map((service) => (
          <ActivityCard
            key={service.id}
            item={{
              id: service.id,
              date: "",
              time: "",
              name: service.name,
              image: service.image,
              characteristics: service.characteristics
            }}
            onBook={() => alert(`Réservation pour ${service.name}`)}
            onReview={() => alert(`Avis pour ${service.name}`)}
            onEdit={() => handleEdit(service)}
            onDelete={() => handleDelete(service)}
            showMenu={true}
          />
        ))}

        {filteredServices.length === 0 && (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Aucun service trouvé
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 25,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d3f4a',
  },
  pickerContainer: {
    flex: 0.8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden'
  },
  picker: {
    height: 47,
    width: '100%'
  },
  servicesList: {
    flex: 1,
  },
  servicesContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});