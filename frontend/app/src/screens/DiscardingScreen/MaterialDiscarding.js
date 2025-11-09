import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MaterialDiscarding({ navigation }) {
  const { idUser } = useContext(AppContext);

  const [quantityVolume, setQuantityVolume] = useState('');
  const [volumeSize, setVolumeSize] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Tipo de descarte
  const [wasteTypes, setWasteTypes] = useState([]); // Lista vinda do backend
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [customWasteType, setCustomWasteType] = useState('');

  useEffect(() => {
    fetchWasteTypes();
  }, []);

  const fetchWasteTypes = async () => {
    try {
      const response = await axios.get('https://2a600c282efc.ngrok-free.app/api/wasteType');
      setWasteTypes(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de descarte:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setCollectionDate(`${day}/${month}/${year}`);
    }
  };

  const handleSaveChanges = async () => {
    if (!quantityVolume || !volumeSize || !collectionDate || !collectionTime || !address || !materialDescription) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!selectedWasteType && !customWasteType) {
      Alert.alert('Atenção', 'Escolha ou digite um tipo de descarte.');
      return;
    }

    const wasteTypeToSend = customWasteType ? customWasteType : selectedWasteType;

    try {
      const response = await axios.post(`https://2a600c282efc.ngrok-free.app/api/registerOrder`, {
        quantityVolume,
        volumeSize,
        collectionDate,
        collectionTime,
        address,
        materialDescription,
        wasteType: wasteTypeToSend,
        status,
        idUser,
      });
      console.log('Pedido realizado com sucesso:', response.data);
      clearInput();
      Alert.alert('Sucesso', 'Material registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
      Alert.alert('Erro', 'Não foi possível registrar o material.');
    }
  };

  const clearInput = () => {
    setCollectionDate('');
    setCollectionTime('');
    setMaterialDescription('');
    setVolumeSize('');
    setQuantityVolume('');
    setAddress('');
    setSelectedWasteType('');
    setCustomWasteType('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>♻️ Solicitar Descarte</Text>
          <Text style={styles.subHeaderText}>Informe os seus dados e os do material</Text>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.label}>Quantidade de Itens *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5"
            value={quantityVolume}
            onChangeText={setQuantityVolume}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Tamanho do Volume *</Text>
          <View style={styles.volumeOptions}>
            {['Pequeno', 'Médio', 'Grande'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.volumeOption, volumeSize === item && styles.selectedOption]}
                onPress={() => setVolumeSize(item)}
              >
                <Text style={[styles.optionText, volumeSize === item && styles.selectedOptionText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Tipo de Resido *</Text>
          <View style={styles.volumeOptions}>
            {wasteTypes.map((type) => (
              <TouchableOpacity
                key={type.id_tipo_residuo}
                style={[styles.volumeOption, selectedWasteType === type.descricao && styles.selectedOption]}
                onPress={() => setSelectedWasteType(type.descricao)}
              >
                <Text style={[styles.optionText, selectedWasteType === type.descricao && styles.selectedOptionText]}>
                  {type.descricao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Digite o tipo de resido"
            value={customWasteType}
            onChangeText={setCustomWasteType}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Data de Coleta *</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 09/09/2024"
                  value={collectionDate}
                  editable={false}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Horário *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 14:00"
                value={collectionTime}
                onChangeText={setCollectionTime}
              />
            </View>
          </View>

          <Text style={styles.label}>Endereço *</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua, nº"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Descrição dos Itens *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Detalhe os itens aqui..."
            value={materialDescription}
            onChangeText={setMaterialDescription}
            multiline
          />

          <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
            <View style={styles.button}>
              <Text style={styles.saveButtonText}>Realizar Pedido</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2E8B57' },
  scrollContainer: { alignItems: 'center', paddingBottom: 30 },
  header: { width: '100%', paddingTop: 50, paddingBottom: 20, alignItems: 'center' },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subHeaderText: { color: '#fff', fontSize: 16, marginTop: 5, textAlign: 'center' },
  profileBox: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 10 },
  volumeOptions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' },
  volumeOption: { flex: 1, marginHorizontal: 4, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CED4DA', backgroundColor: '#FFFFFF', alignItems: 'center', marginBottom: 6 },
  selectedOption: { backgroundColor: '#83D07F', borderColor: '#83D07F' },
  optionText: { fontSize: 16, fontWeight: '600', color: '#333' },
  selectedOptionText: { color: '#FFFFFF' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  column: { flex: 1 },
  saveButton: { borderRadius: 10, marginTop: 20, overflow: 'hidden', width: '100%' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
