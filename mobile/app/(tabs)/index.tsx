import { Dashboard } from '../../src/components/Dashboard';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../src/styles/theme';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.username || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.red[400]} />
        </TouchableOpacity>
      </View>
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl + 20,
    backgroundColor: 'transparent',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  userName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
  logoutButton: {
    padding: spacing.sm,
  },
});

