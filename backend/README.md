# Génération automatique d'un masque d'élévation avec Python
Le but du script est de générer de manière automatique un masque azimuth-élévation depuis un geotiff et une coordonnée définie au préalable.

## Exécution du code
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

### Les données de base pour le calcul

L'API d'extraction du masque d'observation fonctionne avec 
```
{
    "east": "2581190",
    "nord": "1119010",
    "i": "1.7",
    "minElevation": "5",
    "elevation": "1210"
}
```


