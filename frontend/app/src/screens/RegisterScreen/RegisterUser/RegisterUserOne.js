import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { MaskedTextInput } from 'react-native-mask-text';
import DateTimePicker from '@react-native-community/datetimepicker';

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

function DateInput({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const parseDate = (dateString) => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date();
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios'); // Android fecha automaticamente, iOS mantém aberto
    if (selectedDate) {
      onChange(formatDate(selectedDate));
    }
  };

  return (
    <View style={styles.dateContainer}>
      <MaskedTextInput
        mask="99/99/9999"
        style={[styles.input, { flex: 1 }]}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#9E9E9E"
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.iconButton}>
        <Feather name="calendar" size={24} color="#2E8B57" />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value ? parseDate(value) : new Date()}
          mode="date"
          display="spinner"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

export default function RegisterUserOne({ navigation, route }) {
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const { name, userType } = route.params;

  const validateFields = () => {
    if (!cpf.trim() || !phone.trim() || !birthDate.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return false;
    }

    // Validação básica de formato
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const phoneRegex = /^\d{2} \d{5}-\d{4}$/;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!cpfRegex.test(cpf)) {
      Alert.alert('CPF inválido', 'Digite o CPF no formato correto: 000.000.000-00');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Telefone inválido', 'Digite o telefone no formato: 47 91234-5678');
      return false;
    }

    if (!dateRegex.test(birthDate)) {
      Alert.alert('Data inválida', 'Digite a data no formato: DD/MM/AAAA');
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateFields()) return;

    navigation.navigate("RegisterUserTwo", {
      name,
      cpf,
      phone,
      birthDate,
      userType
    });

    // Se quiser limpar os campos após o envio, pode descomentar:
    // setCpf('');
    // setPhone('');
    // setBirthDate('');
  };

  const handleLogoPress = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setCpf('123.456.789-00');
        setPhone('47 91234-5678');
        setBirthDate('01/01/2000');
      }
      return newCount;
    });
  };

  return (
    <LinearGradient colors={['#3CB371', '#2E8B57']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Botão Voltar */}
        <Animatable.View animation="fadeInLeft" delay={200} duration={700} style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.navigate("PreRegister")}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animatable.View>

        {/* Header */}
        <Animatable.View animation="fadeInDown" delay={400} duration={700} style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image source={require('../../../../assets/logo.png')} style={styles.logoSmall} />
          </TouchableOpacity>
          <Text style={styles.brandText}>CleanWorld</Text>
        </Animatable.View>

        {/* Barra de etapas */}
        <Animatable.View animation="fadeInUp" delay={600} duration={700}>
          <StepProgress currentStep={1} />
        </Animatable.View>

        {/* Formulário */}
        <Animatable.View animation="fadeInUp" delay={800} duration={700} style={styles.formBox}>
          <Text style={styles.label}>CPF</Text>
          <MaskedTextInput
            mask="999.999.999-99"
            style={styles.input}
            placeholder="000.000.000-00"
            placeholderTextColor="#9E9E9E"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Telefone</Text>
          <MaskedTextInput
            mask="99 99999-9999"
            style={styles.input}
            placeholder="47 91234-5678"
            placeholderTextColor="#9E9E9E"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <DateInput value={birthDate} onChange={setBirthDate} />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Prosseguir</Text>
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
});
