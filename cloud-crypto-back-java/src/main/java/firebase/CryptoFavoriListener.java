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
import model.CryptoFavori;
import model.MouvementFiatWallet;

public class CryptoFavoriListener {
    private Firestore db;
    private ListenerRegistration cryptoFavoriListener;

    public CryptoFavoriListener() {
        // Initialisation de Firestore via FirestoreClient
        db = FirestoreClient.getFirestore();  // Utiliser FirestoreClient pour obtenir une instance de Firestore
    }

    public void startListening() {
        CollectionReference cryptoFavoriRef = db.collection("cryptoFavori");

        // Ajout du listener sur la collection pour écouter les ajouts
        cryptoFavoriListener = cryptoFavoriRef.addSnapshotListener((querySnapshot, e) -> {
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
                        
                        double id_crypto = doc.getDouble("id_crypto");
                        String status = doc.getString("status");

                        System.out.println("Document ajouté: " + doc.getId() + " -> " + doc.getData() +"haha"+ doc.getString("user"));

                        CryptoFavori cryptoFavori = new CryptoFavori();
                        cryptoFavori.setMail(user);
                        cryptoFavori.setStatus(status);
                        cryptoFavori.setId_crypto((int) id_crypto);
                        

                        try (Connection conn = new Connexion().getConnection()) {
                            cryptoFavori.setId_utilisateur(conn);
                            cryptoFavori.actionByStatusFromFb(conn);
                            if (!cryptoFavori.getStatus().equals("favorite")) {
                                doc.getReference().delete();
                            }
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

    public void updateFirestoreFromDb() throws SQLException, Exception {
        try (Connection connection = new Connexion().getConnection()) {
            List<CryptoFavori> cryptoFavoris = CryptoFavori.getAll(connection);

            for (CryptoFavori cryptoFavori : cryptoFavoris) {
                cryptoFavori.setMail(connection);
            }

            // Référence à Firestore
            CollectionReference cryptoFavoriRef = db.collection("cryptoFavori");

            // Récupérer les documents existants dans Firestore
            ApiFuture<QuerySnapshot> future = cryptoFavoriRef.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            Set<String> firestoreIds = new HashSet<>();
            Map<String, String> firestoreDocIds = new HashMap<>(); // Associe (mail_idCrypto) -> Document ID Firestore

            for (QueryDocumentSnapshot doc : documents) {
                String mail = doc.getString("user");
                double idCrypto = doc.contains("id_crypto") ? doc.getDouble("id_crypto") : 0;
                if (mail != null && idCrypto > 0) {
                    String key = mail + "_" + idCrypto;
                    firestoreIds.add(key);
                    firestoreDocIds.put(key, doc.getId()); // Stocker l'ID du document Firestore
                }
            }

            // Stocker les paires (mail, id_crypto) de PostgreSQL
            Set<String> dbIds = new HashSet<>();
            for (CryptoFavori crypto : cryptoFavoris) {
                String key = crypto.getMail() + "_" + crypto.getId_crypto();
                dbIds.add(key);
            }


            // Supprimer les cryptos obsolètes de Firestore
            for (String key : firestoreIds) {
                if (!dbIds.contains(key)) {
                    String docId = firestoreDocIds.get(key);
                    if (docId != null) {
                        cryptoFavoriRef.document(docId).delete(); // Supprimer le document Firestore
                    }
                }
            }

            // Ajouter les cryptos manquants dans Firestore
            for (CryptoFavori crypto : cryptoFavoris) {
                String key = crypto.getMail() + "_" + crypto.getId_crypto();
                if (!firestoreIds.contains(key)) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("user", crypto.getMail());
                    data.put("id_crypto", crypto.getId_crypto());
                    data.put("status", "favorite");
                    cryptoFavoriRef.add(data);
                }
            }
            connection.close();
        } catch (SQLException e) {
            throw e;
        }
    }

    public void stopListening() {
        if (cryptoFavoriListener != null) {
            // Retirer le listener
            cryptoFavoriListener.remove();
        }
    }
}
