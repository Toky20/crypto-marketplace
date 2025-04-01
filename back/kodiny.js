const admin = require('./firebase.js');  // Importer la configuration Firebase

// Fonction pour tester le login d'un utilisateur
async function testUserLogin(email, password) {
  try {
    // Récupérer l'utilisateur à partir de son adresse e-mail
    const user = await admin.auth().getUserByEmail(email);

    // Vérifier si le mot de passe correspond
    const isValidPassword = await admin.auth().verifyPassword(user.uid, password);

    if (isValidPassword) {
      return { success: true, message: 'Login réussi' };
    } else {
      return { success: false, message: 'Mot de passe incorrect' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Exemple d'utilisation
testUserLogin('wawa@gmail.com', '123456')
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });