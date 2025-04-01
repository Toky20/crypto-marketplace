# Instructions pour lancer les applications

1. **Construire le projet par la commande "docker-compose up -d"**
   - Attendre le building du projet jusqu'à ce que touts les containers 
   ont un statut "created"

2. **S'assurer que la BDD a bien été initalisée et démmarée**
   - Exécuter la commande "docker ps" et copier le nom du conteneur de la base de données
   - Exécuter la commande "docker logs -f (suivi du nom du conteneur de la base de données)"
   - Vérifier que le script de base a bien été installé et qu'à la fin
   le message "database system is ready to accept connections" apparait

3. **Executer l'url localhost:8080 dans le navigateur**
	un user à l'email de rojo.rabenanahary@gmail.com et mdp : 123456 est dispo 	


