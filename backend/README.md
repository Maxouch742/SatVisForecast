# Génération automatique d'un masque d'élévation avec Python
Le but du script est de générer de manière automatique un masque azimuth-élévation depuis un geotiff et une coordonnée définie au préalable.
Le code retourne un JSON avec les azimuths, élévations et coordonnées des élévations maximales.
La totalité du programme est crée avec python.

## Information préalable
Utiliser la version de python en 3.9 pas plus récent, problème de compatibilité avec les extensions.
### Extensions utiles
```python
import numpy as np
from osgeo import gdal, gdalconst, osr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import FUNCTION as mo
```
Les functions utiles sont dans le fichier `FUNTION.py` et appelées dans le code comme `mo`.

Plus d'informations sur `Gdal` : [OSGEO 4W](https://trac.osgeo.org/osgeo4w/)


### Donnée de base
Afin de générer un masque personnalisé plusieurs variable sont disponibles afin de définir :
- emplacement du Geotiff, 'ImgOri' : grille raster avec information de l'altitude dans la première bande
- emplacement du Geotiff, 'geotiff_crop'  : extrait, ce fichier est temporaire
- taille du demi carrée de coupe, 'sizeCut' : par rapport au point de référence un Geotif de 16km de coté est extrait avec comme centre le point d'étude
- défnition de l'interval de filtrage des données, 'intervalFilter', en degré


La génération du masque d'obstruction (élévation) est réalisée sur la base d'un Geotiff.
```python
#general information on the reference model and image extraction
ImgOri = 'SRC_IMG\\SUISSE_ALL_V2.tif'
geoTiff_crop = 'SRC_IMG\\geoTiff_Crop.tif'
#half the length of the cutting right-of-way
sizeCut=8000.00
#define the step for filter the observation
intervalFilter=1.0
```

### Configuration de l'API
Le script python est configuré afin de fonctionner en Backend avec une solution [FastAPI](https://fastapi.tiangolo.com/).

>[!IMPORTANT]
>La commande FastAPI doit être lancé dans le répertoire backend où se trouve le fichier 'main.py'.
>Commande à exécuter dans un terminal : 'uvicorn main:app --reload'.

### Paramètres initiaux

L'API d'extraction du masque d'observation fonctionne avec un JSON comme paramètres d'entreée, ci-dessous les éléments pris en compte, la coordonnée est le point à analyser :
```json
{
    "east": "2581190",
    "nord": "1119010",
    "i": "1.7",
    "minElevation": "5",
    "elevation": "1210"
}
```
## Etapes de la génération du masque d'observation
### 1. Image d'analyse
Extraction d'une image à l'aide de `Gdal`, GeoTiff, de 16km par 16km avec comme point centrale le point d'analyse. L'image est stocker temporairement en local.
### 2. GeoTiff -> Array
Transformation du GeoTiff en une matrice Array avec les outils de `Gdal`. La matrice est de la forme de l'image taille identique aux nombres de pixels, dans chaque élément est renseigné la valeur de la bande 1, ici l'altitude.
### 3. Calcul azimuth, élévation
Calcul systhématique de toutes les orientations et élévations depuis le point d'étude vers tous les éléments de la matrice. 
Stockage des informations calculées dans une liste avec les informations suivantes pour chaque élément de la matrice.
```python
coopolar =[theta, 
            phi, 
            dist2d,
            i, j,
            estpoinvise,
            nordpointvise,
            altitude]
polarcoordinate.append(coopolar)
```
### 4. Recherche de l'élévation maximum
Analyse de la table de coordonnée polaire et extraction avec un pas de 1 degré l'élévation maximale autour du point à analyser.
Stockage des informations dans une nouvelle liste uniquement avec les valeurs maximums.
### 5. Résultats
<<<<<<< Updated upstream
La nouvelle liste est retournée à la requette pour exploitation.
=======
La nouvelle liste est retournée à la requête pour exploitation.
>>>>>>> Stashed changes
