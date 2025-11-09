import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { orcamentosAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const loadOrcamentos = async () => {
    try {
      setLoading(true);
      const response = await orcamentosAPI.getAll();
      setOrcamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrcamentos();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.purple[500]} />
      </View>
    );
  }

  return (
    <LinearGradient colors={colors.background.gradient} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.purple[400]} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Orçamentos</Text>
            <Text style={styles.headerSubtitle}>Gestão de orçamentos e cotações</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{orcamentos.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pendentes</Text>
            <Text style={styles.statValue}>
              {orcamentos.filter((o) => o.status === 'pendente').length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Aprovados</Text>
            <Text style={styles.statValue}>
              {orcamentos.filter((o) => o.status === 'aprovado').length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cotações</Text>
            <Text style={styles.statValue}>
              {orcamentos.reduce((acc, o) => acc + (o.cotacoes?.length || 0), 0)}
            </Text>
          </View>
        </View>

        <FlatList
          data={orcamentos}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const statusConfig = item.status === 'aprovado'
              ? { label: 'Aprovado', color: colors.green[500], icon: 'checkmark-circle-outline' }
              : { label: 'Pendente', color: colors.yellow[500], icon: 'time-outline' };
            
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{item.codigo}</Text>
                    <Text style={styles.cardSubtitle}>{item.fornecedor}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                    <Ionicons name={statusConfig.icon as any} size={16} color={statusConfig.color} />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Valor Total:</Text>
                    <Text style={styles.cardValue}>{formatCurrency(item.valorTotal)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Cotações:</Text>
                    <Text style={styles.cardValue}>{item.cotacoes?.length || 0}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.cardText}>{formatDate(item.data)}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.tertiary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  cardBody: {
    gap: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  cardValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  cardText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
});

