import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { relatoriosAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;

export function Relatorios() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gastosMensais, setGastosMensais] = useState<any>(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<any>(null);
  const [indicadores, setIndicadores] = useState<any>({});
  const [topFornecedores, setTopFornecedores] = useState<any[]>([]);

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = async () => {
    try {
      setLoading(true);
      const response = await relatoriosAPI.getAll();
      const data = response.data;

      if (data.gastosMensais && data.gastosMensais.length > 0) {
        setGastosMensais({
          labels: data.gastosMensais.map((g: any) => g.name),
          datasets: [
            {
              data: data.gastosMensais.map((g: any) => g.valor),
            },
          ],
        });
      }

      if (data.gastosPorCategoria && data.gastosPorCategoria.length > 0) {
        setGastosPorCategoria({
          labels: data.gastosPorCategoria.map((g: any) => g.name),
          datasets: [
            {
              data: data.gastosPorCategoria.map((g: any) => g.valor),
            },
          ],
        });
      }

      if (data.indicadores) {
        setIndicadores(data.indicadores);
      }

      if (data.topFornecedores) {
        setTopFornecedores(data.topFornecedores);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRelatorios();
  };

  const chartConfig = {
    backgroundColor: colors.card.background,
    backgroundGradientFrom: colors.card.background,
    backgroundGradientTo: colors.card.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.6})`,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForBackgroundLines: {
      strokeDasharray: '3,3',
      stroke: 'rgba(255, 255, 255, 0.2)',
    },
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
            <Text style={styles.headerTitle}>Relatórios</Text>
            <Text style={styles.headerSubtitle}>Análise e indicadores de desempenho</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color={colors.green[400]} />
            <Text style={styles.statLabel}>Economia Total</Text>
            <Text style={styles.statValue}>{indicadores.economiaTotalValor || 'R$ 0'}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color={colors.blue[400]} />
            <Text style={styles.statLabel}>Gastos do Mês</Text>
            <Text style={styles.statValue}>{indicadores.gastosDoMesValor || 'R$ 0'}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={24} color={colors.purple[400]} />
            <Text style={styles.statLabel}>Total Pedidos</Text>
            <Text style={styles.statValue}>{indicadores.totalPedidos || 0}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color={colors.yellow[400]} />
            <Text style={styles.statLabel}>Fornecedores Ativos</Text>
            <Text style={styles.statValue}>{indicadores.fornecedoresAtivos || 0}</Text>
          </View>
        </View>

        {gastosMensais && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos Mensais</Text>
            <LineChart
              data={gastosMensais}
              width={screenWidth - spacing.xl * 2}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {gastosPorCategoria && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos por Categoria</Text>
            <BarChart
              data={gastosPorCategoria}
              width={screenWidth - spacing.xl * 2}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel="R$ "
            />
          </View>
        )}

        {topFornecedores.length > 0 && (
          <View style={styles.listCard}>
            <Text style={styles.chartTitle}>Top Fornecedores</Text>
            {topFornecedores.map((fornecedor, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.listItemTitle}>{fornecedor.nome}</Text>
                    <Text style={styles.listItemSubtitle}>{fornecedor.categoria}</Text>
                  </View>
                </View>
                <Text style={styles.listItemValue}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fornecedor.total)}
                </Text>
              </View>
            ))}
          </View>
        )}
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
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  chartCard: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  listCard: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.purple[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankText: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  listItemTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  listItemSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  listItemValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
});

