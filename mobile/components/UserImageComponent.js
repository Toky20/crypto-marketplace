import { firebase } from '../firebase';

const getUserImageFromFirestore = async (mail) => {
  try {
    let userDoc = null;
    if (mail != null) {
      userDoc = await firebase.firestore().collection('cloudinary').where('user', '==', mail).get();
    }
    let imageUrl = "  "; // Default image URL
    if (!userDoc.empty) {
      imageUrl = userDoc.docs[0].data().secure_url; // Fetch URL from Firestore document
    }
    return imageUrl;
  } catch (error) {
    console.error('Error fetching user image:', error);
    return null;
  }
};

export default getUserImageFromFirestore;