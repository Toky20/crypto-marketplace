# Utiliser une image Node.js de base
FROM node:20

# Créer un répertoire de travail
WORKDIR /app

# Copier le package.json et le verrouiller
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]