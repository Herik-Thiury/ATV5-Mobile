import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, StatusBar, ScrollView, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [quotations, setQuotations] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');
  
  const { width } = useWindowDimensions();
  const isTablet = width > 600; 

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const [resUSD, resEUR] = await Promise.all([
        axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD'),
        axios.get('https://api.coinbase.com/v2/exchange-rates?currency=EUR')
      ]);

      const valorDolar = resUSD.data.data.rates.BRL;
      const valorEuro = resEUR.data.data.rates.BRL;

      setQuotations({
        USDBRL: { bid: valorDolar },
        EURBRL: { bid: valorEuro }
      });
      
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar as cotações.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.replace('Login');
      } else {
        navigation.replace('Login');
      }
    });
  };

  if (loading && !quotations) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Buscando cotações...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Wrapper dinâmico: Centraliza e limita a largura em Tablets */}
      <View style={[styles.innerContainer, { maxWidth: isTablet ? 500 : '100%' }]}>
        
        <Text style={styles.title}>Cotação de Moedas</Text>
        <Text style={styles.subtitle}>
          {lastUpdate ? `Última atualização em: ${lastUpdate}` : 'Aguardando atualização...'}
        </Text>

        {/* Card Dólar */}
        {quotations?.USDBRL && (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.flagContainer}>
                <Text style={styles.flagEmoji}>🇺🇸</Text>
              </View>
              <View style={styles.currencyDetails}>
                <Text style={styles.currencyName}>Dólar Comercial</Text>
                <Text style={styles.currencyCode}>USD</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.brlLabel}>BRL</Text>
              <Text style={styles.value}>
                {parseFloat(quotations.USDBRL.bid).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        )}

        {/* Card Euro */}
        {quotations?.EURBRL && (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.flagContainer}>
                <Text style={styles.flagEmoji}>🇪🇺</Text>
              </View>
              <View style={styles.currencyDetails}>
                <Text style={styles.currencyName}>Euro</Text>
                <Text style={styles.currencyCode}>EUR</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.brlLabel}>BRL</Text>
              <Text style={styles.value}>
                {parseFloat(quotations.EURBRL.bid).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        )}

        {!quotations && !loading && (
          <Text style={styles.errorText}>Falha ao carregar dados.</Text>
        )}

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={fetchQuotations}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Atualizando...' : 'Atualizar Cotações'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    backgroundColor: '#F5F5F5', 
    alignItems: 'center', 
    paddingTop: 60,
    paddingBottom: 30 
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#8E8E93', marginBottom: 40, textAlign: 'center' },
  
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  flagContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flagEmoji: { fontSize: 24 },
  currencyDetails: { justifyContent: 'center' },
  currencyName: { fontSize: 17, fontWeight: '700', color: '#000', marginBottom: 2 },
  currencyCode: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
  
  cardRight: { alignItems: 'flex-end', justifyContent: 'center' },
  brlLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '600', marginBottom: -2 },
  value: { fontSize: 34, fontWeight: 'bold', color: '#2E7D32' }, 
  
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 17 },
  
  errorText: { color: '#D32F2F', marginBottom: 20, fontSize: 15, fontWeight: '500' },
  logoutButton: { marginTop: 25, padding: 10 },
  logoutText: { color: '#8E8E93', fontSize: 15, fontWeight: '600' }
});