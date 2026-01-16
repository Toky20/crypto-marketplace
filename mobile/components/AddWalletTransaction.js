// import React, { useState, useEffect } from 'react'; 
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Image } from 'react-native';
// import { firebase } from '../firebase';
// import { getAuth, signOut } from "firebase/auth";
// import { useNavigation } from '@react-navigation/native';
// import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// const AddWalletTransaction = () => {
//   const navigation = useNavigation();
//   const [amount, setAmount] = useState('');
//   const [userEmail, setUserEmail] = useState(null);
//   const [transactionType, setTransactionType] = useState(null);
//   const [error, setError] = useState(null);
//   const [solde, setSolde] = useState(0);

//   // Animation pour le solde
//   const fadeAnim = new Animated.Value(0);
//   const slideAnim = new Animated.Value(50);

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUserEmail(user ? user.email : null);
//     });
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     if (userEmail) {
//       const soldeRef = firebase.firestore().collection('soldeusers');
//       const unsubscribeSolde = soldeRef
//         .where('email', '==', userEmail)
//         .onSnapshot((snapshot) => {
//           const soldeData = snapshot.docs.map((doc) => doc.data());
//           if (soldeData.length > 0) {
//             setSolde(soldeData[0].solde);
//           } else {
//             setSolde(0);
//           }
//         }, (error) => {
//           console.error("Erreur lors de la récupération du solde : ", error);
//         });

//       return unsubscribeSolde;
//     } else {
//       setSolde(0);
//     }
//   }, [userEmail]);

//   const handleTransaction = async (type) => {
//     if (!amount || isNaN(amount) || Number(amount) <= 0) {
//       setError("Veuillez entrer un montant valide !");
//       return;
//     }

//     if (type === 'retrait' && parseFloat(amount) > solde) {
//       setError("Solde insuffisant pour effectuer ce retrait.");
//       return;
//     }

//     try {
//       const dateheure = new Date().toISOString();
//       const walletRef = firebase.firestore().collection('mvtwallets');
//       await walletRef.add({
//         dateheure,
//         [type]: parseFloat(amount),
//         user: userEmail,
//       });

//       setAmount('');
//       setError(null);
//       alert('Demande ajoutée avec succès ! En attente de réponse d\'un administrateur');
//     } catch (error) {
//       setError("Erreur lors de l'ajout de la transaction : " + error.message);
//     }
//   };

//   // Fonction de déconnexion
//   const handleSignOut = async () => {
//     const auth = getAuth();
//     try {
//       await signOut(auth);
//       navigation.navigate('Login'); // Naviguer vers l'écran de connexion après la déconnexion
//     } catch (error) {
//       console.error("Erreur de déconnexion : ", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         {/* Bouton de déconnexion en haut à droite */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
//           <MaterialIcons name="logout" size={28} color="#D32F2F" />
//         </TouchableOpacity>

//         {/* Affichage de l'image de profil */}
//         <View style={styles.profileContainer}>
//           <Image 
//             source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }} // Image par défaut
//             style={styles.profileImage}
//           />
//           <Text style={styles.profileName}>User</Text>
//         </View>

//         <Animated.View style={[styles.balanceContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} >
//           <Text style={styles.balanceLabel}>SOLDE DISPONIBLE</Text>
//           <Text style={styles.balanceAmount}>{solde} $</Text>
//         </Animated.View>

//         <Text style={styles.header}>Gestion du Portefeuille</Text>

//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.error}>{error}</Text>
//           </View>
//         )}

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>MONTANT</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Entrez le montant..."
//             placeholderTextColor="#4A4A4A"
//             keyboardType="numeric"
//             value={amount}
//             onChangeText={setAmount}
//           />
//         </View>

//         {/* Boutons de dépôt et retrait juste après l'input */}
//         <View style={styles.transactionButtonsContainer}>
//           <TouchableOpacity style={styles.navItem} onPress={() => handleTransaction('depot')}>
//             <MaterialIcons name="add-circle-outline" size={24} color="#1B5E20" />
//             <Text style={[styles.navText, { color: '#1B5E20' }]}>Dépôt</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.navItem} onPress={() => handleTransaction('retrait')}>
//             <MaterialIcons name="remove-circle-outline" size={24} color="#B71C1C" />
//             <Text style={[styles.navText, { color: '#B71C1C' }]}>Retrait</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Barre de navigation du bas (Cryptos, Historique et Chart) */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CryptoList')}>
//           <FontAwesome5 name="coins" size={24} color="#F7931A" />
//           <Text style={[styles.navText, { color: '#F7931A' }]}>Cryptos</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TransactionList')}>
//           <MaterialCommunityIcons name="history" size={24} color="#1A237E" />
//           <Text style={[styles.navText, { color: '#1A237E' }]}>Historique</Text>
//         </TouchableOpacity>

//         {/* Nouveau bouton Chart */}
//         <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CryptoChart')}>
//           <FontAwesome5 name="chart-line" size={24} color="#42A5F5" />
//           <Text style={[styles.navText, { color: '#42A5F5' }]}>Graphique</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A0A0A',
//     padding: 20,
//   },
//   content: {
//     flex: 1,
//   },
//   profileContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   profileName: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   balanceContainer: {
//     backgroundColor: '#FFF',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 30,
//     shadowColor: '#F7931A',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   balanceLabel: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: 'bold',
//     letterSpacing: 2,
//     marginBottom: 8,
//   },
//   balanceAmount: {
//     color: '#F7931A',
//     fontSize: 36,
//     fontWeight: 'bold',
//     textShadowColor: 'rgba(247, 147, 26, 0.3)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 30,
//     textAlign: 'center',
//     textShadowColor: 'rgba(255, 255, 255, 0.1)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 3,
//   },
//   inputContainer: {
//     marginBottom: 8,  // Réduit l'espace entre l'input et les boutons
//   },
//   label: {
//     color: '#666',
//     fontSize: 12,
//     marginBottom: 8,
//     letterSpacing: 2,
//     fontWeight: 'bold',
//   },
//   input: {
//     backgroundColor: '#151515',
//     borderRadius: 12,
//     padding: 16,
//     color: '#FFFFFF',
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#222',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   transactionButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 6,  // Déplace les boutons plus près de l'input
//   },
//   navItem: {
//     flex: 0.45,
//     alignItems: 'center',
//   },
//   navText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 30,
//     backgroundColor: '#0A0A0A',
//     paddingBottom: 20,
//   },
//   errorContainer: {
//     backgroundColor: '#B71C1C',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   error: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   logoutButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     backgroundColor: 'transparent',
//     padding: 10,
//   },
// });

// export default AddWalletTransaction;

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Image, Button, Alert } from 'react-native';
import { firebase } from '../firebase';
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import getUserImageFromFirestore from './UserImageComponent';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../cloudinaryService'; // Assurez-vous que ce fichier contient la logique d'upload et de suppression

