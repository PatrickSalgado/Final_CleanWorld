import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';

export default function EnterpriseProfile({ navigation }) {
  const { idCollector } = useContext(AppContext);
  const [nameEnterprise, setNameEnterprise] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!idCollector) {
      Alert.alert('Erro', 'ID do coletor não encontrado.');
      navigation.goBack();
      return;
    }

    const fetchEnterpriseData = async () => {
      try {
        const res = await axios.get(`https://2a600c282efc.ngrok-free.app/api/collector/${idCollector}`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setNameEnterprise(data.nameEnterprise || '');
        setCnpj(formatCnpj(data.cnpj || ''));
        setPhone(data.phone || '');
        setEmail(data.email || '');
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        Alert.alert('Erro', error.response?.data?.message || 'Não foi possível carregar os dados.');
      }
    };

    fetchEnterpriseData();
  }, [idCollector, navigation]);

  const formatCnpj = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const unformatCnpj = (cnpj) => cnpj.replace(/[^\d]/g, '');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSaveChanges = async () => {
    if (!nameEnterprise || !phone || !email) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `https://2a600c282efc.ngrok-free.app/api/collector/${idCollector}`,
        {
          nameEnterprise,
          cnpj: unformatCnpj(cnpj),
          phone,
          email,
        },
        { timeout: 10000 }
      );
      Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Perfil da Empresa</Text>
        <View style={styles.card}>
          <LabelInput
            label="Nome"
            value={nameEnterprise}
            onChangeText={setNameEnterprise}
            accessibilityLabel="Nome da empresa"
          />
          <LabelInput
            label="CNPJ"
            value={cnpj}
            editable={false}
            accessibilityLabel="CNPJ da empresa"
          />
          <LabelInput
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            accessibilityLabel="Telefone da empresa"
          />
          <LabelInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            accessibilityLabel="Email da empresa"
          />
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const LabelInput = ({ label, value, onChangeText, keyboardType, editable = true, accessibilityLabel }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, editable === false && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
      accessibilityLabel={accessibilityLabel}
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2d3436',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#636e72',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f1f2f6',
    color: '#a4b0be',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
