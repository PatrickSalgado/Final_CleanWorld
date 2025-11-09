import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function EnterpriseMenu({ navigation }) {
  const { idCollector } = useContext(AppContext);

  const [stats, setStats] = useState({
    totalVehiclesRegistered: 0,
    totalOrdersAccepted: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idCollector) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const [registerVehicle, registerOrder] = await Promise.all([
          axios.get(` https://84975bd346fc.ngrok-free.app/api/registerVehicle/count/${idCollector}`),
          axios.get(` https://84975bd346fc.ngrok-free.app/api/registerOrder/status/count/${idCollector}`)
        ]);

    setStats({
  totalVehiclesRegistered: registerVehicle.data.totalVehiclesRegistered || 0,
  totalOrdersAccepted: registerOrder.data.totalOrders || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    Alert.alert('Erro', 'Não foi possível carregar as estatísticas. Tente novamente.');
  } finally {
    setLoading(false);
  }
};

    fetchStats();
  }, [idCollector]);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" style={styles.loadingIndicator} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.exitIcon}
        onPress={handleLogout}
        accessibilityLabel="Ícone de logout"
        accessibilityHint="Sai da conta e retorna para a tela de login"
      >
        <Icon name="logout" size={28} color="#2d3436" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.welcomeText}>Menu da Empresa</Text>

        <View
          style={styles.whiteBox}
          accessible
          accessibilityLabel={`Total de veículos registrados: ${stats.totalVehiclesRegistered}`}
        >
          <Text style={styles.boxTitle}>Veículos Registrados</Text>
          <Text style={styles.boxText}>{stats.totalVehiclesRegistered}</Text>
        </View>

        <View
          style={styles.whiteBox}
          accessible
          accessibilityLabel={`Total de pedidos aceitos: ${stats.totalOrdersAccepted}`}
        >
          <Text style={styles.boxTitle}>Pedidos Aceitos</Text>
          <Text style={styles.boxText}>{stats.totalOrdersAccepted}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { padding: 20 },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 60,
  },
  whiteBox: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#27ae60',
    marginBottom: 10,
  },
  boxText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  loadingText: {
    color: '#2d3436',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 40,
  },
  exitIcon: {
    position: 'absolute',
    top: 40,
    left: 8,
    backgroundColor: '#e0e0e0',
    padding: 6,
    borderRadius: 50,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
