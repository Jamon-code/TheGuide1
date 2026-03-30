import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Plan } from '@/store/plansSlice';

const { width: screenWidth } = Dimensions.get('window');

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

export default function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef<View>(null);

  const showMenu = () => {
    if (menuButtonRef.current) {
      menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY + height + 5,
          right: screenWidth - (pageX + width),
        });
      });
    }
    setMenuVisible(true);
  };

  const formatDate = (date: string, time: string) => {
    return `${date} à ${time}`;
  };

  // Utiliser les données du planData pour l'affichage
  const planData = plan.planData;
  const firstItem = planData.items[0];

  return (
    <View style={styles.planCard}>
      <View style={styles.cardContent}>
        {/* Image */}
        <Image source={{ uri: firstItem?.image }} style={styles.planImage} />
        
        {/* Informations */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <View style={styles.titleContainer}>
              <ThemedText style={styles.planName}>{planData.title}</ThemedText>
            </View>
            <TouchableWithoutFeedback onPress={showMenu}>
              <View ref={menuButtonRef} style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#0d3f4a" />
              <ThemedText style={styles.detailText}>
                {firstItem ? formatDate(firstItem.date, firstItem.time) : "Date non définie"}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#0d3f4a" />
              <ThemedText style={styles.detailText}>
                {planData.location}
              </ThemedText>
              <ThemedText style={styles.countryFlag}>{planData.countryFlag}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View 
            style={[
              styles.menuContent,
              {
                position: 'absolute',
                top: menuPosition.top,
                right: menuPosition.right,
              }
            ]}
          >
            <TouchableWithoutFeedback onPress={() => {
              setMenuVisible(false);
              onEdit(plan);
            }}>
              <View style={styles.menuItem}>
                <Ionicons name="create-outline" size={18} color="#333" />
                <ThemedText style={styles.menuText}>Modifier</ThemedText>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
              setMenuVisible(false);
              onDelete(plan);
            }}>
              <View style={[styles.menuItem, styles.menuItemBorder]}>
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
                <ThemedText style={[styles.menuText, styles.menuTextDanger]}>Supprimer</ThemedText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  planImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  menuButton: {
    padding: 4,
  },
  detailsContainer: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  countryFlag: {
    fontSize: 14,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  menuTextDanger: {
    color: '#dc2626',
  },
});