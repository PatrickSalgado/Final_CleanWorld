import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet,  Image, ScrollView, Alert} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Checkbox from 'expo-checkbox';

function StepProgress({ currentStep }) {
  const steps = [
    { label: 'Dados Pessoais', icon: 'user' },
    { label: 'Autenticação', icon: 'lock' },
  ];

  return (
    <View style={styles.stepsContainer}>
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <React.Fragment key={index}>
            <View style={styles.stepItem}>
              <Feather
                name={isCompleted ? 'check-circle' : step.icon}
                size={28}
                color={isActive || isCompleted ? '#2E8B57' : '#A5D6A7'}
                style={{ zIndex: 1 }}
              />
              <Text style={[styles.stepLabel, (isActive || isCompleted) && styles.stepLabelActive]}>
                {step.label}
              </Text>
            </View>
            {index !== steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  isCompleted ? styles.stepLineActive : styles.stepLineInactive,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function RegisterUserTwo({ navigation, route }) {
  const { name, cpf, phone, birthDate, userType } = route.params;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isAgreed, setIsAgreed] = React.useState(false);


  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Email inválido", "Digite um email válido.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!isAgreed) {
      Alert.alert('Atenção', 'Você precisa concordar com os Termos de Uso para continuar.');
      return;
    }

    if (!validateFields()) return;

    try {
      const response = await axios.post(`https://2a600c282efc.ngrok-free.app/api/user`, {
      name, cpf, phone, birthDate, userType, email, password
    });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);

      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      const errorMsg = error.response?.data?.message || "Erro ao realizar o cadastro. Tente novamente.";
      Alert.alert("Erro", errorMsg);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#3CB371', '#2E8B57']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInLeft" delay={200} duration={700} style={styles.backButton}>
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInDown" delay={400} duration={700} style={styles.header}>
          <Image source={require('../../../../assets/logo.png')} style={styles.logoSmall} />
          <Text style={styles.brandText}>CleanWorld</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} duration={700} style={{ width: '100%', maxWidth: 400 }}>
          <StepProgress currentStep={2} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} duration={700} style={styles.formBox}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9E9E9E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#9E9E9E"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.checkboxContainer}>
  <Checkbox
    value={isAgreed}
    onValueChange={setIsAgreed}
    color={isAgreed ? '#2E8B57' : undefined}
  />
  <Text style={styles.checkboxText}>
    Li e concordo com os{' '}
    <Text
      style={styles.link}
      onPress={() => navigation.navigate('TermosDeUso')}
    >
      Termos de Uso e Política de Privacidade
    </Text>
  </Text>
</View>


          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Finalizar Cadastro</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 8,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  logoSmall: {
    width: 36,
    height: 36,
    marginRight: 6,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E0F2F1',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
  },
  stepItem: {
    alignItems: 'center',
    width: 120,
    zIndex: 2,
  },
  stepLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#A5D6A7',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#2E8B57',
  },
  stepLine: {
    flex: 1,
    height: 4,
    marginHorizontal: 6,
    borderRadius: 4,
  },
  stepLineActive: {
    backgroundColor: '#2E8B57',
  },
  stepLineInactive: {
    backgroundColor: '#A5D6A7',
  },
  formBox: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 8,
  },
  label: {
    fontWeight: '600',
    color: '#388E3C',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 12,
    backgroundColor: '#F1F8E9',
    color: '#2E7D32',
    shadowColor: '#A5D6A7',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#2E8B57',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 10,
  flexWrap: 'wrap',
},
checkboxText: {
  marginLeft: 10,
  fontSize: 14,
  color: '#2E7D32',
  flexShrink: 1,
},
link: {
  color: '#1E88E5',
  textDecorationLine: 'underline',
},

});
