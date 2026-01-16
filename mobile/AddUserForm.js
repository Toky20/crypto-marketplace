import React, { useState } from "react";
import { TextInput, Button, Alert, StyleSheet, View } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase"; // Importer la configuration Firebase

export default function AddUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !age) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      alert("ici");

      // Ajouter un utilisateur à la collection "users" dans Firestore
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        email: email,
        age: parseInt(age), // Assurer que l'âge soit un entier
      });
      alert("la bas");

      // Afficher l'alerte avec le message de succès
      Alert.alert("Utilisateur ajouté avec succès", `ID : ${docRef.id}`);

      // Réinitialiser les champs du formulaire
      setName("");
      setEmail("");
      setAge("");
      
    } catch (error) {

      // En cas d'erreur, afficher un message d'erreur
      Alert.alert("Erreur", `Impossible d'ajouter l'utilisateur : ${error.message}`);
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Âge"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <Button title="Ajouter l'utilisateur" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});
