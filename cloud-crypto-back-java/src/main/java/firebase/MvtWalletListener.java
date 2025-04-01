/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package firebase;




import acces.Connexion;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentChange;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.ListenerRegistration;
import com.google.firebase.cloud.FirestoreClient;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import model.MouvementFiatWallet;

public class MvtWalletListener {

    private Firestore db;
    private ListenerRegistration walletListener;

    public MvtWalletListener() {
        // Initialisation de Firestore via FirestoreClient
        db = FirestoreClient.getFirestore();  // Utiliser FirestoreClient pour obtenir une instance de Firestore
    }
    
    public void startListening() {
        // Accéder à la collection mvwallets
        CollectionReference mvwalletsRef = db.collection("mvtwallets");

        // Ajout du listener sur la collection pour écouter les ajouts
        walletListener = mvwalletsRef.addSnapshotListener((querySnapshot, e) -> {
            if (e != null) {
                System.out.println("Erreur d'écoute des ajouts: " + e.getMessage());
                return;
            }
            if (querySnapshot != null) {
                // Lorsque la collection est mise à jour, parcourir les documents ajoutés
                querySnapshot.getDocumentChanges().forEach(documentChange -> {
                    System.out.println(documentChange.getType().toString()+" "+DocumentChange.Type.ADDED);
                    System.out.println(documentChange.getType().toString().equalsIgnoreCase("ADDED"));
                    if (documentChange.getType().toString().equalsIgnoreCase("ADDED")==true) {
                        System.out.println("huhu");
                        // Récupérer le document ajouté
                        DocumentSnapshot doc = documentChange.getDocument();
                        String user = doc.getString("user");
                        
                        double depot = doc.contains("depot") ? doc.getDouble("depot") : 0.0;
                        double retrait = doc.contains("retrait") ? doc.getDouble("retrait") : 0.0;
                        
                        // Extraire les valeurs du document
                        //com.google.cloud.Timestamp dateheure = doc.getTimestamp("dateheure");
                        //System.out.println(dateheure);
                        //System.out.println("noob"+user+depot+retrait+dateheure+new java.sql.Timestamp(dateheure.toDate().getTime()));
                        
                        System.out.println("Document ajouté: " + doc.getId() + " -> " + doc.getData() +"haha"+ doc.getString("user"));
                        
                                     

                        // Si un dépôt ou retrait est présent, créer un MouvementFiatWallet et insérer
                        if (depot > 0 || retrait > 0) {
                            MouvementFiatWallet mouvement = new MouvementFiatWallet();
                            mouvement.setDepot(depot);
                            mouvement.setRetrait(retrait);
                            mouvement.setEmail(user);  

                            // Insérer dans la base de données
                            try (Connection conn = new Connexion().getConnection()) {  // Assurez-vous d'avoir une méthode pour obtenir une connexion
                                mouvement.insertFromFb(conn);
                                System.out.println("Document inséré dans la base de données : " + doc.getId());
                                doc.getReference().delete();
                             
                            } catch (SQLException ex) {
                                ex.printStackTrace();
                                System.out.println("Erreur d'insertion dans la base de données.");
                            }
                        }
                    }
                });
            }
        });
    }


    public void stopListening() {
        if (walletListener != null) {
            // Retirer le listener
            walletListener.remove();
        }
    }
}


