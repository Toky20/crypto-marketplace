// import React, { useState, useEffect } from 'react';
// import { View, FlatList, Text, StyleSheet } from 'react-native';
// import { firebase } from '../firebase';
// import { getAuth } from "firebase/auth";
// import moment from 'moment'; // Importez moment pour formater les dates

// const TransactionList = ({navigation}) => {
//   const [transactions, setTransactions] = useState([]);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//     });
//     return unsubscribeAuth;
//   }, []);

//   useEffect(() => {
//     if (userEmail) {
//       const transactionsRef = firebase.firestore().collection('cryptotransactions');

//       const unsubscribeTransactions = transactionsRef
//         .where('email', '==', userEmail)
//         .orderBy('date', 'desc') // Ordonner par date (du plus récent au plus ancien)
//         .onSnapshot((snapshot) => {
//           const updatedTransactions = snapshot.docs.map((doc) => {
//             const data = doc.data();
//             return {
//               ...data,
//               date: data.date.toDate(), // Convertir Timestamp Firestore en Date JS
//             };
//           });
//           setTransactions(updatedTransactions);
//         }, (error) => {
//           console.error("Erreur lors de la récupération des transactions : ", error);
//         });

//       return unsubscribeTransactions;
//     } else {
//       setTransactions([]);
//     }
//   }, [userEmail]);

//   const renderTransactionItem = ({ item }) => (
//     <View style={styles.transactionItem}>
//       <Text>{item.crypto}</Text>
//       <Text>{item.transaction} {item.qte}</Text>
//       <Text>Montant: {item.montant}</Text>
//       <Text>PU: {item.pu}</Text>
//       <Text>Date: {moment(item.date).format('DD/MM/YYYY HH:mm')}</Text> {/* Formater la date */}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mes Transactions</Text>
//       <FlatList
//         data={transactions}
//         renderItem={renderTransactionItem}
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
//   transactionItem: {
//     backgroundColor: '#f0f0f0', // Couleur de fond pour les éléments
//     padding: 10,
//     marginBottom: 8,
//     borderRadius: 5,
//   },
// });

// export default TransactionList;

// import React, { useState, useEffect } from 'react';
// import { View, FlatList, Text, StyleSheet } from 'react-native';
// import { firebase } from '../firebase';
// import { getAuth } from "firebase/auth";
// import moment from 'moment'; // Importez moment pour formater les dates

// const TransactionList = ({navigation}) => {
//   const [transactions, setTransactions] = useState([]);
//   const [userEmail, setUserEmail] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//     });
//     return unsubscribeAuth;
//   }, []);

//   useEffect(() => {
//     if (userEmail) {
//       const transactionsRef = firebase.firestore().collection('cryptotransactions');

//       const unsubscribeTransactions = transactionsRef
//         .where('email', '==', userEmail)
//         .orderBy('date', 'desc') // Ordonner par date (du plus récent au plus ancien)
//         .onSnapshot((snapshot) => {
//           const updatedTransactions = snapshot.docs.map((doc) => {
//             const data = doc.data();
//             return {
//               ...data,
//               date: data.date.toDate(), // Convertir Timestamp Firestore en Date JS
//             };
//           });
//           setTransactions(updatedTransactions);
//         }, (error) => {
//           console.error("Erreur lors de la récupération des transactions : ", error);
//         });

//       return unsubscribeTransactions;
//     } else {
//       setTransactions([]);
//     }
//   }, [userEmail]);

//   const renderTransactionItem = ({ item }) => (
//     <View style={styles.transactionItem}>
//       <Text style={styles.transactionCell}>Crypto: {item.crypto}</Text>
//       <Text style={styles.transactionCell}>{item.transaction} de {item.qte}</Text>
//       <Text style={styles.transactionCell}>Montant: {item.montant} $</Text>
//       <Text style={styles.transactionCell}>Prix Unitaire: {item.pu} $</Text>
//       <Text style={styles.transactionCell}>Date: {moment(item.date).format('DD/MM/YYYY HH:mm')}</Text> {/* Formater la date */}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mes Transactions</Text>
      
//       <View style={styles.tableHeader}>
//         <Text style={styles.tableHeaderText}>Détails de vos transactions</Text>
//       </View>

//       <FlatList
//         data={transactions}
//         renderItem={renderTransactionItem}
//         keyExtractor={(item, index) => index.toString()}
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
//   transactionItem: {
//     backgroundColor: '#1E1E1E', // Fond sombre pour les transactions
//     padding: 10,
//     marginBottom: 8,
//     borderRadius: 5,
//   },
//   transactionCell: {
//     fontSize: 16,
//     color: '#FFFFFF',  // Texte en blanc pour le contraste
//   },
// });

// export default TransactionList;

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';
import { getAuth } from "firebase/auth";
import moment from 'moment'; // Importez moment pour formater les dates
import { MaterialIcons } from '@expo/vector-icons'; // Importation de MaterialIcons

const TransactionList = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (userEmail) {
      const transactionsRef = firebase.firestore().collection('cryptotransactions');

      const unsubscribeTransactions = transactionsRef
        .where('email', '==', userEmail)
        .orderBy('date', 'desc') // Ordonner par date (du plus récent au plus ancien)
        .onSnapshot((snapshot) => {
          const updatedTransactions = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              date: data.date.toDate(), // Convertir Timestamp Firestore en Date JS
            };
          });
          setTransactions(updatedTransactions);
        }, (error) => {
          console.error("Erreur lors de la récupération des transactions : ", error);
        });

      return unsubscribeTransactions;
    } else {
      setTransactions([]);
    }
  }, [userEmail]);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionCell}>Crypto: {item.crypto}</Text>
      <Text style={styles.transactionCell}>{item.transaction} de {item.qte}</Text>
      <Text style={styles.transactionCell}>Montant: $ {item.montant} </Text>
      <Text style={styles.transactionCell}>Prix Unitaire: $ {item.pu} </Text>
      <Text style={styles.transactionCell}>Date: {moment(item.date).format('DD/MM/YYYY HH:mm')}</Text> {/* Formater la date */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AddWalletTransaction')}>
        <MaterialIcons name="arrow-back" size={28} color="#F7931A" />
      </TouchableOpacity>

      <Text style={styles.title}>Mes Transactions</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Détails de vos transactions</Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',  // Fond sombre
    padding: 16,
    marginTop: 79
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
  transactionItem: {
    backgroundColor: '#1E1E1E', // Fond sombre pour les transactions
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  transactionCell: {
    fontSize: 16,
    color: '#FFFFFF',  // Texte en blanc pour le contraste
  },
});

export default TransactionList;
