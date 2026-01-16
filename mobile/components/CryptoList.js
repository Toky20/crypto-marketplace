// import React, { useState, useEffect } from 'react';
// import { View, FlatList, Text, StyleSheet } from 'react-native';
// import { firebase } from '../firebase'; // Assurez-vous que le chemin est correct
// import { getAuth } from "firebase/auth";


// const CryptoList = ({ navigation }) => {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//     });
//     return unsubscribeAuth; // Nettoyage de l'écouteur d'authentification
//   }, []);

//   useEffect(() => {
//     if (userEmail) {
//       const cryptosRef = firebase.firestore().collection('cryptousers');

//       // Écoute en temps réel des modifications de la collection
//       const unsubscribeCryptos = cryptosRef
//         .where('email', '==', userEmail) // Filtrer par email
//         .onSnapshot((snapshot) => {
//           const updatedCryptoData = snapshot.docs.map((doc) => doc.data());
//           setCryptoData(updatedCryptoData);
//         }, (error) => {
//           console.error("Erreur lors de la récupération des cryptos : ", error);
//         });

//       return unsubscribeCryptos; // Nettoyage de l'écouteur Firestore
//     } else {
//       setCryptoData([]); // Réinitialiser si l'utilisateur n'est pas connecté
//     }
//   }, [userEmail]); // Le useEffect se déclenche quand userEmail change

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mes Cryptomonnaies</Text>
//       <FlatList
//         data={cryptoData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.cryptoItem}>
//             <Text>{item.crypto}</Text>
//             <Text>Quantité : {item.qte}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   cryptoItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
// });

// export default CryptoList;

// import React, { useState, useEffect } from 'react';
// import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { firebase } from '../firebase'; // Assurez-vous que le chemin est correct
// import { getAuth } from "firebase/auth";


// const CryptoList = ({ navigation }) => {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//     });
//     return unsubscribeAuth; // Nettoyage de l'écouteur d'authentification
//   }, []);

//   useEffect(() => {
//     if (userEmail) {
//       const cryptosRef = firebase.firestore().collection('cryptousers');

//       // Écoute en temps réel des modifications de la collection
//       const unsubscribeCryptos = cryptosRef
//         .where('email', '==', userEmail) // Filtrer par email
//         .onSnapshot((snapshot) => {
//           const updatedCryptoData = snapshot.docs.map((doc) => doc.data());
//           setCryptoData(updatedCryptoData);
//         }, (error) => {
//           console.error("Erreur lors de la récupération des cryptos : ", error);
//         });

//       return unsubscribeCryptos; // Nettoyage de l'écouteur Firestore
//     } else {
//       setCryptoData([]); // Réinitialiser si l'utilisateur n'est pas connecté
//     }
//   }, [userEmail]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mes Cryptomonnaies</Text>
      
//       <View style={styles.tableHeader}>
//         <Text style={styles.tableHeaderText}>Cryptomonnaie</Text>
//         <Text style={styles.tableHeaderText}>Quantité</Text>
//       </View>

//       <FlatList
//         data={cryptoData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.tableRow}>
//             <Text style={styles.tableCell}>{item.crypto}</Text>
//             <Text style={styles.tableCell}>{item.qte}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',  // Fond sombre
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF', // Texte en blanc pour le contraste
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//     paddingBottom: 8,
//     marginBottom: 16,
//   },
//   tableHeaderText: {
//     fontSize: 18,
//     color: '#F7931A', // Jaune/orange pour la lisibilité
//     fontWeight: 'bold',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//   },
//   tableCell: {
//     fontSize: 16,
//     color: '#FFFFFF',  // Texte en blanc pour le contraste
//   },
// });

// export default CryptoList;

// import React, { useState, useEffect } from 'react';
// import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { firebase } from '../firebase'; // Assurez-vous que le chemin est correct
// import { getAuth } from "firebase/auth";
// import { MaterialIcons } from '@expo/vector-icons'; // Importation de MaterialIcons


// const CryptoList = ({ navigation }) => {
//   const [cryptoData, setCryptoData] = useState([]);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//     });
//     return unsubscribeAuth; // Nettoyage de l'écouteur d'authentification
//   }, []);

//   useEffect(() => {
//     if (userEmail) {
//       const cryptosRef = firebase.firestore().collection('cryptousers');

//       // Écoute en temps réel des modifications de la collection
//       const unsubscribeCryptos = cryptosRef
//         .where('email', '==', userEmail) // Filtrer par email
//         .onSnapshot((snapshot) => {
//           const updatedCryptoData = snapshot.docs.map((doc) => doc.data());
//           setCryptoData(updatedCryptoData);
//         }, (error) => {
//           console.error("Erreur lors de la récupération des cryptos : ", error);
//         });

