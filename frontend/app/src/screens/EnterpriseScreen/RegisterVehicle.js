import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

// URL da API (substitua pelo endpoint real ou use variável de ambiente)

export default function RegisterVehicle({ navigation }) {
  const { idCollector } = useContext(AppContext);

  // Estados
  const [volumeSize, setVolumeSize] = useState('SMALL');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carLicensePlate, setCarLicensePlate] = useState('');
  const [maximumWeight, setMaximumWeight] = useState('');

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validação e envio dos dados
  const handleSaveChanges = async () => {
    // Validação
    if (!carBrand || !carModel || !carLicensePlate || !maximumWeight) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (isNaN(maximumWeight) || Number(maximumWeight) <= 0) {
      Alert.alert('Erro', 'O peso máximo deve ser um número válido.');
      return;
    }

    const vehicleData = {
      idCollector,
      volumeSize,
      carBrand,
      carModel,
      carLicensePlate,
      maximumWeight: Number(maximumWeight),
    };

    try {
      await axios.post(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/registerVehicle`, vehicleData);
      Alert.alert('Sucesso', 'Veículo salvo com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            // Limpar formulário
            setVolumeSize('SMALL');
            setCarBrand('');
            setCarModel('');
            setCarLicensePlate('');
            setMaximumWeight('');
          },
        },
      ]);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar a solicitação.');
    }
  };

  const animateButtonIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const animateButtonOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Cadastro de Veículo</Text>
          </View>

          <View style={styles.profileBox}>
            <Text style={styles.sectionTitle}>Tamanho do Volume</Text>
            <View style={styles.volumeOptions}>
              {['SMALL', 'MEDIUM', 'LARGE'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.volumeOption,
                    volumeSize === size && styles.selectedOption,
                  ]}
                  onPress={() => setVolumeSize(size)}
                  activeOpacity={0.8}
                  accessibilityLabel={`Selecionar tamanho ${size.toLowerCase()}`}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.optionText,
                      volumeSize === size && styles.selectedOptionText,
                    ]}
                  >
                    {size === 'SMALL' ? 'Pequeno' : size === 'MEDIUM' ? 'Médio' : 'Grande'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {[
              { label: 'Marca', value: carBrand, set: setCarBrand, placeholder: 'Ex: Toyota' },
              { label: 'Modelo', value: carModel, set: setCarModel, placeholder: 'Ex: Hilux' },
              { label: 'Placa', value: carLicensePlate, set: setCarLicensePlate, placeholder: 'Ex: ABC-1234' },
              {
                label: 'Peso Máximo (kg)',
                value: maximumWeight,
                set: setMaximumWeight,
                placeholder: 'Ex: 1000',
                keyboardType: 'numeric',
              },
            ].map(({ label, value, set, placeholder, keyboardType }) => (
              <View key={label} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  value={value}
                  onChangeText={set}
                  keyboardType={keyboardType || 'default'}
                  placeholderTextColor="#a3a3a3"
                  onFocus={animateButtonIn}
                  onBlur={animateButtonOut}
                  selectionColor="#83D07F"
                  accessible={true}
                  accessibilityLabel={`Campo para ${label.toLowerCase()}`}
                  accessibilityRole="text"
                />
              </View>
            ))}

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
                activeOpacity={0.85}
                accessibilityLabel="Salvar veículo"
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>Salvar Veículo</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    paddingBottom: 10,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderColor: '#83D07F',
  },
  headerText: {
    fontSize: 32,
    color: '#2F855A',
    fontWeight: '900',
    fontFamily: 'System',
    letterSpacing: 0.8,
  },
  profileBox: {
    backgroundColor: '#F9FAFB',
    width: '100%',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#276749',
  },
  volumeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  volumeOption: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  selectedOption: {
    backgroundColor: '#38A169',
    borderColor: '#2F855A',
  },
  optionText: {
    color: '#276749',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#2D3748',
    fontSize: 15,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    color: '#1A202C',
  },
  saveButton: {
    backgroundColor: '#38A169',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#276749',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
  },
  saveButtonText: {
    color: '#E6FFFA',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});