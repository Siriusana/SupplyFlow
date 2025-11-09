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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { dashboardAPI } from '../services/api';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

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
    backgroundColor: colors.card.background,
    backgroundGradientFrom: colors.card.background,
    backgroundGradientTo: colors.card.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.6})`,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.purple[500],
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Visão geral da gestão de compras</Text>
          </View>
          <View style={styles.lastUpdate}>
            <Text style={styles.lastUpdateLabel}>Última atualização</Text>
            <Text style={styles.lastUpdateValue}>
              {new Date().toLocaleString('pt-BR')}
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
          {lineChartData && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Evolução de Gastos (6 meses)</Text>
              <LineChart
                data={lineChartData}
                width={screenWidth - spacing.xl * 2}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
              />
            </View>
          )}

          {/* Bar Chart */}
          {barChartData && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Gastos por Categoria</Text>
              <BarChart
                data={barChartData}
                width={screenWidth - spacing.xl * 2}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel="R$ "
                showValuesOnTopOfBars
                withInnerLines={true}
                withHorizontalLabels={true}
              />
            </View>
          )}

          {/* Pie Chart */}
          {pieChartData && pieChartData.length > 0 && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Status das Requisições</Text>
              <PieChart
                data={pieChartData}
                width={screenWidth - spacing.xl * 2}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  lastUpdate: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'flex-end',
  },
  lastUpdateLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  lastUpdateValue: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
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
  chart: {
    borderRadius: borderRadius.md,
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

