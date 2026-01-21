<p align="center">
	<img src="https://img.shields.io/badge/Projet-SPIT%2081101-32455B?style=for-the-badge&logo=discord&logoColor=white" alt="Projet SPIT 81101" />
</p>

# SPIT 81101

Bot Discord (discord.js) pour gérer une murder : inscription des joueurs, gestion des PP, enquêtes à délai via keywords, interception / espionnage, et résumé de fin de partie.

---

## 🎨 Couleur principale

<span style="color:#32455B;font-weight:bold">#32455B</span>

---

## ✨ Fonctionnalités principales

- Commandes slash (deploy via REST)
- Inscription des joueurs (/register) + consultation des PP (/pp)
- Démarrage / arrêt de partie côté GM (/game start|stop)
- Distribution automatique de PP (toutes les heures, 3 fois) pendant une partie
- Enquêtes basées sur des keywords avec réponses différées en DM (/enqueter)
- Actions sur enquête : espionnage (/espionner) et interception (/intercepter)
- Résumé automatique en fin de partie (message dans le salon)

---

## 🚀 Démarrage rapide

### 1) Installation

```bash
npm install
```

---

### 2) Configuration (.env)

- Duplique [.env.example](.env.example) en `.env`
- Renseigne au minimum : `TOKEN`, `CLIENT_ID`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

---

### 3) Base de données

Le schéma est disponible dans [database/schema.sql](database/schema.sql).

Exemple (MySQL) :

```bash
mysql -u <user> -p <db_name> < database/schema.sql
```

---

### 4) Déployer les commandes slash

```bash
npm run deploy
```

---

### 5) Lancer le bot

```bash
npm start
```

---

## 🛠️ Scripts utiles

- Déployer les commandes slash :
	```bash
	npm run deploy
	```
- Lancer le bot :
	```bash
	npm start
	```

---

## 🧩 Commandes

- `/ping` : sanity check
- `/register` : s’inscrire à la partie (PP initiaux = 4)
- `/pp` : afficher tes PP
- `/game start|stop` (GM) : démarrer / arrêter la partie (+ résumé à l’arrêt)
- `/keyword add|delete|list` (GM) : gérer les mots-clés et leurs réponses/délais
- `/enqueter keyword:<mot> pp:<n>` : lancer une enquête (réponse en DM après délai du keyword)
- `/espionner joueur:<@user>` : espionner une enquête (coût : 2 PP)
- `/intercepter joueur:<@user>` : intercepter une enquête (coût : 3 PP)
- `/ppadmin list|add|remove` (GM) : voir/ajuster les PP des joueurs

---

## 📦 Structure technique

- [index.js](index.js) : client Discord + boucle de scheduling (PP + réponses différées)
- [deploy-command.js](deploy-command.js) : déploiement global des commandes slash
- [commands/](commands/) : implémentation des commandes
- [events/](events/) : `clientReady`, `interactionCreate`
- [handlers/](handlers/) : chargement dynamique des commandes & événements
- [managers/](managers/) : logique métier (game, players, keywords, scheduling, investigations…)
- [database/](database/) : pool MySQL + schéma SQL

---

## 📄 Licence

Voir le fichier [LICENSE](LICENSE).
