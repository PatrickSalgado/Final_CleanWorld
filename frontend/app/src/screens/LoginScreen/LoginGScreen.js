import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';


export default function LoginGScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setIdUser, setUserType } = useContext(AppContext);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {console.log(email, password);
        
      const response = await axios.post(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/login`, 
        { email, password },
        { timeout: 10000 }
      );

      const { token, userType, idUser } = response.data;
      setIdUser(idUser);
      setUserType(userType);

      if (token) {
        if (userType === 0) {
          navigation.navigate('UserMenu', { token, idUser });
        } else if (userType === 1) {
          navigation.navigate('EnterpriseMenu', { token, idUser });
        }
      } else {
        setError("Credenciais inválidas");
      }
    } catch (error) {console.error(error);

      if (error.code === 'ECONNABORTED') {
        setError("Tempo de conexão excedido. Verifique o servidor.");
      } else {
        setError("Erro na conexão com o servidor");
      }
      console.error("Erro no login: ", error);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#3CB371', '#2E8B57']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.innerContainer}>
          <View style={styles.header}>
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.logo}
            />
            <Text style={styles.title}>CleanWorld</Text>
          </View>

          <View style={styles.loginBox}>
            <Text style={styles.loginTitle}>Usuário</Text>

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
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Pre-registro')}>
              <Text style={styles.linkText}>Cadastre-se</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LoginGEnterprise')}>
              <Text style={styles.linkText}>Login da Empresa</Text>
            </TouchableOpacity>
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
    flexGrow: 1,               // para ScrollView funcionar bem com KeyboardAvoidingView
    justifyContent: 'center',  // centraliza tudo verticalmente
    padding: 24,
  },
  header: {
  alignItems: 'center',
  marginTop: 0,      // subiu o header mais pro topo
  marginBottom: 30,  // espaço menor entre header e loginBox
},
  logo: {
    width: 90,
    height: 90,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loginBox: {
    backgroundColor: '#ffffff',
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
