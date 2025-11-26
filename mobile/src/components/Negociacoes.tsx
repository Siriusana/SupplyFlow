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
import { negociacoesAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export function Negociacoes() {
  const [negociacoes, setNegociacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNegociacoes();
  }, []);

  const loadNegociacoes = async () => {
    try {
      setLoading(true);
      const response = await negociacoesAPI.getAll();
      setNegociacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar negociações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNegociacoes();
  };

  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const calcularEconomia = (valorInicial: number, valorNegociado: number) => {
    if (!valorInicial || !valorNegociado || isNaN(valorInicial) || isNaN(valorNegociado)) {
      return { economia: 0, percentual: '0' };
    }
    const economia = valorInicial - valorNegociado;
    const percentual = valorInicial > 0 ? ((economia / valorInicial) * 100).toFixed(0) : '0';
    return { economia, percentual };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.purple[500]} />
      </View>
    );
  }

  const economiaTotal = negociacoes.reduce((acc, neg) => {
    const valorInicial = neg.valorInicial || 0;
    const valorNegociado = neg.valorNegociado || 0;
    if (isNaN(valorInicial) || isNaN(valorNegociado)) return acc;
    return acc + (valorInicial - valorNegociado);
  }, 0);

  return (
    <LinearGradient colors={colors.background.gradient} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.purple[400]} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Negociações</Text>
            <Text style={styles.headerSubtitle}>Registro detalhado e histórico de negociações</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{negociacoes.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Em Andamento</Text>
            <Text style={styles.statValue}>
              {negociacoes.filter((n) => n.status === 'em_andamento').length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Concluídas</Text>
            <Text style={styles.statValue}>
              {negociacoes.filter((n) => n.status === 'concluida').length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Economia Total</Text>
            <Text style={styles.statValue}>{formatCurrency(economiaTotal)}</Text>
          </View>
        </View>

        <FlatList
          data={negociacoes}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const { economia, percentual } = calcularEconomia(item.valorInicial, item.valorNegociado);
            const statusConfig = item.status === 'concluida'
              ? { label: 'Concluída', color: colors.green[500], icon: 'checkmark-circle-outline' }
              : { label: 'Em Andamento', color: colors.blue[500], icon: 'time-outline' };
            
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
                    <Text style={styles.cardLabel}>Valor Inicial:</Text>
                    <Text style={styles.cardValue}>{formatCurrency(item.valorInicial)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Valor Negociado:</Text>
                    <Text style={styles.cardValue}>{formatCurrency(item.valorNegociado)}</Text>
                  </View>
                  <View style={styles.economiaRow}>
                    <Ionicons name="trending-down" size={20} color={colors.green[400]} />
                    <Text style={styles.economiaText}>
                      Economia: {formatCurrency(economia)} ({percentual}%)
                    </Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.cardText}>
                      {formatDate(item.dataInicio || item.dataFim || item.data || '')}
                    </Text>
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
  economiaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
    padding: spacing.sm,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: borderRadius.md,
  },
  economiaText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.green[400],
  },
  cardText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
});

