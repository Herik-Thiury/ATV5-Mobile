import axios from 'axios';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [quotations, setQuotations] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      // Consumindo Dólar e Euro simultaneamente
      const response = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL');
      setQuotations(response.data);
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);

  const handleLogout = () => {
    signOut(auth).then(() => navigation.replace('Login'));
  };

  if (loading && !quotations) return <ActivityIndicator size="large" style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cotação de Moedas</Text>
      <Text style={styles.subtitle}>Última atualização em: {lastUpdate}</Text>

      {/* Card Dólar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.currencyName}>Dólar Comercial</Text>
          <Text style={styles.currencyCode}>USD</Text>
        </View>
        <Text style={styles.value}>R$ {parseFloat(quotations.USDBRL.bid).toFixed(2)}</Text>
      </View>

      {/* Card Euro */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.currencyName}>Euro</Text>
          <Text style={styles.currencyCode}>EUR</Text>
        </View>
        <Text style={styles.value}>R$ {parseFloat(quotations.EURBRL.bid).toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchQuotations}>
        <Text style={styles.buttonText}>Atualizar Cotações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={{marginTop: 20}}>
        <Text style={{color: 'red'}}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 30 },
  card: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  currencyName: { fontSize: 18, fontWeight: '600' },
  currencyCode: { color: '#999' },
  value: { fontSize: 32, fontWeight: 'bold', color: '#2E7D32' },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});