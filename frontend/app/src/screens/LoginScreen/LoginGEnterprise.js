import React, { useContext, useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, 
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';


export default function LoginGEnterprise({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setIdCollector, setUserType } = useContext(AppContext);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `https://subattenuated-epithetically-eryn.ngrok-free.dev/api/collector/login`,
        { email, password },
        { timeout: 10000 }
      );
      const { token, userType, idCollector } = response.data;

      if (!token) {
        setError("Credenciais inválidas");
        setLoading(false);
        return;
      }

      setIdCollector(idCollector);
      setUserType(userType);

      if (userType === 1) {
        navigation.navigate('EnterpriseMenu', { token, idCollector });
      } else {
        setError("Tipo de usuário inválido.");
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError("Tempo de conexão excedido. Verifique o servidor.");
      } else {
        setError("Erro na conexão com o servidor");
      }
      console.error("Erro no login: ", err.response?.data || err.message);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#3CB371', '#2E8B57']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.innerContainer}
        >
          <View style={styles.header}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>CleanWorld</Text>
          </View>

          <View style={styles.loginBox}>
            <Text style={styles.loginTitle}>Empresa</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Campo de email"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Campo de senha"
            />

            {loading ? (
              <ActivityIndicator size="large" color="#A5D6A7" />
            ) : (
              <>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Pre-registro')}>
                  <Text style={styles.linkText}>Cadastre-se</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Login do Usuário</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F1F8E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: '#2E8B57',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
