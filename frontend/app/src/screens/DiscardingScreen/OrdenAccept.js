import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';
import { AppContext } from '../../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient'; // Importar aqui

export default function OrdenAccept() {
  const { idUser } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRegisteredOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/registerOrder/${idUser}/all`);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
        Alert.alert("Erro", "Resposta inesperada da API");
      }
    } catch (error) {
      setOrders([]);
      Alert.alert("Erro", "Não foi possível carregar os pedidos");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), 'dd/MM/yyyy') : '';
  };

  useEffect(() => {
    fetchRegisteredOrders();
  }, [idUser]);

  return (
    <LinearGradient
      colors={['#3CB371', '#2E8B57']} // mesmo gradiente da primeira tela
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pedidos Realizados</Text>

        {loading ? (
          <Text style={styles.noOrdersText}>Carregando pedidos...</Text>
        ) : orders.length === 0 ? (
          <Text style={styles.noOrdersText}>Nenhum pedido encontrado.</Text>
        ) : (
          orders.map((order) => (
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
                  <Text style={styles.bold}>Status:</Text>{' '}
                  <Text style={order.status === 1 ? styles.accepted : styles.notAccepted}>
                    {order.status === 1 ? 'Aceito' : 'Pendente'}
                  </Text>
                </Text>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={fetchRegisteredOrders} disabled={loading}>
          <Text style={styles.refreshButtonText}>{loading ? 'Atualizando...' : 'Atualizar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,              // ocupar toda a tela para o gradiente preencher
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
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
  accepted: {
    color: 'green',
    fontWeight: 'bold',
  },
  notAccepted: {
    color: 'red',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#43a047',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
