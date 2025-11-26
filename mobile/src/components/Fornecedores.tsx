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
import { fornecedoresAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export function Fornecedores() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFornecedor, setCurrentFornecedor] = useState<any>(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    avaliacao: 0,
    status: 'Ativo',
    totalPedidos: 0,
  });

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const response = await fornecedoresAPI.getAll();
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      Alert.alert('Erro', 'Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFornecedores();
  };

  const handleCreateOrUpdate = async () => {
    if (!isAdmin && !isEditing) {
      Alert.alert('Erro', 'Apenas administradores podem criar novos fornecedores');
      return;
    }

    try {
      if (isEditing && currentFornecedor) {
        await fornecedoresAPI.update(currentFornecedor.id, formData);
        Alert.alert('Sucesso', 'Fornecedor atualizado com sucesso!');
      } else {
        await fornecedoresAPI.create(formData);
        Alert.alert('Sucesso', 'Fornecedor criado com sucesso!');
      }
      
      setShowModal(false);
      setIsEditing(false);
      setCurrentFornecedor(null);
      setFormData({
        nome: '',
        categoria: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        avaliacao: 0,
        status: 'Ativo',
        totalPedidos: 0,
      });
      loadFornecedores();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      Alert.alert('Erro', 'Erro ao salvar fornecedor');
    }
  };

  const handleEdit = (fornecedor: any) => {
    setIsEditing(true);
    setCurrentFornecedor(fornecedor);
    setFormData({
      nome: fornecedor.nome,
      categoria: fornecedor.categoria,
      cnpj: fornecedor.cnpj,
      email: fornecedor.email,
      telefone: fornecedor.telefone,
      endereco: fornecedor.endereco,
      avaliacao: fornecedor.avaliacao,
      status: fornecedor.status,
      totalPedidos: fornecedor.totalPedidos,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      Alert.alert('Erro', 'Apenas administradores podem excluir fornecedores');
      return;
    }

    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja excluir este fornecedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await fornecedoresAPI.delete(id);
              Alert.alert('Sucesso', 'Fornecedor excluído com sucesso!');
              loadFornecedores();
            } catch (error) {
              console.error('Erro ao excluir fornecedor:', error);
              Alert.alert('Erro', 'Erro ao excluir fornecedor');
            }
          },
        },
      ]
    );
  };

  const filteredFornecedores = fornecedores.filter((f) => {
    const matchesSearch = f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !filterCategoria || f.categoria === filterCategoria;
    const matchesStatus = !filterStatus || f.status === filterStatus;
    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const categorias = [...new Set(fornecedores.map((f) => f.categoria))];

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
            <Text style={styles.headerTitle}>Fornecedores</Text>
            <Text style={styles.headerSubtitle}>Gestão centralizada de fornecedores</Text>
          </View>
          {isAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setIsEditing(false);
                setCurrentFornecedor(null);
                setFormData({
                  nome: '',
                  categoria: '',
                  cnpj: '',
                  email: '',
                  telefone: '',
                  endereco: '',
                  avaliacao: 0,
                  status: 'Ativo',
                  totalPedidos: 0,
                });
                setShowModal(true);
              }}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar fornecedores..."
            placeholderTextColor={colors.text.muted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterChip, !filterCategoria && styles.filterChipActive]}
            onPress={() => setFilterCategoria('')}
          >
            <Text style={[styles.filterChipText, !filterCategoria && styles.filterChipTextActive]}>
              Todas Categorias
            </Text>
          </TouchableOpacity>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, filterCategoria === cat && styles.filterChipActive]}
              onPress={() => setFilterCategoria(cat)}
            >
              <Text style={[styles.filterChipText, filterCategoria === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        <FlatList
          data={filteredFornecedores}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedFornecedor(item);
                setShowDetailModal(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.cardSubtitle}>{item.categoria}</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={colors.yellow[400]} />
                  <Text style={styles.rating}>{item.avaliacao.toFixed(1)}</Text>
                </View>
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.cardRow}>
                  <Ionicons name="mail-outline" size={16} color={colors.text.tertiary} />
                  <Text style={styles.cardText}>{item.email}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="call-outline" size={16} color={colors.text.tertiary} />
                  <Text style={styles.cardText}>{item.telefone}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="location-outline" size={16} color={colors.text.tertiary} />
                  <Text style={styles.cardText} numberOfLines={1}>{item.endereco}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, item.status === 'Ativo' ? styles.statusActive : styles.statusInactive]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Ionicons name="create-outline" size={20} color={colors.blue[400]} />
                  </TouchableOpacity>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.red[400]} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </Text>
              
              <ScrollView>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.nome}
                    onChangeText={(text) => setFormData({ ...formData, nome: text })}
                    placeholder="Nome do fornecedor"
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
                  <Text style={styles.label}>CNPJ</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.cnpj}
                    onChangeText={(text) => setFormData({ ...formData, cnpj: text })}
                    placeholder="CNPJ"
                    placeholderTextColor={colors.text.muted}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Email"
                    placeholderTextColor={colors.text.muted}
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.telefone}
                    onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                    placeholder="Telefone"
                    placeholderTextColor={colors.text.muted}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Endereço</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.endereco}
                    onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                    placeholder="Endereço"
                    placeholderTextColor={colors.text.muted}
                    multiline
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
                  onPress={handleCreateOrUpdate}
                >
                  <Text style={styles.modalButtonTextSave}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Detail Modal */}
        <Modal
          visible={showDetailModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedFornecedor && (
                <>
                  <View style={styles.detailHeader}>
                    <View style={styles.detailAvatar}>
                      <Text style={styles.detailAvatarText}>
                        {selectedFornecedor.nome?.charAt(0).toUpperCase() || 'F'}
                      </Text>
                    </View>
                    <View style={styles.detailHeaderInfo}>
                      <Text style={styles.detailTitle}>{selectedFornecedor.nome}</Text>
                      <Text style={styles.detailSubtitle}>{selectedFornecedor.categoria}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowDetailModal(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.detailContent}>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Informações de Contato</Text>
                      <View style={styles.detailRow}>
                        <Ionicons name="mail-outline" size={20} color={colors.text.tertiary} />
                        <Text style={styles.detailText}>{selectedFornecedor.email || 'N/A'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="call-outline" size={20} color={colors.text.tertiary} />
                        <Text style={styles.detailText}>{selectedFornecedor.telefone || 'N/A'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={20} color={colors.text.tertiary} />
                        <Text style={styles.detailText}>{selectedFornecedor.endereco || 'N/A'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="document-text-outline" size={20} color={colors.text.tertiary} />
                        <Text style={styles.detailText}>{selectedFornecedor.cnpj || 'N/A'}</Text>
                      </View>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Estatísticas</Text>
                      <View style={styles.detailStats}>
                        <View style={styles.detailStatItem}>
                          <Ionicons name="star" size={24} color={colors.yellow[400]} />
                          <Text style={styles.detailStatLabel}>Avaliação</Text>
                          <Text style={styles.detailStatValue}>
                            {selectedFornecedor.avaliacao?.toFixed(1) || '0.0'}
                          </Text>
                        </View>
                        <View style={styles.detailStatItem}>
                          <Ionicons name="cart-outline" size={24} color={colors.blue[400]} />
                          <Text style={styles.detailStatLabel}>Total Pedidos</Text>
                          <Text style={styles.detailStatValue}>
                            {selectedFornecedor.totalPedidos || 0}
                          </Text>
                        </View>
                        <View style={styles.detailStatItem}>
                          <Ionicons
                            name={selectedFornecedor.status === 'Ativo' ? 'checkmark-circle' : 'close-circle'}
                            size={24}
                            color={selectedFornecedor.status === 'Ativo' ? colors.green[400] : colors.red[400]}
                          />
                          <Text style={styles.detailStatLabel}>Status</Text>
                          <Text style={styles.detailStatValue}>{selectedFornecedor.status || 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>

                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={[styles.detailActionButton, styles.editButton]}
                      onPress={() => {
                        setShowDetailModal(false);
                        handleEdit(selectedFornecedor);
                      }}
                    >
                      <Ionicons name="create-outline" size={20} color="#fff" />
                      <Text style={styles.detailActionButtonText}>Editar</Text>
                    </TouchableOpacity>
                    {isAdmin && (
                      <TouchableOpacity
                        style={[styles.detailActionButton, styles.deleteButton]}
                        onPress={() => {
                          setShowDetailModal(false);
                          handleDelete(selectedFornecedor.id);
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                        <Text style={styles.detailActionButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.purple[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
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
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
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
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.card.border,
  },
  detailAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.purple[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailAvatarText: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
  },
  detailHeaderInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  detailSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.tertiary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  detailContent: {
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: spacing.lg,
  },
  detailSectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  detailText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    flex: 1,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  detailStatItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailStatLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  detailStatValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  detailActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
  },
  detailActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  editButton: {
    backgroundColor: colors.blue[500],
  },
  deleteButton: {
    backgroundColor: colors.red[500],
  },
  detailActionButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});

