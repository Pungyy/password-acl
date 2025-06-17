# Exercice : Système d'authentification sécurisé avec Hono

## Objectif
Créer une API REST sécurisée permettant la gestion des utilisateurs et des autorisations avec les technologies modernes.

## Technologies requises
- Framework Hono (TypeScript)
- Zod pour la validation des données
- Argon2 pour le hachage des mots de passe
- AccessControl pour la gestion des ACL
- JWT pour l'authentification

## Informations importante
La base du projet a déjà été codée pour vous, vous allez devoir vous concentrer sur ce qu'il manque pour que le projet fonctionne.
Vous êtes libres de créer des fichiers et de vous organiser comme vous le souhaitez, le tout est de répondre aux exigences.

Afin de tester vos routes, vous avez accès à des collection **Bruno** dans le dossier `password-acl`, j'assume que vous êtes assez familier avec
ce programme car nous l'avons utilisé dans nos autres exercices.

Vous trouverez aussi dans certains fichiers des notations en commentaire pour vous indiquer ce que vous devez faire

n'oubliez pas de créer un .env sur la base de exemple.env pour que votre application puisse s'initialiser, pensez bien à utiliser de valeurs sécurisées et conforme à ce que nous avons évoqués dans les cours précédents ou dans le glossaire

> Attention dans l'état actuel des choses l'application fonctionne mais ne repond pas aux exigences définies ci dessous, à vous de les implémenter pour que tout fonctionne comme convenu

## Fonctionnalités à implémenter

### 1. Gestion des utilisateurs
- Inscription (register)
- Connexion (login)
- Déconnexion (logout)
- Gestion des tokens (refresh)

### 2. Sécurité
- Validation des données entrantes avec Zod
- Hachage sécurisé des mots de passe avec Argon2
- Système de double token (access + refresh)
- Protection contre les attaques courantes

### 3. Contrôle d'accès
- Implémentation de rôles (admin, user, guest)
- Gestion fine des permissions avec AccessControl
- Middleware de vérification des permissions
- Gestion des ressources personnelles (own) et globales

## Contraintes techniques
1. Les mots de passe doivent :
   - Avoir au moins 8 caractères
   - Contenir au moins une lettre et un chiffre

2. Le système de tokens doit :
   - Utiliser un access token de courte durée
   - Utiliser un refresh token de longue durée
   - Permettre le renouvellement des tokens

3. Les permissions doivent :
   - Être héritées hiérarchiquement
   - Distinguer les ressources personnelles
   - Être vérifiées à chaque requête

## Routes à implémenter
```
// Sans ACL
POST /register    : Inscription d'un nouvel utilisateur
POST /login      : Connexion d'un utilisateur
POST /logout     : Déconnexion
POST /refresh-token : Renouvellement du token

//Avec ACL
GET    /api/profile/:id : Consultation d'un profil (renvoyez une simple chaine de caractère ces routes sont là pour tester vos acl)
POST   /api/data       : Création de données (pareil qu'au dessus)
PUT    /api/data/:id   : Modification de données (pareil qu'au dessus)
DELETE /api/data/:id   : Suppression de données (pareil qu'au dessus)
```

## Bonus
- Ajout d'éléments de sécurité pour eviter les params bombs, les requêtes malveillantes etc
- Tests fonctionnels comme ceux présents en exemple



// Voici ce qui a été fait.