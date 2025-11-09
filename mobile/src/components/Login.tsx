import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../styles/theme';
import { useRouter } from 'expo-router';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, password, email);
      } else {
        await login(username, password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={colors.background.gradient}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Animated Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={[styles.blurCircle, { top: '25%', left: '25%', backgroundColor: 'rgba(139, 92, 246, 0.3)' }]} />
        <View style={[styles.blurCircle, { bottom: '25%', right: '25%', backgroundColor: 'rgba(59, 130, 246, 0.3)' }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>SupplyFlow</Text>
            <Text style={styles.subtitle}>Sistema de Gestão de Compras</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usuário</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu usuário"
                placeholderTextColor={colors.text.muted}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {isRegister && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu email"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.text.muted}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={[colors.purple[500], colors.blue[500]]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name={isRegister ? 'person-add-outline' : 'log-in-outline'}
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.buttonText}>
                      {isRegister ? 'Registrar' : 'Entrar'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            disabled={loading}
          >
            <Text style={styles.toggleText}>
              {isRegister ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Registrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsTitle}>Credenciais de Teste:</Text>
            <Text style={styles.credentialsText}>
              Usuário: <Text style={styles.credentialsValue}>admin</Text>
            </Text>
            <Text style={styles.credentialsText}>
              Senha: <Text style={styles.credentialsValue}>admin123</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundElements: {
    ...StyleSheet.absoluteFillObject,
  },
  blurCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    position: 'absolute',
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.card.border,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.tertiary,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
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
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  errorText: {
    color: colors.red[400],
    fontSize: typography.sizes.sm,
  },
  button: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  toggleButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  toggleText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.base,
  },
  credentialsBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: borderRadius.lg,
  },
  credentialsTitle: {
    color: colors.blue[400],
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  credentialsText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  credentialsValue: {
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
});

