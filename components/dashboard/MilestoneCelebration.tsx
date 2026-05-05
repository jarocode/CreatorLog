import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface MilestoneCelebrationProps {
  visible: boolean;
  streakCount: number;
  message: string;
  onDismiss: () => void;
}

const CONFETTI = [
  { lf: 0.06, tp: 0.06, color: '#7C3AED', w: 10, h: 10, r: 5 },
  { lf: 0.18, tp: 0.04, color: '#F59E0B', w: 6, h: 14, r: 2 },
  { lf: 0.32, tp: 0.07, color: '#FE2C55', w: 9, h: 9, r: 4.5 },
  { lf: 0.50, tp: 0.03, color: '#10B981', w: 8, h: 5, r: 2 },
  { lf: 0.65, tp: 0.08, color: '#A78BFA', w: 8, h: 8, r: 4 },
  { lf: 0.80, tp: 0.05, color: '#3B82F6', w: 11, h: 6, r: 2 },
  { lf: 0.92, tp: 0.10, color: '#F59E0B', w: 7, h: 7, r: 3.5 },
  { lf: 0.02, tp: 0.22, color: '#10B981', w: 9, h: 5, r: 2 },
  { lf: 0.95, tp: 0.28, color: '#FE2C55', w: 7, h: 7, r: 3.5 },
  { lf: 0.04, tp: 0.42, color: '#A78BFA', w: 10, h: 6, r: 2 },
  { lf: 0.96, tp: 0.50, color: '#7C3AED', w: 8, h: 8, r: 4 },
  { lf: 0.01, tp: 0.62, color: '#F59E0B', w: 6, h: 12, r: 2 },
  { lf: 0.93, tp: 0.68, color: '#10B981', w: 9, h: 9, r: 4.5 },
  { lf: 0.08, tp: 0.76, color: '#3B82F6', w: 7, h: 7, r: 3.5 },
  { lf: 0.90, tp: 0.80, color: '#A78BFA', w: 10, h: 5, r: 2 },
  { lf: 0.15, tp: 0.88, color: '#FE2C55', w: 8, h: 8, r: 4 },
  { lf: 0.35, tp: 0.92, color: '#7C3AED', w: 6, h: 13, r: 2 },
  { lf: 0.55, tp: 0.90, color: '#F59E0B', w: 9, h: 9, r: 4.5 },
  { lf: 0.72, tp: 0.94, color: '#10B981', w: 7, h: 5, r: 2 },
  { lf: 0.88, tp: 0.91, color: '#3B82F6', w: 8, h: 8, r: 4 },
  { lf: 0.25, tp: 0.18, color: '#FE2C55', w: 5, h: 5, r: 2.5 },
  { lf: 0.76, tp: 0.20, color: '#A78BFA', w: 6, h: 6, r: 3 },
  { lf: 0.44, tp: 0.14, color: '#7C3AED', w: 7, h: 4, r: 2 },
  { lf: 0.60, tp: 0.86, color: '#FE2C55', w: 5, h: 10, r: 2 },
] as const;

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  visible,
  streakCount,
  message,
  onDismiss,
}) => {
  const { width, height } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        {CONFETTI.map((dot, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: dot.lf * width,
              top: dot.tp * height,
              width: dot.w,
              height: dot.h,
              borderRadius: dot.r,
              backgroundColor: dot.color,
            }}
          />
        ))}

        <View style={styles.content}>
          <Ionicons name="flame" size={64} color={AppColors.streakActive} />
          <Text style={styles.number}>{streakCount}</Text>
          <Text style={styles.label}>DAY STREAK</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onDismiss} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Keep going  →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0A0A12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  number: {
    fontSize: 80,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 88,
    marginTop: 4,
  },
  label: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginTop: 2,
  },
  message: {
    fontSize: typography.sm,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: AppColors.primary,
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.base,
    fontWeight: '600',
  },
});
