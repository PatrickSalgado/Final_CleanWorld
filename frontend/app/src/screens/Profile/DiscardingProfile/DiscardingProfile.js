import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../../../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function DiscardingProfile({ navigation }) {
  const { idUser } = useContext(AppContext);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchDiscarderData = async () => {
    try {
      const response = await axios.get(`https://2a600c282efc.ngrok-free.app/api/user/${idUser}`);
      if (response.data && Array.isArray(response.data) && response.data[0]) {
        const { name, cpf, phone, birthDate, email } = response.data[0];
        setName(name || '');
        setCpf(maskCPF(cpf) || '');
        setPhone(maskPhone(phone) || '');
        setBirthDate(formatBirthDate(birthDate) || '');
        setEmail(email || '');
      }
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  useEffect(() => {
    fetchDiscarderData();
  }, [idUser]);

  // 🔥 Função de máscara
  const maskCPF = (value) => {
    return value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const maskPhone = (value) => {
    return value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const maskDate = (value) => {
    return value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
  };

  const formatBirthDate = (date) => {
    try {
      if (date) {
        return format(new Date(date), 'dd/MM/yyyy');
      }
      return '';
    } catch {
      return '';
    }
  };

  const validateDate = (date) => /^\d{2}\/\d{2}\/\d{4}$/.test(date);
  const validatePhone = (phone) => /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);
  const validateCPF = (cpf) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);

  // 📅 Manipula DatePicker
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setBirthDate(`${day}/${month}/${year}`);
    }
  };

  const handleSaveChanges = async () => {
    if (!name || !email) {
      Alert.alert('Atenção', 'Nome e Email são obrigatórios.');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Telefone inválido', 'Formato esperado: (XX) XXXXX-XXXX');
      return;
    }

    if (!validateDate(birthDate)) {
      Alert.alert('Data de nascimento inválida', 'Formato esperado: DD/MM/AAAA');
      return;
    }

    if (!validateCPF(cpf)) {
      Alert.alert('CPF inválido', 'Formato esperado: XXX.XXX.XXX-XX');
      return;
    }

    try {
      await axios.put(`https://2a600c282efc.ngrok-free.app/api/user/${idUser}`, {
        name,
        cpf: cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
        birthDate,
        email,
        // ❌ senha não enviada para não alterar
      });

      Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar as alterações.';
      Alert.alert('Erro', message);
    }
  };

  return (
    <LinearGradient colors={['#3CB371', '#2E8B57']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>👤 Seu Perfil de Descarte</Text>
        <Text style={styles.subHeaderText}>Gerencie suas informações com facilidade</Text>
      </View>

      <View style={styles.profileBox}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>CPF</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={cpf} editable={false} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(XX) XXXXX-XXXX"
          value={phone}
          onChangeText={(text) => setPhone(maskPhone(text))}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="DD/MM/AAAA"
            value={birthDate}
            onChangeText={(text) => setBirthDate(maskDate(text))}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Feather name="calendar" size={24} color="#1b5e20" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate ? new Date(birthDate.split('/').reverse().join('-')) : new Date()}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={"********"}
          editable={false}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#f1f8e9',
    marginTop: 2,
  },
  profileBox: {
    backgroundColor: '#ffffffee',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
  },
  inputDisabled: {
    backgroundColor: '#c8e6c9',
    color: '#757575',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#43a047',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