//       return unsubscribeCryptos; // Nettoyage de l'écouteur Firestore
//     } else {
//       setCryptoData([]); // Réinitialiser si l'utilisateur n'est pas connecté
//     }
//   }, [userEmail]);

//   return (
//     <View style={styles.container}>
//       {/* Bouton retour */}
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AddWalletTransaction')}>
//         <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
//       </TouchableOpacity>

//       <Text style={styles.title}>Mes Cryptomonnaies</Text>

//       <View style={styles.tableHeader}>
//         <Text style={styles.tableHeaderText}>Cryptomonnaie</Text>
//         <Text style={styles.tableHeaderText}>Quantité</Text>
//       </View>

//       <FlatList
//         data={cryptoData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.tableRow}>
//             <Text style={styles.tableCell}>{item.crypto}</Text>
//             <Text style={styles.tableCell}>{item.qte}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',  // Fond sombre
//     padding: 16,
//     marginTop: 79
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF', // Texte en blanc pour le contraste
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40, // Positionné en haut de l'écran
//     left: 16, // Décalé sur la gauche
//     zIndex: 1, // Pour s'assurer qu'il est visible au-dessus des autres éléments
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//     paddingBottom: 8,
//     marginBottom: 16,
//   },
//   tableHeaderText: {
//     fontSize: 18,
//     color: '#F7931A', // Jaune/orange pour la lisibilité
//     fontWeight: 'bold',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//   },
//   tableCell: {
//     fontSize: 16,
//     color: '#FFFFFF',  // Texte en blanc pour le contraste
//   },
// });

// export default CryptoList;

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase'; // Assurez-vous que le chemin est correct
import { getAuth } from "firebase/auth";
import { MaterialIcons } from '@expo/vector-icons'; // Importation de MaterialIcons
import cryptoIcons from './cryptoIcons';  // Assurez-vous d'importer le mappage des icônes

const CryptoList = ({ navigation }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
    });
    return unsubscribeAuth; // Nettoyage de l'écouteur d'authentification
  }, []);

  useEffect(() => {
    if (userEmail) {
      const cryptosRef = firebase.firestore().collection('cryptousers');

      // Écoute en temps réel des modifications de la collection
      const unsubscribeCryptos = cryptosRef
        .where('email', '==', userEmail) // Filtrer par email
        .onSnapshot((snapshot) => {
          const updatedCryptoData = snapshot.docs.map((doc) => doc.data());
          setCryptoData(updatedCryptoData);
        }, (error) => {
          console.error("Erreur lors de la récupération des cryptos : ", error);
        });

      return unsubscribeCryptos; // Nettoyage de l'écouteur Firestore
    } else {
      setCryptoData([]); // Réinitialiser si l'utilisateur n'est pas connecté
    }
  }, [userEmail]);

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AddWalletTransaction')}>
        <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
      </TouchableOpacity>

      <Text style={styles.title}>Mes Cryptomonnaies</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Cryptomonnaie</Text>
        <Text style={styles.tableHeaderText}>Quantité</Text>
      </View>

      <FlatList
        data={cryptoData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            {/* Affichage de l'icône et du nom de la crypto */}
            <View style={styles.rowContent}>
              <View style={styles.iconContainer}>
                {cryptoIcons[item.crypto]}  {/* L'icône de la crypto */}
              </View>
              <Text style={styles.tableCell}>{item.crypto}</Text>  {/* Le nom de la crypto */}
            </View>
            <Text style={styles.tableCell}>{item.qte}</Text>  {/* Quantité */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',  // Fond sombre
    padding: 16,
    marginTop: 79,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texte en blanc pour le contraste
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Positionné en haut de l'écran
    left: 16, // Décalé sur la gauche
    zIndex: 1, // Pour s'assurer qu'il est visible au-dessus des autres éléments
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
    marginBottom: 16,
  },
  tableHeaderText: {
    fontSize: 18,
    color: '#F7931A', // Jaune/orange pour la lisibilité
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  rowContent: {
    flexDirection: 'row',  // Disposition horizontale pour l'icône et le nom
    alignItems: 'center',  // Centrer verticalement
  },
  iconContainer: {
    marginRight: 10,  // Espacement entre l'icône et le nom
  },
  tableCell: {
    fontSize: 16,
    color: '#FFFFFF',  // Texte en blanc pour le contraste
  },
});

export default CryptoList;
