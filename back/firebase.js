// firebase.js
const admin = require('firebase-admin');

// Vérifie si Firebase est déjà initialisé
if (!admin.apps.length) {
  const serviceAccount = require('./google-service.json');
  
  // Initialisation de Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.log('Firebase est déjà initialisé');
}

// Exporter l'instance Firebase pour l'utiliser ailleurs
module.exports = admin;
