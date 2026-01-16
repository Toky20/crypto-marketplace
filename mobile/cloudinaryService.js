

import { firebase } from './firebase';
import axios from 'axios';
import { SHA1 } from 'crypto-js';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from './config';

// Fonction pour uploader une image
export const uploadImageToCloudinary = async (imageUri,userEmail) => {
  const fileType = imageUri.split('.').pop(); // Get the file extension
  
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: `image/${fileType}`, 
    name: `photo.${{fileType}}`,
  });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    console.log(response.data)

    const cloudinaryRef = firebase.firestore().collection('cloudinary');

    // Vérifier si l'email existe déjà
    const querySnapshot = await cloudinaryRef.where('user', '==', userEmail).get();

    if (!querySnapshot.empty) {
      // Si l'email existe déjà, on met à jour le document
      const docId = querySnapshot.docs[0].id; // Récupérer l'ID du document
      await cloudinaryRef.doc(docId).update({
        secure_url: response.data.secure_url
      });
    } else {
      // Si l'email n'existe pas, on ajoute un nouveau document
      await cloudinaryRef.add({
        user: userEmail,
        secure_url: response.data.secure_url
      });
    }

      console.log(userEmail);

    

    return response.data; // Retourne l'URL et le public_id
  } catch (error) {
    console.error('Erreur lors de l’upload :', error);
    return null;
  }
};

// Récupérer les infos d’une image via public_id
export const getImageInfo = async (publicId) => {
  try {
    const response = await axios.get(
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    return null;
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      public_id: publicId,
      api_key: CLOUDINARY_API_KEY,
      timestamp: timestamp,
    };

    // Create the string to be signed (sorted lexicographically)
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    
    // Generate the signature using SHA1
    const signature = SHA1(signatureString).toString();

    // Add the signature to params
    params.signature = signature;

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      params
    );

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    return null;
  }
};