const AddWalletTransaction = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [error, setError] = useState(null);
  const [solde, setSolde] = useState(0);  
  const [profileImage, setProfileImage] = useState(null); // Pour stocker l'image du profil
  const [publicId, setPublicId] = useState(null); // ID de l'image pour suppression
  const [imageUri, setImageUri] = useState(null); // Pour stocker l'URI de l'image choisie
  
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user ? user.email : null);
    });
    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const fetchImageUrl = async () => {
  //     const url = await getUserImageFromFirestore(userEmail);
  //     setImageUri(url);
  //   }
  // });

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (userEmail) {
        const url = await getUserImageFromFirestore(userEmail);
        setImageUri(url);
      }
    };
    fetchImageUrl();
  }, [userEmail]);


  useEffect(() => {
    if (userEmail) {
      const soldeRef = firebase.firestore().collection('soldeusers');
      const unsubscribeSolde = soldeRef
        .where('email', '==', userEmail)
        .onSnapshot((snapshot) => {
          const soldeData = snapshot.docs.map((doc) => doc.data());
          if (soldeData.length > 0) {
            setSolde(soldeData[0].solde);
          } else {
            setSolde(0);
          }
        }, (error) => {
          console.error("Erreur lors de la récupération du solde : ", error);
        });

      return unsubscribeSolde;
    } else {
      setSolde(0);
    }
  }, [userEmail]);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Naviguer vers l'écran de connexion après la déconnexion
    } catch (error) {
      console.error("Erreur de déconnexion : ", error);
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Veuillez entrer un montant valide !");
      return;
    }

    if (type === 'retrait' && parseFloat(amount) > solde) { 
      setError("Solde insuffisant pour effectuer ce retrait.");
      return;
    }

    try {
      const dateheure = new Date().toISOString();
      const walletRef = firebase.firestore().collection('mvtwallets');
      await walletRef.add({
        dateheure,
        [type]: parseFloat(amount),
        user: userEmail,
      });

      setAmount('');
      setError(null);
      alert('Demande ajoutée avec succès ! En attente de réponse d\'un administrateur');
    } catch (error) {
      setError("Erreur lors de l'ajout de la transaction : " + error.message);
    }
  };

  // Fonction pour ouvrir le sélecteur d'image (prise de photo ou galerie)
  const openImagePicker = async () => {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (result.granted) {
        Alert.alert('Choisir une option', '', [
          { text: 'Prendre une photo', onPress: takePhoto },
          { text: 'Choisir depuis la galerie', onPress: pickImage },
        ]);
      } else {
        alert("Permission requise pour accéder à la galerie ou à l'appareil photo.");
      }
    };

  // Fonction pour choisir une image depuis la galerie
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[4, 4],
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImageUri(imageUri);
    }
  };
  
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect:[4, 4],
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImageUri(imageUri);
    }
  };
  

  const saveImage = async () => {
    if (imageUri) {
      const uploadResult = await uploadImageToCloudinary(imageUri,userEmail);
      if (uploadResult) {
        setProfileImage(uploadResult.secure_url);
        setPublicId(uploadResult.public_id);
        alert("Image sauvegardée avec succès !");
      } else {
        alert("Erreur lors de l'upload de l'image.");
      }
    } else {
      alert("Aucune image sélectionnée.");
    }
  };
  

  // Fonction pour supprimer l'image de profil
  const deleteImage = async () => {
    if (publicId) {
      await deleteImageFromCloudinary(publicId);
      setProfileImage(null);
      setPublicId(null);
      Alert.alert('Image supprimée', 'Votre image de profil a été supprimée.');
    } else {
      Alert.alert('Aucune image', 'Aucune image à supprimer.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <MaterialIcons name="logout" size={28} color="#D32F2F" />
        </TouchableOpacity>
  
        {/* Affichage de l'image de profil */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={openImagePicker}>
            <Image
                // source={profileImage ? { uri: profileImage } : require('../assets/sary.png')}
              // source={{ uri: profileImage || 'https://res.cloudinary.com/deqfle4wm/image/upload/v1738934172/photo_syccop.png' }}
              source={{ uri: imageUri}}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.profileName}>User</Text>
          <TouchableOpacity style={styles.modifyProfileButton} onPress={openImagePicker}>
            <Text style={styles.modifyProfileText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>
  
        {/* Conteneur pour les icônes de sauvegarde et suppression */}
        <View style={styles.imageActionsContainer}>
  {imageUri && (
    <TouchableOpacity onPress={saveImage} style={styles.iconButton}>
      <MaterialCommunityIcons name="check-circle" size={30} color="#2196F3" />
      <Text style={[styles.navText, { color: '#2196F3' }]}>Save</Text> {/* Description en dessous de l'icône */}
    </TouchableOpacity>          
  )}

  {profileImage && (
    <TouchableOpacity onPress={deleteImage} style={styles.iconButton}>
      <MaterialCommunityIcons name="delete-circle" size={30} color="#B71C1C" />
      <Text style={[styles.navText, { color: '#B71C1C' }]}>Delete</Text> {/* Description en dessous de l'icône */}
    </TouchableOpacity>
  )}
</View>

  
        {/* Affichage du solde avec fond clair */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>SOLDE DISPONIBLE</Text>
          <Text style={styles.balanceAmount}> $ {solde} </Text>
        </View>

  
        <Text style={styles.header}>Gestion du Portefeuille</Text>
  
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>MONTANT</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le montant..."
            placeholderTextColor="#4A4A4A"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
  
        <View style={styles.transactionButtonsContainer}>
          <TouchableOpacity style={styles.navItem} onPress={() => handleTransaction('depot')}>
            <MaterialIcons name="add-circle-outline" size={24} color="#1B5E20" />
            <Text style={[styles.navText, { color: '#1B5E20' }]}>Dépôt</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.navItem} onPress={() => handleTransaction('retrait')}>
            <MaterialIcons name="remove-circle-outline" size={24} color="#B71C1C" />
            <Text style={[styles.navText, { color: '#B71C1C' }]}>Retrait</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CryptoList')}>
          <FontAwesome5 name="coins" size={24} color="#F7931A" />
          <Text style={[styles.navText, { color: '#F7931A' }]}>Cryptos</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TransactionList')}>
          <MaterialCommunityIcons name="history" size={24} color="#1A237E" />
          <Text style={[styles.navText, { color: '#1A237E' }]}>Historique</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CryptoFav')}>
          <FontAwesome5 name="heart" size={24} color="red" />
          <Text style={[styles.navText, { color: '#FF0000' }]}>Favoris</Text>
        </TouchableOpacity>

  
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CryptoChart')}>
          <FontAwesome5 name="chart-line" size={24} color="#42A5F5" />
          <Text style={[styles.navText, { color: '#42A5F5' }]}>Graphique</Text>
        </TouchableOpacity>

      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 15,  // Réduit le padding général pour éviter de gaspiller de l'espace
    marginTop: 79
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 15,  // Réduit l'espace entre le profil et les autres éléments
  },
  profileImage: {
    width: 70,  // Réduit la taille de l'image
    height: 70,
    borderRadius: 35,
    marginBottom: 8,  // Réduit l'espace entre l'image et le nom
  },
  profileName: {
    color: '#FFF',
    fontSize: 14,  // Réduit la taille du texte du nom
    fontWeight: 'bold',
  },
  modifyProfileButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    marginTop: 8,  // Réduit l'espace entre le texte du profil et le bouton
  },
  modifyProfileText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // balanceContainer: {
  //   backgroundColor: 'white',  // Fond clair pour le solde
  //   padding: 12,  // Réduit le padding interne pour rendre le conteneur plus compact
  //   borderRadius: 12,
  //   marginBottom: 20,  // Réduit l'espace sous le solde
  //   shadowColor: '#F7931A',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  balanceContainer: {
    backgroundColor: 'white',  // Le fond doit être blanc
    padding: 12,  // Garde le padding interne
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#F7931A',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    elevation: 0,
    // Essaye de retirer ou d'ajuster ces propriétés si nécessaire
  },
  
  balanceLabel: {
    color: '#666',
    fontSize: 12,  // Réduit la taille du texte du label
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,  // Réduit l'espace entre le label et le montant
  },
  balanceAmount: {
    color: '#F7931A',
    fontSize: 28,  // Réduit la taille du montant pour économiser de l'espace
    fontWeight: 'bold',
    textShadowColor: 'rgba(247, 147, 26, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  imageActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 15,  // Réduit l'espace entre les icônes et les autres éléments
  },
  iconButton: {
    padding: 8,  // Réduit la taille du bouton d'icône
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 26,  // Réduit la taille de la police du titre
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,  // Réduit l'espace entre le titre et les autres éléments
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  inputContainer: {
    marginBottom: 6,  // Réduit l'espace entre l'input et les boutons
  },
  label: {
    color: '#666',
    fontSize: 12,
    marginBottom: 6,  // Réduit l'espace entre le label et l'input
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 14,  // Réduit le padding de l'input pour gagner de l'espace
    color: '#FFFFFF',
    fontSize: 14,  // Réduit la taille de la police de l'input
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,  // Réduit l'espace entre l'input et les boutons
  },
  navItem: {
    flex: 0.45,
    alignItems: 'center',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,  // Réduit l'espace entre les éléments du bas
    backgroundColor: '#0A0A0A',
    paddingBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#B71C1C',
    padding: 8,  // Réduit le padding de l'alerte d'erreur
    borderRadius: 8,
    marginBottom: 14,  // Réduit l'espace sous l'erreur
  },
  error: {
    color: '#FFFFFF',
    fontSize: 12,  // Réduit la taille de la police de l'erreur
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 15,  // Réduit la position du bouton de logout
    right: 15,
    padding: 8,
    backgroundColor: 'transparent',
  },
});



export default AddWalletTransaction;
