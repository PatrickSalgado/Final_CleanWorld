import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
  ScrollView, Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

function StepProgress({ currentStep }) {
  const steps = [
    { label: 'Dados da Empresa', icon: 'briefcase' },
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

export default function RegisterEnterpriseOne({ navigation, route }) {
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');

  const cnpjRef = useRef(null);
  const phoneRef = useRef(null);

  const { nameEnterprise, userType } = route.params;

  const handleRegister = () => {
    const isCnpjValid = cnpjRef.current?.isValid();
    const phoneRaw = phone.replace(/\D/g, '');

    if (!isCnpjValid) {
      Alert.alert('Erro', 'CNPJ inválido. Verifique e tente novamente.');
      return;
    }

    if (phoneRaw.length < 10 || phoneRaw.length > 11) {
      Alert.alert('Erro', 'Telefone inválido. Verifique e tente novamente.');
      return;
    }

    navigation.navigate("RegisterEnterpriseTwo", {
      nameEnterprise, cnpj, phone, userType
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#2E7D32" />
        </TouchableOpacity>

        <Animatable.View animation="fadeInDown" delay={200} duration={700} style={styles.headerBox}>
          <Image source={require('../../../../assets/logo.png')} style={styles.image} />
          <Text style={styles.headerText}>CleanWorld</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} duration={700} style={{ width: '100%', maxWidth: 400 }}>
          <StepProgress currentStep={1} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} duration={700} style={styles.formBox}>
          <Text style={styles.label}>CNPJ</Text>
          <TextInputMask
            type={'cnpj'}
            value={cnpj}
            onChangeText={setCnpj}
            style={styles.input}
            placeholder="00.000.000/0001-00"
            ref={cnpjRef}
            maxLength={18}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="(47) 99000-0000"
            ref={phoneRef}
            maxLength={15}
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Prosseguir</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E8B57',
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
    backgroundColor: '#ffffff',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
