/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class FirebaseInitializer {
    private static boolean initialized = false;

    public static synchronized void initialize() throws Exception {
        if (initialized) {
            return;
        }

        // JSON des credentials directement dans le code (PAS SÉCURISÉ pour production)
        String firebaseConfig = "{\n" +
                "  \"type\": \"service_account\",\n" +
                "  \"project_id\": \"essai-36122\",\n" +
                "  \"private_key_id\": \"d661b75cf76f2e216c27f87db766a75be2ee2534\",\n" +
                "  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtoI0V0vU2SHtw\\nkNisj5KVrSUF8HflTa4HiTVhUhANrEMn4Vh49Z3C/CN+oEhaQtczV9cUMH7TCWH6\\nGgWeA+q0QVlRP39oURXdaTSxo6wss+T2t48Kz1r2iaSQTxsijFVW/jY2ieEoYWbI\\nf+2eHtPiR7ylp/3KAnYi/43lT3rUR1gp8RkygCbmu2HAB/40Sgq2rJaEtBADrAvX\\nvZVQGdUDVXVoA19vHw0ci+M0QTGMVw9IyuxRsj8dPXjfOczqtGfEQZoi7AMlto2j\\nMHj3HE2clTUo0swaBEt4Duk0o+PtiSaHyL2NAb5fup+OrheL+xnmnYIJRhx3Sg/h\\n+5ZQNHfbAgMBAAECggEAC7spTSwvvTcwf+6JdT9OHCbStZAFycxx0biHjsfIpePZ\\ntbwYCjQuMJpwm4Gg4dhaSfHJamfMad3cbNWNQ5voI722lzK/HQE9hPQyxz3TyEFv\\nWuwUEhrofnfWUpnFr5PjwDj02MKAIAZUt39NQr26ezN1n4u2Lgv0h3DU2YWBOw5q\\naOOVSYFOnSnLHhHVq7Qk9G4hG9MV8/6esINMAZsjZ6faXCMd0j6LM/LyDoTtL2+S\\nOzOJ4lRMD48gHAkvnaCYbaU3dmnkVzGvel1lDr1J+QzLSw1uzgFB1Sh6q+jbrpo2\\nU69h55UBdpNqi1iWpm9RKzlwVXbaWi8n+IKjXLyD4QKBgQDjKXjzKjSOL2RREmyb\\niEuTVQkOsEqY2QZMjp9wa1SI5fwwwAGIFjPuJqN63VXx0k29szNzffGMPYtb5JxB\\nAn0wOHEYQ4koRyEw90PR1FO0/xZjw9/9Y+c5I0dXKVNFZK9W66T/D+LnZLZ9YIEj\\n9sbpNVS6BWEvvOW/cQrlWDCoNwKBgQDDq0CFemK3GV5y+D9cVsl4gSR7ddEyTjpK\\nFtIH7zoF4fV7AH4kvUMlSqeKP9onMVIRXcG6oITlhvDNebsq2Sv/c+ZpnLTKnmiT\\nPrinW//TOAuh/uw5lYDAjuweZNaKNxuqRKBMiiI/iEMzmJpzhg77ICLhhEnDRfup\\nfm722BvTfQKBgGJxSZIPe0EW9qFPm7N3SFEr68XqzhkZC+rHb/729GZzTGwP+Vnx\\nTUXqhrQrESC/46LO8wAc1z3QOgFzu+dMXdY0z4YVVm4XDSI8Na7MFg588UYAz6Pu\\n1HhlengiV4zeCkJf0lwalVlzwsXouW5Ndnv/+Zy30hsvAF2Lbo5fPo7XAoGBALOW\\nn56jCK2TLDwLm2PuB/aBWXGzXjF02U0dCuLbb/7sOHoPprejulgk4Ackud6VBwUH\\nb4MSR0e/hY6h9ubJ8vcAcm9mtAzwPX0/6Q06hGBhpVOm/TuQ+15BD3iKBttO3yZ0\\n3EfD1NFJCJz3qHL1jRRyl3EzENyYg/Y6JDCNg2SlAoGBAMPQRzq7XzhWTBaUmQMC\\ntmPXiJAtJ7uqKyWZDgi618AMIEkGN/iQldRI3xflciijpaRpYE78bBNSJ3PuzLOH\\nD7j0KYL+z41qwqpKAvZ8Gqiiy+mPi5prwo6TggA2SnglpUM+SozdSJ/TzNIVt2LQ\\nL3oN3nje7sHFaSNfkRduLpB2\\n-----END PRIVATE KEY-----\\n\",\n" +
                "  \"client_email\": \"firebase-adminsdk-p6nve@essai-36122.iam.gserviceaccount.com\",\n" +
                "  \"client_id\": \"102769995099820353150\",\n" +
                "  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n" +
                "  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n" +
                "  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n" +
                "  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p6nve%40essai-36122.iam.gserviceaccount.com\",\n" +
                "  \"universe_domain\": \"googleapis.com\"\n" +
                "}";
        try (InputStream serviceAccount = new ByteArrayInputStream(firebaseConfig.getBytes(StandardCharsets.UTF_8))) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            initialized = true;
            System.out.println("Firebase Initialized");
        }
    }
}

