const fs = require('fs');
const path = require('path');

class Util {
    static getMaxAttempts() {
        try {
            const configPath = path.resolve(__dirname, 'config.json'); // Aller deux niveaux en arrière pour atteindre la racine
            const config = JSON.parse(fs.readFileSync(configPath));
            return config.maxAttempts || 3; // Valeur par défaut à 3 si elle n'est pas définie
        } catch (error) {
            console.error('Erreur de lecture du fichier de configuration:', error);
            return 3; // Retourner une valeur par défaut en cas d'erreur
        }
    }
    
    
}

module.exports = Util;
