// import React, { useState, useEffect } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Animations
//   const fadeAnim = new Animated.Value(0);
//   const slideAnim = new Animated.Value(50);
//   const logoRotate = new Animated.Value(0);

//   useEffect(() => {
//     // Animation d'entrée
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
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(logoRotate, {
//             toValue: 1,
//             duration: 30000,
//             useNativeDriver: true,
//           }),
//         ])
//       ),
//     ]).start();
//   }, []);

//   const spin = logoRotate.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const handleLogin = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const auth = getAuth();
//       await signInWithEmailAndPassword(auth, email, password);
//       // Lors de la navigation
//       navigation.navigate('AddWalletTransaction');
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.formContainer}>
//         <Animated.View style={[
//           styles.logoContainer,
//           {
//             opacity: fadeAnim,
//             transform: [
//               { translateY: slideAnim },
//               { rotate: spin }
//             ],
//           },
//         ]}>
//           <Text style={styles.logo}>₿</Text>
//         </Animated.View>

//         <Animated.View style={{
//           opacity: fadeAnim,
//           transform: [{ translateY: slideAnim }],
//         }}>
//           <Text style={styles.header}>Cryptourism</Text>
//           <Text style={styles.subHeader}>Votre Portail vers le Futur Digital</Text>
          
//           {error && (
//             <Animated.View style={styles.errorContainer}>
//               <Text style={styles.error}>{error}</Text>
//             </Animated.View>
//           )}
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>EMAIL</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Votre email"
//               placeholderTextColor="#4A4A4A"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>MOT DE PASSE</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Votre mot de passe"
//               placeholderTextColor="#4A4A4A"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           <TouchableOpacity 
//             style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
//             onPress={handleLogin}
//             disabled={isLoading}
//             activeOpacity={0.8}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.loginButtonText}>ACCÉDER AU PORTAIL</Text>
//             )}
//           </TouchableOpacity>
//         </Animated.View>
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
//   formContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     maxWidth: 400,
//     width: '100%',
//     alignSelf: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     fontSize: 60,
//     color: '#F7931A',
//     textShadowColor: 'rgba(247, 147, 26, 0.5)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 20,
//   },
//   header: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//     textShadowColor: 'rgba(255, 255, 255, 0.1)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 3,
//   },
//   subHeader: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 40,
//     fontStyle: 'italic',
//   },
//   inputContainer: {
//     marginBottom: 24,
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
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   loginButton: {
//     backgroundColor: '#F7931A',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginTop: 16,
//     shadowColor: '#F7931A',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   loginButtonDisabled: {
//     backgroundColor: '#3D2611',
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     letterSpacing: 2,
//   },
//   errorContainer: {
//     marginBottom: 20,
//   },
//   error: {
//     color: '#FF4B4B',
//     textAlign: 'center',
//     marginBottom: 16,
//     backgroundColor: 'rgba(255, 75, 75, 0.1)',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 75, 75, 0.2)',
//     overflow: 'hidden',
//   },
// });

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const auth = getAuth();
//       await signInWithEmailAndPassword(auth, email, password);
//       // Lors de la navigation
//       navigation.navigate('AddWalletTransaction');
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.formContainer}>
//         {/* Logo section removed from animation */}
//         <View style={styles.logoContainer}>
//           <Text style={styles.logo}>₿</Text>
//         </View>

//         {/* Main content */}
//         <View>
//         <Text style={styles.header}>CryptoFlow</Text>
//   <Text style={styles.subHeader}>Faites couler l'argent comme un stackoverflow</Text>

          
//           {error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.error}>{error}</Text>
//             </View>
//           )}
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>EMAIL</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Votre email"
//               placeholderTextColor="#4A4A4A"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>MOT DE PASSE</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Votre mot de passe"
//               placeholderTextColor="#4A4A4A"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           <TouchableOpacity 
//             style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
//             onPress={handleLogin}
//             disabled={isLoading}
//             activeOpacity={0.8}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.loginButtonText}>CONNEXION</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A0A0A',
//     padding: 20,
//     // marginTop: 20
//   },
//   formContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     maxWidth: 400,
//     width: '100%',
//     alignSelf: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     fontSize: 60,
//     color: '#F7931A',
//     textShadowColor: 'rgba(247, 147, 26, 0.5)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 20,
//   },
//   header: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//     textShadowColor: 'rgba(255, 255, 255, 0.1)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 3,
//   },
//   subHeader: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 40,
//     fontStyle: 'italic',
//   },
//   inputContainer: {
//     marginBottom: 24,
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
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   loginButton: {
//     backgroundColor: '#F7931A',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginTop: 16,
//     shadowColor: '#F7931A',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   loginButtonDisabled: {
//     backgroundColor: '#3D2611',
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     letterSpacing: 2,
//   },
//   errorContainer: {
//     marginBottom: 20,
//   },
//   error: {
//     color: '#FF4B4B',
//     textAlign: 'center',
//     marginBottom: 16,
//     backgroundColor: 'rgba(255, 75, 75, 0.1)',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 75, 75, 0.2)',
//     overflow: 'hidden',
//   },
// });

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { FontAwesome, MaterialCommunityIcons } from 'react-native-vector-icons'; // Import des icônes

// // Firebase Authentication (Assurez-vous que Firebase est bien configuré dans votre projet)
// import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const auth = getAuth();
//       await signInWithEmailAndPassword(auth, email, password);
//       navigation.navigate('AddWalletTransaction');
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Gestion de la connexion avec Google
//   const handleGoogleLogin = async () => {
//     try {
//       const auth = getAuth();
//       const provider = new GoogleAuthProvider();
//       const result = await auth.signInWithPopup(provider);
//       navigation.navigate('AddWalletTransaction');
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   // Gestion de la connexion avec Facebook
//   const handleFacebookLogin = async () => {
//     try {
//       const auth = getAuth();
//       const provider = new FacebookAuthProvider();
//       const result = await auth.signInWithPopup(provider);
//       navigation.navigate('AddWalletTransaction');
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.formContainer}>
//         <Text style={styles.header}>CryptoFlow</Text>
//         <Text style={styles.subHeader}>Faites couler l'argent comme un stackoverflow</Text>

//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.error}>{error}</Text>
//           </View>
//         )}

//         <TextInput
//           style={styles.input}
//           placeholder="Votre email"
//           placeholderTextColor="#4A4A4A"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//         />
        
//         <TextInput
//           style={styles.input}
//           placeholder="Votre mot de passe"
//           placeholderTextColor="#4A4A4A"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />
        
//         <TouchableOpacity
//           style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
//           onPress={handleLogin}
//           disabled={isLoading}
//           activeOpacity={0.8}
//         >
//           {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>CONNEXION</Text>}
//         </TouchableOpacity>

//         {/* Boutons de connexion via Google et Facebook */}
//         <View style={styles.socialLoginContainer}>
//           <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
//             <FontAwesome name="google" size={24} color="#fff" />
//             <Text style={styles.socialButtonText}>Google</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={handleFacebookLogin} style={styles.socialButton}>
//             <MaterialCommunityIcons name="facebook" size={24} color="#fff" />
//             <Text style={styles.socialButtonText}>Facebook</Text>
//           </TouchableOpacity>
//         </View>
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
//   formContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     maxWidth: 400,
//     width: '100%',
//     alignSelf: 'center',
//   },
//   header: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subHeader: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 40,
//     fontStyle: 'italic',
//   },
//   input: {
//     backgroundColor: '#151515',
//     borderRadius: 12,
//     padding: 16,
//     color: '#FFFFFF',
//     fontSize: 16,
//     marginBottom: 24,
//   },
//   loginButton: {
//     backgroundColor: '#F7931A',
//     borderRadius: 12,
//     padding: 18,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   loginButtonDisabled: {
//     backgroundColor: '#3D2611',
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   socialLoginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   socialButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     padding: 12,
//     borderRadius: 8,
//     flex: 0.45,
//     justifyContent: 'center',
//   },
//   socialButtonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontWeight: 'bold',
//   },
//   errorContainer: {
//     marginBottom: 20,
//   },
//   error: {
//     color: '#FF4B4B',
//     textAlign: 'center',
//     marginBottom: 16,
//     backgroundColor: 'rgba(255, 75, 75, 0.1)',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 75, 75, 0.2)',
//   },
// });

// export default LoginScreen;

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FontAwesome, MaterialCommunityIcons } from 'react-native-vector-icons'; // Import des icônes
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';  // Pour la connexion Google et Facebook

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('AddWalletTransaction');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la connexion avec Google
  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      navigation.navigate('AddWalletTransaction');
    } catch (error) {
      setError(error.message);
    }
  };

  // Gestion de la connexion avec Facebook
  const handleFacebookLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const result = await auth.signInWithPopup(provider);
      navigation.navigate('AddWalletTransaction');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Icônes de cryptomonnaies */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="bitcoin" size={40} color="#F7931A" />
        <MaterialCommunityIcons name="ethereum" size={40} color="#3C3C3D" />
        <MaterialCommunityIcons name="litecoin" size={40} color="#B0B0B0" />
        <MaterialCommunityIcons name="ethereum" size={40} color="#3E9E9E" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.header}>CryptoFlow</Text>
        <Text style={styles.subHeader}>Faites couler l'argent comme un stackoverflow</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Votre email"
          placeholderTextColor="#4A4A4A"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Votre mot de passe"
          placeholderTextColor="#4A4A4A"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>CONNEXION</Text>}
        </TouchableOpacity>

        {/* Boutons de connexion via Google et Facebook */}
        <View style={styles.socialLoginContainer}>
          {/* <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#fff" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleFacebookLogin} style={styles.socialButton}>
            <MaterialCommunityIcons name="facebook" size={24} color="#fff" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="#fff" />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <MaterialCommunityIcons name="facebook" size={24} color="#fff" />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  iconContainer: {
    flexDirection: 'row', // Disposition horizontale des icônes
    justifyContent: 'space-evenly', // Espacement égal entre les icônes
    marginBottom: 20, // Espacement avant le formulaire
    paddingTop: 40, // Espacement du haut
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#F7931A',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#3D2611',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    flex: 0.45,
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginBottom: 20,
  },
  error: {
    color: '#FF4B4B',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.2)',
  },
});

export default LoginScreen;
