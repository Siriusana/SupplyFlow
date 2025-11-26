import { Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Login as LoginComponent } from '../../src/components/Login';

export default function Login() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <LoginComponent />;
}

