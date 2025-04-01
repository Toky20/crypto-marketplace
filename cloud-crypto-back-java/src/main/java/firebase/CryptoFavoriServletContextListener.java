package firebase;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class CryptoFavoriServletContextListener implements ServletContextListener {
    private CryptoFavoriListener cryptoFavoriListener;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            System.out.println("Avant Initialisation");
            // Initialiser Firebase ou Firestore si nécessaire
            FirebaseInitializer.initialize();  // Si tu utilises un FirebaseInitializer pour configurer Firebase
            System.out.println("Après Initialisation");

            // Initialiser et démarrer l'écoute de Firestore (mvwallets)
            cryptoFavoriListener = new CryptoFavoriListener();
            cryptoFavoriListener.startListening();
            cryptoFavoriListener.updateFirestoreFromDb();
            System.out.println("crypto favori Listener démarré");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        try {
            if (cryptoFavoriListener != null) {
                // Arrêter l'écoute de Firestore lors de la destruction du contexte
                cryptoFavoriListener.stopListening();
                System.out.println("crypto favori Listener arrêté");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
