package firebase;

public class NotificationRequest {

    private String email;
    private String message;

    // Constructeur
    public NotificationRequest(String email, String message) {
        this.email = email;
        this.message = message;
    }

    // Getters et Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // ToString pour faciliter le debug
    @Override
    public String toString() {
        return "NotificationRequest{" +
                "email='" + email + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
