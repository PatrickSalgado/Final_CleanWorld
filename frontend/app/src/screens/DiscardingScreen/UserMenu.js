import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function UserMenu({ navigation }) {
  const { idUser, setIdUser } = useContext(AppContext);

  const [stats, setStats] = useState({ totalRegistered: 0, totalAccepted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idUser) return;

    const fetchStats = async () => {
      try {
        const [acceptedResponse, registeredResponse] = await Promise.all([
            axios.get(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/user/total/${idUser}`),
            axios.get(`https://subattenuated-epithetically-eryn.ngrok-free.dev/api/registerOrder/count/stats/${idUser}`)
      ]);
        setStats({
          totalRegistered: registeredResponse.data.totalRegistered || 0,
          totalAccepted: acceptedResponse.data.totalAccepted || 0
        });
      } catch (error) {
        console.error('Erro ao buscar stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [idUser]);

  const handleLogout = () => {
    setIdUser('');
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <LinearGradient colors={['#3CB371', '#2E8B57']} style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#3CB371', '#2E8B57']} style={styles.container}>
      <TouchableOpacity
        style={styles.exitIcon}
        onPress={handleLogout}
        accessibilityLabel="Ícone de logout"
        accessibilityHint="Sai da conta e retorna para a tela de login"
      >
        <Icon name="logout" size={28} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.welcomeText}>Seu Menu Inicial</Text>

        <View style={styles.whiteBox}>
          <Text style={styles.boxTitle}>Materiais Registrados</Text>
          <Text style={styles.boxText}>{stats.totalRegistered}</Text>
        </View>

        <View style={styles.whiteBox}>
          <Text style={styles.boxTitle}>Materiais Aceitos</Text>
          <Text style={styles.boxText}>{stats.totalAccepted}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 60,
  },
  whiteBox: {
    backgroundColor: '#ffffffee',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 10,
  },
  boxText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  exitIcon: {
    position: 'absolute',
    top: 40,
    left: 8,
    backgroundColor: '#1b5e20',
    padding: 5,
    borderRadius: 50,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
