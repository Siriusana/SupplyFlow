import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { requisicoesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export function Requisicoes() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [requisicoes, setRequisicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    prioridade: 'media',
    descricao: '',
    valor: '',
  });

  useEffect(() => {
    loadRequisicoes();
  }, []);

  const loadRequisicoes = async () => {
    try {
      setLoading(true);
      const response = await requisicoesAPI.getAll();
      setRequisicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar requisições:', error);
      Alert.alert('Erro', 'Erro ao carregar requisições');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRequisicoes();
  };

  const handleCreate = async () => {
    if (!isAdmin) {
      Alert.alert('Erro', 'Apenas administradores podem criar novas requisições');
      return;
    }

    try {
      const valor = parseFloat(formData.valor.replace(/[^\d,]/g, '').replace(',', '.'));
      await requisicoesAPI.create({
        codigo: `REQ-${Date.now()}`,
        titulo: formData.titulo,
        solicitante: 'Usuário Atual',
        departamento: 'Geral',
        categoria: formData.categoria,
        valor: valor,
        data: new Date().toISOString().split('T')[0],
        status: 'pendente',
        prioridade: formData.prioridade,
        descricao: formData.descricao,
      });
      setShowModal(false);
      setFormData({ titulo: '', categoria: '', prioridade: 'media', descricao: '', valor: '' });
      Alert.alert('Sucesso', 'Requisição criada com sucesso!');
      loadRequisicoes();
    } catch (error) {
      console.error('Erro ao criar requisição:', error);
      Alert.alert('Erro', 'Erro ao criar requisição');
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await requisicoesAPI.aprovar(id);
      Alert.alert('Sucesso', 'Requisição aprovada!');
      loadRequisicoes();
    } catch (error) {
      console.error('Erro ao aprovar requisição:', error);
      Alert.alert('Erro', 'Erro ao aprovar requisição');
    }
  };

  const handleRejeitar = async (id: number) => {
    try {
      await requisicoesAPI.rejeitar(id);
      Alert.alert('Sucesso', 'Requisição rejeitada!');
      loadRequisicoes();
    } catch (error) {
      console.error('Erro ao rejeitar requisição:', error);
      Alert.alert('Erro', 'Erro ao rejeitar requisição');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      pendente: { label: 'Pendente', color: colors.yellow[500], icon: 'time-outline' },
      aprovada: { label: 'Aprovada', color: colors.green[500], icon: 'checkmark-circle-outline' },
      rejeitada: { label: 'Rejeitada', color: colors.red[500], icon: 'close-circle-outline' },
      em_analise: { label: 'Em Análise', color: colors.blue[500], icon: 'alert-circle-outline' },
    };
    return configs[status] || configs.pendente;
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors_map: any = {
      alta: colors.red[500],
      media: colors.yellow[500],
      baixa: colors.green[500],
    };
    return colors_map[prioridade] || colors_map.media;
  };

  const filteredRequisicoes = requisicoes.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
            <Text style={styles.headerTitle}>Requisições</Text>
            <Text style={styles.headerSubtitle}>Gestão de requisições de compra</Text>
          </View>
          {isAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar requisições..."
            placeholderTextColor={colors.text.muted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {['all', 'pendente', 'aprovada', 'rejeitada', 'em_analise'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.filterChipText, filterStatus === status && styles.filterChipTextActive]}>
                {status === 'all' ? 'Todas' : getStatusConfig(status).label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredRequisicoes}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{item.titulo}</Text>
                    <Text style={styles.cardCode}>{item.codigo}</Text>
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
                    <Ionicons name="person-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.cardText}>{item.solicitante}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.cardText}>{formatDate(item.data)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Ionicons name="cash-outline" size={16} color={colors.text.tertiary} />
                    <Text style={styles.cardText}>{formatCurrency(item.valor)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <View style={[styles.prioridadeDot, { backgroundColor: getPrioridadeColor(item.prioridade) }]} />
                    <Text style={styles.cardText}>Prioridade: {item.prioridade}</Text>
                  </View>
                </View>

                {isAdmin && item.status === 'pendente' && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleAprovar(item.id)}
                    >
                      <Ionicons name="checkmark" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Aprovar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleRejeitar(item.id)}
                    >
                      <Ionicons name="close" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Rejeitar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Requisição</Text>
            
            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                  style={styles.input}
                  value={formData.titulo}
                  onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                  placeholder="Título da requisição"
                  placeholderTextColor={colors.text.muted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  value={formData.categoria}
                  onChangeText={(text) => setFormData({ ...formData, categoria: text })}
                  placeholder="Categoria"
                  placeholderTextColor={colors.text.muted}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Valor</Text>
                <TextInput
                  style={styles.input}
                  value={formData.valor}
                  onChangeText={(text) => setFormData({ ...formData, valor: text })}
                  placeholder="Valor"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.descricao}
                  onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                  placeholder="Descrição"
                  placeholderTextColor={colors.text.muted}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleCreate}
              >
                <Text style={styles.modalButtonTextSave}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.purple[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.purple[500],
    borderColor: colors.purple[500],
  },
  filterChipText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  filterChipTextActive: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
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
  cardCode: {
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
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  prioridadeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  approveButton: {
    backgroundColor: colors.green[500],
  },
  rejectButton: {
    backgroundColor: colors.red[500],
  },
  actionButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium,
  },
  input: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  modalButtonSave: {
    backgroundColor: colors.purple[500],
  },
  modalButtonTextCancel: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  modalButtonTextSave: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});

