import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface ActivityCardProps {
  item: {
    id?: string;
    date: string;
    time: string;
    name: string;
    image: string;
    characteristics: Record<string, string | number>;
  };
  onBook?: () => void;
  onReview?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showMenu?: boolean;
}

export default function ActivityCard({ item, onBook, onReview, onEdit, onDelete, showMenu = false }: ActivityCardProps) {
  const hasDateTime = item.date && item.date.trim() !== '' && item.time && item.time.trim() !== '';
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  const handleShowMenu = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY + height - 55,
          right: pageX + width,
        });
      });
    }
    setMenuVisible(true);
  };

  return (
    <View style={styles.activityCard}>
      {/* Header avec nom et menu */}
      <View style={styles.cardHeader}>
        <ThemedText style={styles.activityName}>{item.name}</ThemedText>
        {showMenu && (
          <TouchableWithoutFeedback onPress={handleShowMenu}>
            <View ref={buttonRef} style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      {/* Date et heure - affiché seulement si les valeurs existent */}
      {hasDateTime && (
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={16} color="#0d3f4a" />
            <ThemedText style={styles.dateText}>{item.date}</ThemedText>
          </View>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={16} color="#0d3f4a" />
            <ThemedText style={styles.timeText}>{item.time}</ThemedText>
          </View>
        </View>
      )}

      {/* Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.activityImage}
        contentFit="cover"
      />

      {/* Caractéristiques */}
      <View style={styles.characteristicsContainer}>
        {Object.entries(item.characteristics).map(([key, value], idx) => (
          <View key={idx} style={styles.characteristicItem}>
            <View style={styles.characteristicHeader}>
              <Ionicons name="pricetag-outline" size={14} color="#666" />
              <ThemedText style={styles.characteristicKey}>{key}</ThemedText>
            </View>
            <ThemedText style={styles.characteristicValue}>{String(value)}</ThemedText>
          </View>
        ))}
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback onPress={onBook}>
          <View style={styles.bookButton}>
            <Ionicons name="bookmark-outline" size={18} color="#fff" />
            <ThemedText style={styles.buttonText}>Réserver</ThemedText>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onReview}>
          <View style={styles.reviewButton}>
            <Ionicons name="star-outline" size={18} color="#0d3f4a" />
            <ThemedText style={styles.reviewButtonText}>Donner avis</ThemedText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Menu Modal - s'affiche juste en bas des 3 points */}
      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View 
              style={[
                styles.menuContainer,
                {
                  position: 'absolute',
                  top: menuPosition.top,
                  right: 16,
                }
              ]}
            >
              <View style={styles.menuContent}>
                <TouchableWithoutFeedback onPress={() => {
                  setMenuVisible(false);
                  onEdit?.();
                }}>
                  <View style={styles.menuItem}>
                    <Ionicons name="create-outline" size={18} color="#333" />
                    <ThemedText style={styles.menuText}>Modifier</ThemedText>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {
                  setMenuVisible(false);
                  onDelete?.();
                }}>
                  <View style={[styles.menuItem, styles.menuItemBorder]}>
                    <Ionicons name="trash-outline" size={18} color="#dc2626" />
                    <ThemedText style={[styles.menuText, styles.menuTextDanger]}>Supprimer</ThemedText>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 13,
    color: '#0d3f4a',
    fontWeight: '500',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  activityImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  characteristicItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 10,
  },
  characteristicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  characteristicKey: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  characteristicValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0d3f4a',
    paddingVertical: 12,
    borderRadius: 12,
  },
  reviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0d3f4a',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d3f4a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    zIndex: 1000,
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