import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addService } from '@/store/servicesSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';


// Types de services disponibles
const serviceTypes = [
  { label: "Restauration", value: "restauration" },
  { label: "Transport", value: "transport" },
  { label: "Boutique", value: "boutique" },
  { label: "Activité", value: "activité" },
  { label: "Hébergement", value: "hebergement" },
  { label: "Guide", value: "guide" }
];

interface Characteristic {
  id: string;
  title: string;
  description: string;
}

const API_URL = 'http://192.168.43.70:3000/api';

export default function AddServiceScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("restauration");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([
    { id: Date.now().toString(), title: "", description: "" }
  ]);

  const dispatch = useDispatch();
  const services = useSelector((state: RootState) => state.services.services);
  const user = useSelector((state: RootState) => state.user);

  const addCharacteristic = () => {
    setCharacteristics([
      ...characteristics,
      { id: Date.now().toString(), title: "", description: "" }
    ]);
  };

  const removeCharacteristic = (id: string) => {
    if (characteristics.length > 1) {
      setCharacteristics(characteristics.filter(c => c.id !== id));
    } else {
      Alert.alert("Information", "Vous devez avoir au moins une caractéristique");
    }
  };

  const updateCharacteristic = (id: string, field: 'title' | 'description', value: string) => {
    setCharacteristics(characteristics.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

const handleSave = async () => {
  if (!name.trim()) {
    Alert.alert("Erreur", "Veuillez saisir un nom de service");
    return;
  }
  if (!imageUrl.trim()) {
    Alert.alert("Erreur", "Veuillez saisir une URL d'image");
    return;
  }

  const incomplete = characteristics.some(c => !c.title.trim() || !c.description.trim());
  if (incomplete) {
    Alert.alert("Erreur", "Veuillez remplir tous les champs des caractéristiques");
    return;
  }

  const newService = {
    name: name.trim(),
    image: imageUrl.trim(),
    type: serviceTypes.findIndex(t => t.value === selectedType),
    typeName: selectedType,
    characteristics: characteristics.reduce((acc, curr) => {
      acc[curr.title] = curr.description;
      return acc;
    }, {} as Record<string, string>),
    facebookId: user.facebookId || ''
  };

  try {
    const response = await fetch(`${API_URL}/services/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newService),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'ajout');
    }

    if (data.success) {
      // AJOUT AU REDUX (pour mise à jour immédiate)
      dispatch(addService({
        id: Date.now().toString(),
        ...newService
      }));

      // RESET DES CHAMPS
      setName("");
      setImageUrl("");
      setSelectedType("restauration");
      setCharacteristics([
        { id: Date.now().toString(), title: "", description: "" }
      ]);

      router.push('/my-activities');
    }
  } catch (error: any) {
    console.error('Erreur:', error);
    Alert.alert('Erreur', error.message || 'Impossible d\'ajouter le service');
  }
};

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.section}>
          <ThemedText style={styles.label}>Type de service</ThemedText>
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

        <View style={styles.section}>
          <ThemedText style={styles.label}>Nom du service</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sushi Master, Taxi Marrakech..."
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>URL de l'image</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor="#999"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.label}>Caractéristiques</ThemedText>
            <TouchableWithoutFeedback onPress={addCharacteristic}>
              <View style={styles.addButton}>
                <Ionicons name="add" size={20} color="#fff" />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {characteristics.map((char, index) => (
            <View key={char.id} style={styles.characteristicCard}>
              <View style={styles.characteristicHeader}>
                <ThemedText style={styles.characteristicNumber}>
                  Caractéristique {index + 1}
                </ThemedText>
                <TouchableWithoutFeedback onPress={() => removeCharacteristic(char.id)}>
                  <View style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={18} color="#dc2626" />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Titre (ex: Prix à partir, Note, Durée...)"
                placeholderTextColor="#999"
                value={char.title}
                onChangeText={(text) => updateCharacteristic(char.id, 'title', text)}
              />
              
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Description (ex: 200 DH, 4.8/5, 2h...)"
                placeholderTextColor="#999"
                value={char.description}
                onChangeText={(text) => updateCharacteristic(char.id, 'description', text)}
              />
            </View>
          ))}
        </View>

        <TouchableWithoutFeedback onPress={handleSave}>
          <View style={styles.saveButton}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <ThemedText style={styles.saveButtonText}>Enregistrer le service</ThemedText>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.bottomSpacing} />
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  smallInput: {
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  characteristicCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  characteristicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  characteristicNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d3f4a',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0d3f4a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0d3f4a',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#0d3f4a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 20,
  },
});