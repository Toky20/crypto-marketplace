# Utilisez une image officielle de PostgreSQL comme base
FROM postgres:latest

# Définissez l'environnement
ENV POSTGRES_PASSWORD=postgres
#ENV POSTGRES_DB=cloud

# Créez un utilisateur PostgreSQL
#RUN useradd -ms /bin/bash -c "PostgreSQL user" postgres

# Copiez votre fichier de configuration PostgreSQL (si nécessaire)
# COPY postgresql.conf /etc/postgresql/15/main/postgresql.conf

# Exécutez des commandes SQL à l'initialisation (facultatif)
COPY init.sql /docker-entrypoint-initdb.d/

# Exposez le port PostgreSQL
EXPOSE 5432

# Commande à exécuter au démarrage du conteneur
CMD ["postgres"]