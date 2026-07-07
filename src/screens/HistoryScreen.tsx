import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenGradient } from '../components/ScreenGradient';
import { colors } from '../constants/colors';
import { formatDurationWords } from '../constants/durations';
import { RootStackParamList } from '../types';
import { deleteSession, loadSessions, MealSession } from '../utils/sessionStore';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

const FULLNESS_LABELS: Record<string, string> = {
  hungry: 'Felt hungry',
  comfortable: 'Felt comfortable',
  full: 'Felt full',
  overfull: 'Felt overfull',
};

function formatSessionDate(epochMs: number): string {
  const d = new Date(epochMs);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + `, ${time}`;
}

export function HistoryScreen({ navigation }: Props) {
  const [sessions, setSessions] = useState<MealSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSessions().then(setSessions);
    }, [])
  );

  const handleDelete = async (id: string) => {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Meal history</Text>
            <View style={styles.backButton} />
          </View>
          <Text style={styles.localNote}>Stored on this device only.</Text>

          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No meals yet</Text>
              <Text style={styles.emptySubtitle}>
                Your completed meals will appear here.
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {sessions.map((s) => (
                <View key={s.id} style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemDate}>{formatSessionDate(s.startedAt)}</Text>
                    <Text style={styles.itemDetail}>
                      {formatDurationWords(s.elapsedSeconds)}
                      {s.reason === 'early' ? ' (ended early)' : ''}
                    </Text>
                    {s.fullnessLevel && (
                      <Text style={styles.itemFullness}>
                        {FULLNESS_LABELS[s.fullnessLevel]}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(s.id)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete meal from ${formatSessionDate(s.startedAt)}`}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: colors.deepOlive,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.deepOlive,
    textAlign: 'center',
  },
  localNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -12,
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.deepOlive,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.08)',
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.deepOlive,
  },
  itemDetail: {
    fontSize: 13,
    color: colors.textMuted,
  },
  itemFullness: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 1,
  },
  deleteIcon: {
    fontSize: 16,
    color: colors.deepOlive,
    opacity: 0.6,
    paddingLeft: 12,
  },
});
