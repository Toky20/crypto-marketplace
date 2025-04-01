package firebase;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class FirestoreNotificationService {

    private final Firestore db;

    // 🔹 Constructeur qui récupère l'instance Firestore
    public FirestoreNotificationService() {
        this.db = FirestoreClient.getFirestore();
    }

    // 🔹 Méthode pour ajouter un email et un message dans Firestore
    public String saveNotification(String email, String message) {
        try {
            // Création de la structure de données
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("email", email);
            notificationData.put("message", message);
            notificationData.put("timestamp", Timestamp.now());

            // Ajout du document dans la collection "notifications"
            WriteResult result = db.collection("notifications").document().set(notificationData).get();

            return "Notification ajoutée avec timestamp : " + result.getUpdateTime();
        } catch (ExecutionException | InterruptedException e) {
            return "Erreur lors de l'enregistrement : " + e.getMessage();
        }
    }
}


