# SatVisForecast

This application prototype was created as part of the "MDT - GIO 2024" course. 
The aim of the web-app is to ge the potential GNSS visibility according to local terrain.

SatVisForecast was developped by a team of 3 people:
- [Matteo Casto](https://github.com/MatteoCasto)
- [Maxime Fourquaux](https://github.com/Maxouch742)
- [Franck Schmidt](https://github.com/franckvs)

The rest of the report is written in French for ease of use.

## Description 

L'outil permet de fournir les satelites visibles depuis un point. Le masque d'obstruction est généré automatiquemnt à partir de modèle 3D altimétrique de Swisstopo. Cela permet de tenir compte de la topographie de chaque lieu.

 **Les paramètres de calcul sont les suivants :**
- Position : E,N
- Hauteur de l'instrument
- Mask d'élévation minimum
- Date et heure pour l'analyse des satelites

Les résultats de l'analyse sont un masque avec plot des satelites visibles et les traces au sol sur une carte.

![Exemple de génération](images/exemple.png)

## Détails techniques

### API utilisées
#### 1. Celestrak
#### 2. api3.geo.admin 
Lien : https://api3.geo.admin.ch/services/sdiservices.html 

 ***Profile***

Utilisation de la partie génération automatique de profil. Permet de générer des profils altimétrique à partir d'une liste de segment, défini par rayonnement tous les degrés. 
Les profils sont générés sur 8km avec 1'000 points soit un point tous les 8m.

#### 3. reframe

## Installation du projet (mode: développeur)
1. Clone/fork le projet sur votre laptop:
```git
git clone ...
```
2. Installation des dépendances (si vous n'avez pas NodeJS, il faut préalablement l'installer) :
```
cd frontend
npm install
```
3. Démarage du site internet en local, lancer la commande :
```
npm run serve
```

4. Lancement d'une page web à l'adresse du localhost par exemple
 ```
App running at:
- Local:   http://localhost:8080/ 
- Network: http://192.168.10.153:8080/
``` 


## Crédits

## Licence
