import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import { AppContext } from '../../context/AppContext';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const { idCollector } = useContext(AppContext);

  const getOrders = async () => {
    if (!idCollector) {
      Alert.alert("Erro", "ID do coletor não encontrado. Por favor, faça login novamente.");
      setOrders([]);
      return;
    }

    try {
      const response = await axios.get(`https://2a600c282efc.ngrok-free.app/api/registerOrder`, {
        params: { idCollector }
      });
      const data = response.data;
      console.log("Dados recebidos da API:", data);
      const filteredOrders = Array.isArray(data) ? data.filter(order => order.status !== 1) : [];
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error.response?.data || error.message);
      setOrders([]);
      Alert.alert("Erro", "Não foi possível carregar os pedidos.");
    }
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  const formatDateForBackend = (date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  useEffect(() => {
    getOrders();
  }, [idCollector]);

  const handleAccept = async (order) => {
    console.log("Pedido selecionado para aceitar:", order);
    const orderId = order.idRegisterOrder || order.idregisterOrder;
    if (!orderId) {
      Alert.alert("Erro", "ID do pedido não encontrado.");
      return;
    }
    if (order.idCollector) {
      Alert.alert("Erro", "Este pedido já foi aceito por outro coletor.");
      return;
    }

    try {
      const formattedDate = formatDateForBackend(order.collectionDate);

      const payload = {
        quantityVolume: order.quantityVolume,
        volumeSize: order.volumeSize,
        collectionDate: formattedDate,
        collectionTime: order.collectionTime,
        address: order.address,
        materialDescription: order.materialDescription,
        status: 1,
        idUser: order.idUser,
        idCollector: idCollector,
      };

      console.log("Dados enviados na requisição PUT:", payload);

      await axios.put(`https://2a600c282efc.ngrok-free.app/api/registerOrder/${orderId}`, payload);

      Alert.alert("Pedido aceito", "Você aceitou o pedido com sucesso!");

      // Remove o pedido aceito da lista local
      setOrders(prevOrders =>
        prevOrders.filter(o => (o.idRegisterOrder || o.idregisterOrder) !== orderId)
      );
    } catch (error) {
      console.error("Erro ao aceitar pedido:", error.response?.data || error.message);
      Alert.alert("Erro", `Não foi possível aceitar o pedido. Detalhes: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleReject = async (order) => {
    console.log("Pedido selecionado para recusar:", order);
    const orderId = order.idRegisterOrder || order.idregisterOrder;
    if (!orderId) {
      Alert.alert("Erro", "ID do pedido não encontrado.");
      return;
    }

    try {
      await axios.post(`https://2a600c282efc.ngrok-free.app/api/registerOrder/${orderId}/reject`, {
        idCollector
      });

      Alert.alert("Pedido recusado", "Você recusou o pedido com sucesso!");

      // Remove o pedido recusado da lista local
      setOrders(prevOrders =>
        prevOrders.filter(o => (o.idRegisterOrder || o.idregisterOrder) !== orderId)
      );
    } catch (error) {
      console.error("Erro ao recusar pedido:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível recusar o pedido.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pedidos disponíveis</Text>

      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>Nenhum pedido disponível no momento.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.idRegisterOrder || order.idregisterOrder} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{formatDate(order.collectionDate)}</Text>
              <Text style={styles.timeText}>{order.collectionTime}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.label}>
                <Text style={styles.bold}>Nome:</Text> {order.name}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>Endereço:</Text> {order.address}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>Telefone:</Text> {order.phone}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>Descrição:</Text> {order.materialDescription}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>Quantidade:</Text> {order.quantityVolume}
              </Text>
              <Text style={styles.label}>
                <Text style={styles.bold}>Tamanho:</Text> {order.volumeSize}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.acceptButton, order.idCollector && styles.acceptButtonDisabled]}
                onPress={() => handleAccept(order)}
                disabled={!!order.idCollector}
              >
                <Text style={styles.buttonText}>Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(order)}
              >
                <Text style={styles.buttonText}>Recusar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 20,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#2D3748',
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
    color: '#2F855A',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#38A169',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  acceptButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  rejectButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
