# SatVisForecast

This application prototype was created as part of the "MDT - GIO 2024" course. 
The aim of the web-app is to ge the potential GNSS visibility according to local terrain.

SatVisForecast was developped by a team of 3 people:
- [Matteo Casto](https://github.com/MatteoCasto)
- [Maxime Fourquaux](https://github.com/Maxouch742)
- [Franck Schmidt](https://github.com/franckvs)

The rest of the report is written in French for ease of use.

## Description 

L'outil permet de fournir les satelites visibles depuis un point donné en Suisse. Le masque du relief local est généré automatiquement à partir du modèle 3D altimétrique de Swisstopo (API). Cela permet de tenir compte de la topographie locale de chaque lieu pour une analyse pertinente du potentiel GNSS, notamment dans les régions à fort masques (vallées, etc.).

 **Les paramètres de calcul sont les suivants :**
- Position : E,N -> à cliquer sur la carte
- Hauteur de l'instrument
- Mask d'élévation minimum
- Date et heure pour l'analyse des satellites

Les résultats de l'analyse sont:
- Plot du ciel avec les satelittes (temps demandé avec trace de 6h dans le futur), le masque du terrain local et le masque d'élévation général
- Carte 2D avec emprise du masque du terrain lcoal (ex: crêtes de montagnes)

![Exemple de génération](images/exemple.png)

## Détails techniques

### API utilisées

#### 1. Celestrak
**TODO**


#### 2. api3.geo.admin 
Lien : https://api3.geo.admin.ch/services/sdiservices.html 

 ***Profile***

Utilisation de la partie génération automatique de profil. Permet de générer des profils altimétrique à partir d'une liste de segment, défini par rayonnement tous les degrés. 
Les profils sont générés sur 8km avec 1'000 points soit un point tous les 8m.




## Installation du projet (mode: développeur)
1. Clone/fork le projet sur votre laptop:
```
git clone https://github.com/Maxouch742/SatVisForecast.git
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

4. Lancement d'une page web à l'adresse du localhost, par exemple
 ```
App running at:
- Local:   http://localhost:xxxx/ 
- Network: http://192.168.10.153:xxxx/
``` 


## Licence
Copyright (c) 2024 HES-SO, MSc in geomatics engineering

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
