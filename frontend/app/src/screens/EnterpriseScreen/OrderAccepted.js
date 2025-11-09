import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import { AppContext } from '../../context/AppContext';

export default function OrderAccepted() {
  const [orders, setOrders] = useState([]);
  const { idCollector, orderAcceptedFlag } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

  const getOrders = async () => {
    if (!idCollector) {
      Alert.alert("Erro", "ID do coletor não encontrado. Por favor, faça login novamente.");
      setOrders([]);
      return;
    }

    try {
      const response = await axios.get(` https://84975bd346fc.ngrok-free.app/api/registerOrder`, {
        params: { idCollector }
      });
      const data = response.data || [];
      const acceptedOrders = data.filter(order => order.idCollector === idCollector && order.status === 1);
      setOrders(acceptedOrders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error.response?.data || error.message);
      setOrders([]);
      Alert.alert("Erro", "Não foi possível carregar os pedidos aceitos.");
    }
  };

  useEffect(() => {
    getOrders();
  }, [idCollector, orderAcceptedFlag]);

  const formatDate = (date) => date ? format(new Date(date), 'dd/MM/yyyy') : '';

  const onRefresh = async () => {
    setRefreshing(true);
    await getOrders();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2F855A" />
      }
    >
      <Text style={styles.title}>Pedidos Aceitos</Text>

      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>Nenhum pedido aceito encontrado.</Text>
      ) : (
        orders.map(order => (
          <View key={order.idRegisterOrder} style={styles.card}>
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
});
