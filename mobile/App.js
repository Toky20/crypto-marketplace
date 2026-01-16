// // App.js

// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaView, FlatList, Text, View, StyleSheet } from 'react-native';
// import { firebase } from './firebase';
// import AddWalletTransaction from './components/AddWalletTransaction';
// import LoginScreen from './components/LoginScreen'; // Importez le composant de connexion
// import { getAuth } from "firebase/auth";

// import CryptoList from './components/CryptoList';
// import TransactionList from './components/TransactionList';


// const Stack = createNativeStackNavigator();

// const App = () => {
//   const [userId, setUserId] = useState(null); // Utilisez null au lieu de ''

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUserId(user ? user.uid : null);
//     });
//     return unsubscribe;
//   }, []);


//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {userId ? (
//           <>  
//             <Stack.Screen name="AddWalletTransaction" component={AddWalletTransaction} />
//             <Stack.Screen name="CryptoList" component={CryptoList} />
//             <Stack.Screen name="TransactionList" component={TransactionList} />
//           </>
//         ) : (
//           <Stack.Screen name="Login" component={LoginScreen} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     paddingHorizontal: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#f8f8f8',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//   },
//   itemText: {
//     fontSize: 16,
//   },
// });

// export default App;

// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AddWalletTransaction from './components/AddWalletTransaction';
// import LoginScreen from './components/LoginScreen';
// import CryptoList from './components/CryptoList';
// import TransactionList from './components/TransactionList';
// import { getAuth } from "firebase/auth";

// const Stack = createNativeStackNavigator();

