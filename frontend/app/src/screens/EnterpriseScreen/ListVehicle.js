import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Alert } from 'react-native';

export default function ListVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { idCollector } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updatedVehicle, setUpdatedVehicle] = useState({
    carBrand: '',
    carModel: '',
    carLicensePlate: '',
    volumeSize: '',
    maximumWeight: '',
  });

  const getVehicles = async () => {
    setLoading(true);
    if (!idCollector) {
      Alert.alert("Erro", "ID da empresa não encontrado. Por favor, faça login novamente.");
      setVehicles([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/registerVehicle`, {
        params: { idCollector }
      });
      if (!Array.isArray(response.data)) {
        console.warn("Resposta da API não é um array:", response.data);
        setVehicles([]);
        Alert.alert("Erro", "Formato de dados inválido retornado pelo servidor.");
      } else {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setVehicles([]);
      Alert.alert("Erro", "Não foi possível carregar os veículos cadastrados.");
    }
    setLoading(false);
  };

  const openUpdateModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdatedVehicle({
      carBrand: vehicle.carBrand || '',
      carModel: vehicle.carModel || '',
      carLicensePlate: vehicle.carLicensePlate || '',
      volumeSize: vehicle.volumeSize || '',
      maximumWeight: vehicle.maximumWeight ? String(vehicle.maximumWeight) : '',
    });
    setModalVisible(true);
  };

  const saveVehicleChanges = async () => {
    if (!selectedVehicle) {
      Alert.alert("Erro", "Nenhum veículo selecionado.");
      setModalVisible(false);
      return;
    }

    // Validações
    if (!updatedVehicle.carBrand) {
      Alert.alert("Erro", "A marca do veículo é obrigatória.");
      return;
    }
    if (!updatedVehicle.carLicensePlate) {
      Alert.alert("Erro", "A placa do veículo é obrigatória.");
      return;
    }
    if (!updatedVehicle.volumeSize) {
      Alert.alert("Erro", "A capacidade é obrigatória.");
      return;
    }
    if (!updatedVehicle.maximumWeight || isNaN(parseInt(updatedVehicle.maximumWeight)) || parseInt(updatedVehicle.maximumWeight) <= 0) {
      Alert.alert("Erro", "O peso máximo deve ser um número inteiro maior que zero.");
      return;
    }

    try {
      const response = await axios.put(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/registerVehicle/${selectedVehicle.idRegisterVehicle}`, {
        carBrand: updatedVehicle.carBrand,
        carModel: updatedVehicle.carModel || null,
        carLicensePlate: updatedVehicle.carLicensePlate,
        volumeSize: updatedVehicle.volumeSize,
        maximumWeight: parseInt(updatedVehicle.maximumWeight),
      });
      if (response.data) {
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.idRegisterVehicle === selectedVehicle.idRegisterVehicle ? response.data : vehicle
          )
        );
        Alert.alert("Sucesso", "Veículo atualizado com sucesso!");
        setModalVisible(false);
      } else {
        Alert.alert("Erro", "Nenhum dado retornado pela API.");
      }
    } catch (error) {
      console.error("Erro ao atualizar veículo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Alert.alert("Erro", error.response?.data?.message || "Não foi possível atualizar o veículo.");
    }
  };

  const filterVehicles = (idCollector) => {
    if (!Array.isArray(vehicles)) {
      console.warn("Veículos não é um array:", vehicles);
      return [];
    }
    const filtered = idCollector ? vehicles.filter(vehicle => vehicle.idCollector === idCollector) : [];
    if (filtered.length === 0 && vehicles.length > 0) {
      console.warn("Nenhum veículo encontrado para idCollector:", idCollector);
    }
    return filtered;
  };

  useEffect(() => {
    console.log("idCollector:", idCollector);
    getVehicles();
  }, [idCollector]);

  const filteredVehicles = filterVehicles(idCollector);

  const onRefresh = async () => {
    setRefreshing(true);
    await getVehicles();
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2F855A" />
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Veículos Cadastrados</Text>

        <TouchableOpacity style={styles.updateButton} onPress={onRefresh}>
          <Text style={styles.updateButtonText}>Atualizar</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2F855A" />
            <Text style={styles.loadingText}>Carregando veículos...</Text>
          </View>
        ) : filteredVehicles.length === 0 ? (
          <Text style={styles.noVehiclesText}>Nenhum veículo cadastrado encontrado.</Text>
        ) : (
          filteredVehicles.map((vehicle) => (
            <View key={String(vehicle.idRegisterVehicle)} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.vehicleText}>{vehicle.carBrand || 'N/A'}</Text>
                <Text style={styles.plateText}>{vehicle.carLicensePlate || 'N/A'}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Modelo: </Text>{vehicle.carModel || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Marca: </Text>{vehicle.carBrand || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Placa: </Text>{vehicle.carLicensePlate || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Capacidade: </Text>{vehicle.volumeSize || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Peso Máximo: </Text>{vehicle.maximumWeight || 'N/A'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cardUpdateButton}
                onPress={() => openUpdateModal(vehicle)}
              >
                <Text style={styles.cardUpdateButtonText}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Veículo</Text>
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={updatedVehicle.carBrand}
              onChangeText={(text) => setUpdatedVehicle({ ...updatedVehicle, carBrand: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Modelo"
              value={updatedVehicle.carModel}
              onChangeText={(text) => setUpdatedVehicle({ ...updatedVehicle, carModel: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Placa"
              value={updatedVehicle.carLicensePlate}
              onChangeText={(text) => setUpdatedVehicle({ ...updatedVehicle, carLicensePlate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Capacidade (m³)"
              value={updatedVehicle.volumeSize}
              onChangeText={(text) => setUpdatedVehicle({ ...updatedVehicle, volumeSize: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso Máximo (kg)"
              value={updatedVehicle.maximumWeight}
              onChangeText={(text) => setUpdatedVehicle({ ...updatedVehicle, maximumWeight: text })}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={saveVehicleChanges}>
                <Text style={styles.saveButtonText}>Salvar Alteração</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#2F855A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#2F855A',
    marginTop: 10,
  },
  noVehiclesText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  plateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F855A',
  },
  cardBody: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 5,
  },
  bold: {
    fontWeight: '600',
    color: '#2F855A',
  },
  cardUpdateButton: {
    backgroundColor: '#2F855A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardUpdateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1, // Fixed: Use a numeric value for borderWidth
    borderColor: '#D1D5DB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#2F855A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});