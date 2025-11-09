import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { relatoriosAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export function Relatorios() {
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 360;
  const chartWidth = screenWidth - (isSmallScreen ? spacing.md * 2 : spacing.xl * 2) - spacing.lg * 2;
  const chartHeight = isSmallScreen ? 180 : 220;

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
    backgroundColor: '#1e293b',
    backgroundGradientFrom: '#1e293b',
    backgroundGradientTo: '#1e293b',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Purple
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
    style: {
      borderRadius: borderRadius.md,
    },
    propsForBackgroundLines: {
      strokeDasharray: '3,3',
      stroke: 'rgba(255, 255, 255, 0.1)',
    },
    fillShadowGradient: colors.purple[500],
    fillShadowGradientOpacity: 0.3,
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

        {gastosMensais ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos Mensais</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={gastosMensais}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLabels={!isSmallScreen}
                withHorizontalLabels={true}
                segments={isSmallScreen ? 3 : 4}
              />
            </View>
          </View>
        ) : (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos Mensais</Text>
            <View style={styles.emptyChartContainer}>
              <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
            </View>
          </View>
        )}

        {gastosPorCategoria ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos por Categoria</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={gastosPorCategoria}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel="R$ "
                showValuesOnTopOfBars={!isSmallScreen}
                withInnerLines={true}
                withHorizontalLabels={true}
                fromZero={true}
              />
            </View>
          </View>
        ) : (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Gastos por Categoria</Text>
            <View style={styles.emptyChartContainer}>
              <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
            </View>
          </View>
        )}

        {topFornecedores && topFornecedores.length > 0 ? (
          <View style={styles.listCard}>
            <Text style={styles.chartTitle}>Top Fornecedores</Text>
            {topFornecedores.map((fornecedor: any, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.listItemTitle}>{fornecedor.nome || 'N/A'}</Text>
                    <Text style={styles.listItemSubtitle}>
                      {fornecedor.categoria || 'Sem categoria'} • {fornecedor.pedidos || 0} pedidos
                    </Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={styles.listItemValue}>
                    {typeof fornecedor.total === 'string' 
                      ? fornecedor.total 
                      : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fornecedor.total || 0)}
                  </Text>
                  {fornecedor.economia && (
                    <Text style={styles.listItemEconomia}>
                      Economia: {typeof fornecedor.economia === 'string' 
                        ? fornecedor.economia 
                        : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fornecedor.economia || 0)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listCard}>
            <Text style={styles.chartTitle}>Top Fornecedores</Text>
            <View style={styles.emptyChartContainer}>
              <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
            </View>
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
    paddingBottom: spacing.xl,
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
    maxWidth: '48%',
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
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
  chartContainer: {
    backgroundColor: '#1e293b',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  chart: {
    borderRadius: borderRadius.md,
    marginVertical: 0,
  },
  emptyChartContainer: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  emptyChartText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.base,
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
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  listItemEconomia: {
    fontSize: typography.sizes.sm,
    color: colors.green[400],
    fontWeight: typography.weights.medium,
  },
});

