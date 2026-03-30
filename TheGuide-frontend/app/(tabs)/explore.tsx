import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import ActivityCard from '@/components/ActivityCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppSelector } from '@/store/hooks';

const serviceTypes = [
  { label: "Tout", value: "tout" },
  { label: "Restauration", value: "restauration" },
  { label: "Transport", value: "transport" },
  { label: "Boutique", value: "boutique" },
  { label: "Activité", value: "activité" },
  { label: "Hébergement", value: "hebergement" },
  { label: "Guide", value: "guide" }
];

export default function TabTwoScreen() {
  const [selectedType, setSelectedType] = useState("tout");
  const services = useAppSelector((state) => state.services.services);

  const filteredServices = selectedType === "tout" 
    ? services 
    : services.filter(service => service.typeName === selectedType);

  return (
    <ThemedView style={styles.container}>
      {/* Filtre */}
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

      {/* Liste des services */}
      <ScrollView 
        style={styles.servicesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContent}
      >
        {filteredServices.map((service) => (
          <ActivityCard
            key={service.id}
            item={{
              date: "",
              time: "",
              name: service.name,
              image: service.image,
              characteristics: service.characteristics
            }}
            onBook={() => alert(`Réservation pour ${service.name}`)}
            onReview={() => alert(`Avis pour ${service.name}`)}
          />
        ))}
        
        {filteredServices.length === 0 && (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Aucun service trouvé pour cette catégorie
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