package firebase;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentChange;
import com.google.cloud.firestore.ListenerRegistration;

import acces.Connexion;
import model.UserImage;

public class UserImageListener {
    private Firestore db;
    private ListenerRegistration userImageListener;

    public UserImageListener() {
        // Initialisation de Firestore via FirestoreClient
        db = FirestoreClient.getFirestore();  // Utiliser FirestoreClient pour obtenir une instance de Firestore
    }

    public void stopListening() {
        if (userImageListener != null) {
            // Retirer le listener
            userImageListener.remove();
        }
    }

    public void startListening() {
        CollectionReference userImageRef = db.collection("cloudinary");

        // Ajout du listener sur la collection pour écouter les ajouts
        userImageListener = userImageRef.addSnapshotListener((querySnapshot, e) -> {
            if (e != null) {
                System.out.println("Erreur d'écoute des ajouts: " + e.getMessage());
                return;
            }
            if (querySnapshot != null) {
                // Lorsque la collection est mise à jour, parcourir les documents ajoutés
                querySnapshot.getDocumentChanges().forEach(documentChange -> {
                    if (documentChange.getType().toString().equalsIgnoreCase("ADDED")==true || documentChange.getType().toString().equalsIgnoreCase("MODIFIED")==true) {
                        System.out.println("huhu");
                        // Récupérer le document ajouté
                        DocumentSnapshot doc = documentChange.getDocument();
                        String user = doc.getString("user");
                        
                        String secure_url = doc.getString("secure_url");

                        System.out.println("Document ajouté: " + doc.getId() + " -> " + doc.getData() +"haha"+ doc.getString("user"));

                        UserImage userImage = new UserImage();
                        userImage.setMail(user);
                        userImage.setSecure_url(secure_url);

                        try (Connection conn = new Connexion().getConnection()) {
                            userImage.setId_utilisateur(conn);
                            userImage.writeToDb(conn);
                            System.out.println("Document inséré ou modifié dans la base de données : " + doc.getId());
                            conn.close();
                        } catch (Exception ex) {
                            ex.printStackTrace();
                            System.out.println("Erreur d'insertion dans la base de données.");
                        }
                    }
                });
            }
        });
    }

    public void updateUserImage() throws SQLException, Exception {
        try (Connection connection = new Connexion().getConnection()) {
            List<UserImage> userImages = UserImage.getAll(connection);

            for (UserImage userImage : userImages) {
                userImage.setMail(connection);
            }

            // Référence à Firestore
            CollectionReference userImageRef = db.collection("cloudinary");

            // Récupérer les documents existants dans Firestore
            ApiFuture<QuerySnapshot> future = userImageRef.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            Set<String> userImageIds = new HashSet<>();
            Map<String, String> userImageDiocIds = new HashMap<>(); // Associe (mail_idCrypto) -> Document ID Firestore

            for (QueryDocumentSnapshot doc : documents) {
                String mail = doc.getString("user");
                String secure_url = doc.getString("secure_url");
                if (mail != null && secure_url != null) {
                    String key = mail + "_" + secure_url;
                    userImageIds.add(key);
                    userImageDiocIds.put(key, doc.getId()); // Stocker l'ID du document Firestore
                }
            }

            Set<String> dbIds = new HashSet<>();
            for (UserImage userImage : userImages) {
                String key = userImage.getMail() + "_" + userImage.getSecure_url();
                dbIds.add(key);
            }


            // Supprimer les userImages obsolètes de Firestore
            for (String key : userImageIds) {
                if (!dbIds.contains(key)) {
                    String docId = userImageDiocIds.get(key);
                    if (docId != null) {
                        userImageRef.document(docId).delete(); // Supprimer le document Firestore
                    }
                }
            }

            // Ajouter les userImages manquants dans Firestore
            for (UserImage userImage : userImages) {
                String key = userImage.getMail() + "_" + userImage.getSecure_url();
                if (!userImageIds.contains(key)) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("user", userImage.getMail());
                    data.put("secure_url", userImage.getSecure_url());
                    userImageRef.add(data);
                }
            }
            connection.close();
        } catch (SQLException e) {
            throw e;
        }
    }
}
