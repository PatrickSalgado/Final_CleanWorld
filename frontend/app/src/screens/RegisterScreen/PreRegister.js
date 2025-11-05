import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function PreRegister({ navigation }) {
  const [nameEnterprise, setnameEnterprise] = useState('');
  const [name, setname] = useState('');
  const [userType, setUserType] = useState(0); // 0: Pessoa Física, 1: Empresa

  const handlePreRegister = () => {
    if (userType === 1 && nameEnterprise.trim() !== '') {
      navigation.navigate("RegisterEnterpriseOne", { nameEnterprise, userType });
    } else if (userType === 0 && name.trim() !== '') {
      navigation.navigate("RegisterUserOne", { name, userType });
    } else {
      alert('Por favor, preencha o campo correspondente antes de prosseguir.');
    }
  };

  return (
    <LinearGradient
      colors={['#3CB371', '#2E8B57']}
      style={styles.container}
    >
      <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>CleanWorld</Text>
      </Animatable.View>

      <Animatable.Text animation="fadeIn" duration={1000} style={styles.loginTitle}>
        Vamos iniciar
      </Animatable.Text>
      <View style={styles.divider} />

      <Animatable.View animation="fadeInUp" delay={200} duration={800} style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 0 && styles.activeToggle]}
          onPress={() => {
            setUserType(0);
            setnameEnterprise('');
          }}
        >
          <Text style={[styles.toggleText, userType === 0 && styles.activeText]}>
            Pessoa Física
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 1 && styles.activeToggle]}
          onPress={() => {
            setUserType(1);
            setname('');
          }}
        >
          <Text style={[styles.toggleText, userType === 1 && styles.activeText]}>
            Empresa
          </Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} duration={900} style={styles.formBox}>
        {userType === 1 ? (
          <>
            <Text style={styles.label}>Nome da Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da empresa"
              value={nameEnterprise}
              onChangeText={setnameEnterprise}
              placeholderTextColor="#9E9E9E"
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Seu Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setname}
              placeholderTextColor="#9E9E9E"
            />
          </>
        )}

        <Animatable.View animation="bounceIn" delay={600}>
          <TouchableOpacity style={styles.button} onPress={handlePreRegister}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Botão de voltar aparece sempre, independente do userType */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.backButtonText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>

      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // centraliza horizontalmente
  marginBottom: 32,
  position: 'relative', // para poder usar posicionamento absoluto no título
},
logo: {
  width: 56,
  height: 56,
  marginRight: 4, // diminuiu a margem para colar mais no texto
},
title: {
  fontSize: 32,
  fontWeight: '700',
  color: '#fff',
},
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 4,
  },
  divider: {
    height: 3,
    backgroundColor: '#A5D6A7',
    width: '40%',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: '#ffffff80',
    backgroundColor: '#ffffff20',
  },
  activeToggle: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  activeText: {
    color: '#2E8B57',
  },
  formBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#388E3C',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F1F8E9',
    color: '#2E7D32',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  backButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButton: {
    // deixa simples, sem sombra ou animação
  },
  backButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
