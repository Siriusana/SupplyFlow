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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { dashboardAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export function Dashboard() {
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 360;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  const chartWidth = screenWidth - (isSmallScreen ? spacing.md * 2 : spacing.xl * 2) - spacing.lg * 2;
  const chartHeight = isSmallScreen ? 180 : 220;

  const pieColors = ['#10b981', '#f59e0b', '#ef4444'];

  const iconMap: { [key: string]: string } = {
    FileText: 'document-text',
    Users: 'people',
    ShoppingCart: 'cart',
    DollarSign: 'cash',
  };

  const activityIconMap: { [key: string]: string } = {
    aprovacao: 'checkmark-circle',
    pendente: 'time',
    pedido: 'cart',
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAll();
      const data = response.data;

      // Stats
      if (data.stats) {
        setStats(data.stats);
      }

      // Monthly expenses
      if (data.monthlyExpenses && data.monthlyExpenses.length > 0) {
        setLineChartData({
          labels: data.monthlyExpenses.map((exp: any) => exp.name),
          datasets: [
            {
              data: data.monthlyExpenses.map((exp: any) => exp.valor),
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              strokeWidth: 3,
            },
          ],
        });
      }

      // Category expenses
      if (data.categoryExpenses && data.categoryExpenses.length > 0) {
        setBarChartData({
          labels: data.categoryExpenses.map((exp: any) => exp.name),
          datasets: [
            {
              data: data.categoryExpenses.map((exp: any) => exp.valor),
            },
          ],
        });
      }

      // Requisition status
      if (data.requisitionStatus && data.requisitionStatus.length > 0) {
        setPieChartData(
          data.requisitionStatus.map((status: any) => ({
            name: status.name,
            value: status.value,
            color: pieColors[data.requisitionStatus.indexOf(status) % pieColors.length],
            legendFontColor: colors.text.tertiary,
            legendFontSize: 12,
          }))
        );
      }

      // Recent activities
      if (data.recentActivities) {
        setRecentActivities(data.recentActivities);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
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
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.purple[500],
      fill: colors.purple[500],
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Visão geral da gestão de compras</Text>
          </View>
          <View style={[styles.lastUpdate, isSmallScreen && styles.lastUpdateSmall]}>
            <Text style={styles.lastUpdateLabel}>Última atualização</Text>
            <Text style={[styles.lastUpdateValue, isSmallScreen && styles.lastUpdateValueSmall]} numberOfLines={1}>
              {new Date().toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.length > 0 ? (
            stats.map((stat, index) => {
              const iconName = iconMap[stat.icon] || 'document-text';
              const trendIcon = stat.trend === 'up' ? 'trending-up' : 'trending-down';
              
              return (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <LinearGradient
                      colors={[colors.purple[500], colors.blue[500]]}
                      style={styles.statIconContainer}
                    >
                      <Ionicons name={iconName as any} size={24} color="#fff" />
                    </LinearGradient>
                    <View style={styles.trendContainer}>
                      <Ionicons
                        name={trendIcon as any}
                        size={16}
                        color={stat.trend === 'up' ? colors.green[400] : colors.red[400]}
                      />
                      <Text
                        style={[
                          styles.trendText,
                          { color: stat.trend === 'up' ? colors.green[400] : colors.red[400] },
                        ]}
                      >
                        {stat.change}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum dado disponível</Text>
            </View>
          )}
        </View>

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          {/* Line Chart */}
          {lineChartData ? (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Evolução de Gastos (6 meses)</Text>
              <View style={styles.chartContainer}>
                <LineChart
                  data={lineChartData}
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
              <Text style={styles.chartTitle}>Evolução de Gastos (6 meses)</Text>
              <View style={styles.emptyChartContainer}>
                <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
              </View>
            </View>
          )}

          {/* Bar Chart */}
          {barChartData ? (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Gastos por Categoria</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartData}
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

          {/* Pie Chart */}
          {pieChartData && pieChartData.length > 0 ? (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Status das Requisições</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={pieChartData}
                  width={chartWidth}
                  height={chartHeight}
                  chartConfig={chartConfig}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft={isSmallScreen ? "10" : "15"}
                  style={styles.chart}
                />
              </View>
              <View style={styles.pieLegend}>
                {pieChartData.map((item: any, index: number) => (
                  <View key={index} style={styles.pieLegendItem}>
                    <View style={[styles.pieLegendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.pieLegendText}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Status das Requisições</Text>
              <View style={styles.emptyChartContainer}>
                <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
              </View>
            </View>
          )}

          {/* Recent Activity */}
          <View style={styles.activityCard}>
            <Text style={styles.chartTitle}>Atividades Recentes</Text>
            <View style={styles.activityList}>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const iconName = activityIconMap[activity.type] || 'checkmark-circle';
                  return (
                    <View key={index} style={styles.activityItem}>
                      <Ionicons
                        name={iconName as any}
                        size={20}
                        color={colors.purple[400]}
                        style={styles.activityIcon}
                      />
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      </View>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>Nenhuma atividade recente</Text>
              )}
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
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
  lastUpdate: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'flex-end',
    minWidth: 120,
    maxWidth: 180,
  },
  lastUpdateSmall: {
    minWidth: 100,
    maxWidth: 140,
    padding: spacing.sm,
  },
  lastUpdateLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  lastUpdateValue: {
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    textAlign: 'right',
  },
  lastUpdateValueSmall: {
    fontSize: 10,
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
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  statTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  chartsSection: {
    gap: spacing.lg,
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
  pieLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pieLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pieLegendText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  activityCard: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  activityList: {
    gap: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
  },
  activityIcon: {
    marginTop: spacing.xs,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  activityDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  activityTime: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.tertiary,
  },
});