// const App = () => {
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUserId(user ? user.uid : null);
//     });
//     return unsubscribe;
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         {userId ? (
//           <>
//             <Stack.Screen name="AddWalletTransaction" component={AddWalletTransaction} />
//             <Stack.Screen name="CryptoList" component={CryptoList} />
//             <Stack.Screen name="TransactionList" component={TransactionList} />
//           </>
//         ) : (
//           <Stack.Screen name="Login" component={LoginScreen} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;


// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AddWalletTransaction from './components/AddWalletTransaction';
// import LoginScreen from './components/LoginScreen';
// import CryptoList from './components/CryptoList';
// import TransactionList from './components/TransactionList';
// import CryptoChart from './components/CryptoChart';
// import { getAuth } from "firebase/auth";
// import * as  Notifications from 'expo-notifications';

// import * as Permissions from 'expo-permissions';  // Pour la gestion des permissions

// Notifications.setNotificationHandler({
//   handleNotification : async () => ({
//     shouldShowAlert:true,
//     shouldPlaySound:false,
//     shouldSetBadge:false
//   }),
// });


// const Stack = createNativeStackNavigator();

// const App = () => {
//   const [userId, setUserId] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);
// useEffect(() => {
//       const requestPermissions = async () => {
//       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//       if (status !== 'granted') {
//         console.log("Permission de notifications refusée");
//       }
//       console.log("perm accepté");
//     };

//     // Appelle la fonction pour demander les permissions
//     requestPermissions();

//     if (userEmail) {
//       const transactionsRef = firebase.firestore().collection('notifications');

//       const notificationsValidation = transactionsRef
//         .where('email', '==', userEmail)
//         .onSnapshot((snapshot) => {
//           const notificationsRecus = snapshot.docs.map((doc) => {
//             const data = doc.data();

//             console.log("la notif est"+data.message);
            
//             Notifications.scheduleNotificationAsync({
//               content: {
//                 title: 'Nouvelle notification',
//                 body: data.message,  // Utilisation de data.message comme corps de la notification
//               },
//               trigger: null,  // La notification est affichée immédiatement
//             });

//             // Supprimer le document après l'affichage de la notification
//             doc.ref.delete()
//               .then(() => {
//                 console.log("Document supprimé après notification.");
//               })
//               .catch((error) => {
//                 console.error("Erreur lors de la suppression du document : ", error);
//               });


//           });

//         }, (error) => {
//           console.error("Erreur lors de la récupération des transactions : ", error);
//         });

//       return notificationsValidation;
//     } 
//   }, [userEmail]);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUserId(user ? user.uid : null);
//     });
//     return unsubscribe;
//   }, []);

//   return (
//     <NavigationContainer>
//           <Stack.Navigator initialRouteName="Login">
//           {userId ? (
//             <>
//               <Stack.Screen name="AddWalletTransaction" component={AddWalletTransaction} />
//               <Stack.Screen name="CryptoList" component={CryptoList} />
//               <Stack.Screen name="TransactionList" component={TransactionList} />
//               <Stack.Screen name="CryptoChart" component={CryptoChart} />
//             </>
//           ) : (
//             <Stack.Screen name="Login" component={LoginScreen} />
//           )}
//     </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AddWalletTransaction from './components/AddWalletTransaction';
// import LoginScreen from './components/LoginScreen';
// import CryptoList from './components/CryptoList';
// import TransactionList from './components/TransactionList';
// import CryptoChart from './components/CryptoChart';
// import CryptoFav from './components/CryptoFav';
// import { getAuth } from "firebase/auth";
// import { firebase } from "./firebase";
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';  // Pour la gestion des permissions

// Notifications.setNotificationHandler({
//   handleNotification : async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// const Stack = createNativeStackNavigator();

// const App = () => {
//   const [userId, setUserId] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);

  

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUserId(user ? user.uid : null);
//     });
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//       console.log("est co");
//     });
//     return unsubscribeAuth;
//   }, []);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//       if (status !== 'granted') {
//         console.log("Permission de notifications refusée");
//       }
//       console.log("Permission acceptée");
//     };

//     requestPermissions();

//     if (userEmail) {
//       const transactionsRef = firebase.firestore().collection('notifications');

//       const notificationsValidation = transactionsRef
//         .where('email', '==', userEmail)
//         .onSnapshot((snapshot) => {
//           const notificationsRecus = snapshot.docs.map((doc) => {
//             const data = doc.data();

//             console.log("La notif est: " + data.message);

//             Notifications.scheduleNotificationAsync({
//               content: {
//                 title: 'Nouvelle notification',
//                 body: data.message,  // Utilisation de data.message comme corps de la notification
//               },
//               trigger: null,  // La notification est affichée immédiatement
//             });

//             // Supprimer le document après l'affichage de la notification
//             doc.ref.delete()
//               .then(() => {
//                 console.log("Document supprimé après notification.");
//               })
//               .catch((error) => {
//                 console.error("Erreur lors de la suppression du document : ", error);
//               });
//           });
//         }, (error) => {
//           console.error("Erreur lors de la récupération des transactions : ", error);
//         });

//       return notificationsValidation;
//     }
//   }, [userEmail]);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         {userId ? (
//           <>
//             <Stack.Screen 
//               name="AddWalletTransaction" 
//               component={AddWalletTransaction} 
//               options={{ headerShown: false }}  // Masquer le titre
//             />
//             <Stack.Screen 
//               name="CryptoList" 
//               component={CryptoList} 
//               options={{ headerShown: false }}  // Masquer le titre
//             />
//             <Stack.Screen 
//               name="TransactionList" 
//               component={TransactionList} 
//               options={{ headerShown: false }}  // Masquer le titre
//             />
//             <Stack.Screen 
//               name="CryptoChart" 
//               component={CryptoChart} 
//               options={{ headerShown: false }}  // Masquer le titre
//             />
//             <Stack.Screen 
//               name="CryptoFav" 
//               component={CryptoFav} 
//               options={{ headerShown: false }}  // Masquer le titre
//             />
//           </>
//         ) : (
//           <Stack.Screen 
//             name="Login" 
//             component={LoginScreen} 
//             options={{ headerShown: false }}  // Masquer le titre pour l'écran de login
//           />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWalletTransaction from './components/AddWalletTransaction';
import LoginScreen from './components/LoginScreen';
import CryptoList from './components/CryptoList';
import TransactionList from './components/TransactionList';
import CryptoChart from './components/CryptoChart';
import CryptoFav from './components/CryptoFav';
import { getAuth } from "firebase/auth";
import { firebase } from "./firebase";
import * as Notifications from 'expo-notifications';  // Notifications importée pour gérer les notifications

// Remarquez que nous n'utilisons plus `expo-permissions`
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

const App = () => {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
      console.log("est co");
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'ios') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log("Permission de notifications refusée");
        } else {
          console.log("Permission acceptée");
        }
      } else {
        // Pour Android, les permissions sont généralement gérées par le système, mais on peut ajouter du code si nécessaire.
        console.log("Android: Permissions de notifications gérées automatiquement.");
      }
    };

    requestPermissions();

    if (userEmail) {
      const transactionsRef = firebase.firestore().collection('notifications');

      const notificationsValidation = transactionsRef
        .where('email', '==', userEmail)
        .onSnapshot((snapshot) => {
          const notificationsRecus = snapshot.docs.map((doc) => {
            const data = doc.data();

            console.log("La notif est: " + data.message);

            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Nouvelle notification',
                body: data.message,  // Utilisation de data.message comme corps de la notification
              },
              trigger: null,  // La notification est affichée immédiatement
            });

            // Supprimer le document après l'affichage de la notification
            doc.ref.delete()
              .then(() => {
                console.log("Document supprimé après notification.");
              })
              .catch((error) => {
                console.error("Erreur lors de la suppression du document : ", error);
              });
          });
        }, (error) => {
          console.error("Erreur lors de la récupération des transactions : ", error);
        });

      return notificationsValidation;
    }
  }, [userEmail]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {userId ? (
          <>
            <Stack.Screen 
              name="AddWalletTransaction" 
              component={AddWalletTransaction} 
              options={{ headerShown: false }}  // Masquer le titre
            />
            <Stack.Screen 
              name="CryptoList" 
              component={CryptoList} 
              options={{ headerShown: false }}  // Masquer le titre
            />
            <Stack.Screen 
              name="TransactionList" 
              component={TransactionList} 
              options={{ headerShown: false }}  // Masquer le titre
            />
            <Stack.Screen 
              name="CryptoChart" 
              component={CryptoChart} 
              options={{ headerShown: false }}  // Masquer le titre
            />
            <Stack.Screen 
              name="CryptoFav" 
              component={CryptoFav} 
              options={{ headerShown: false }}  // Masquer le titre
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}  // Masquer le titre pour l'écran de login
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
