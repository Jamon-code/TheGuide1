import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

interface PlanTitleProps {
  title: string;
}

export default function PlanTitle({ title }: PlanTitleProps) {
  return (
    <View style={styles.planTitleContainer}>
      <LinearGradient
        colors={['#0d3f4a', '#1a5f6e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.planTitleGradient}
      >
        <Ionicons name="map-outline" size={28} color="#fff" />
        <ThemedText style={styles.planMainTitle}>{title}</ThemedText>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  planTitleContainer: {
    marginBottom: 24,
  },
  planTitleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  planMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
});