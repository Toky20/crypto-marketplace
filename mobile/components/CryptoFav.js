import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { firebase } from "../firebase";
import { getAuth } from "firebase/auth";
import cryptoIcons from './cryptoIcons';  // Importation des icônes

const initialCryptoList = [
  { id: 1, name: "BITCOIN", status: "not favorite" },
  { id: 2, name: "ETHEREUM", status: "not favorite" },
  { id: 3, name: "CARDANO", status: "not favorite" },
  { id: 4, name: "XPR", status: "not favorite" },
  { id: 5, name: "SOLANA", status: "not favorite" },
  { id: 6, name: "LITECOIN", status: "not favorite" },
  { id: 7, name: "DOGECOIN", status: "not favorite" },
  { id: 8, name: "AVALANCHE", status: "not favorite" },
  { id: 9, name: "RAVENCOIN", status: "not favorite" },
  { id: 10, name: "ATOM", status: "not favorite" },
];

const CryptoFav = ({ navigation }) => {
  const [cryptoList, setCryptoList] = useState(initialCryptoList);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
    });
    loadFavorites();
    return unsubscribeAuth;
  }, [userEmail]);

  const loadFavorites = async () => {
    try {
      const favoritesSnapshot = await firebase
        .firestore()
        .collection('cryptoFavori')
        .where('user', '==', userEmail)
        .get();

      if (!favoritesSnapshot.empty) {
        const userFavorites = {};
        favoritesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === 'favorite') {
            userFavorites[data.id_crypto] = data.status;
          }
        });

        setCryptoList(prevList =>
          prevList.map(crypto => ({
            ...crypto,
            status: userFavorites[crypto.id] || crypto.status
          }))
        );
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const cryptoRef = firebase
        .firestore()
        .collection('cryptoFavori')
        .doc(`${userEmail}_${id}`);

      const cryptoDoc = await cryptoRef.get();
      const isCurrentlyFavorite = cryptoList.find(c => c.id === id).status === "favorite";

      if (cryptoDoc.exists) {
        if (isCurrentlyFavorite) {
          await cryptoRef.update({
            status: 'removed',
            updated_at: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      } else {
        if (!isCurrentlyFavorite) {
          await cryptoRef.set({
            user: userEmail,
            id_crypto: id,
            status: 'favorite',
          });
        }
      }

      setCryptoList(prevList =>
        prevList.map(crypto =>
          crypto.id === id
            ? { ...crypto, status: isCurrentlyFavorite ? "not favorite" : "favorite" }
            : crypto
        )
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()} // Retour à l'écran précédent
      >
        <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
      </TouchableOpacity>

      <Text style={styles.title}>Cryptomonnaies Favoris</Text>

      <FlatList
        data={cryptoList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.iconContainer}>
                {cryptoIcons[item.name]}  {/* Affichage de l'icône */}
              </View>
              <Text style={styles.cryptoName}>{item.name}</Text>  {/* Affichage du nom */}
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <MaterialIcons name="star" size={30} color={item.status === "favorite" ? "gold" : "gray"} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    marginTop: 79
  },
  backButton: {
    position: 'absolute',
    top: 40, // Positionné en haut de l'écran
    left: 16, // Décalé sur la gauche
    zIndex: 1, // Pour s'assurer qu'il est visible au-dessus des autres éléments
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    backgroundColor: "#333",
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,  // Un petit espace entre l'icône et le nom
  },
  cryptoName: {
    fontSize: 18,
    color: '#fff',
  },
});

export default CryptoFav;
