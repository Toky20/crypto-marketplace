/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package firebase;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class MvtWalletServletContextListener implements ServletContextListener {
    private MvtWalletListener mvWalletListener;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            System.out.println("Avant Initialisation");
            // Initialiser Firebase ou Firestore si nécessaire
            FirebaseInitializer.initialize();  // Si tu utilises un FirebaseInitializer pour configurer Firebase
            System.out.println("Après Initialisation");

            // Initialiser et démarrer l'écoute de Firestore (mvwallets)
            mvWalletListener = new MvtWalletListener();
            mvWalletListener.startListening();
            System.out.println("MvWallet Listener démarré");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        try {
            if (mvWalletListener != null) {
                // Arrêter l'écoute de Firestore lors de la destruction du contexte
                mvWalletListener.stopListening();
                System.out.println("MvWallet Listener arrêté");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

