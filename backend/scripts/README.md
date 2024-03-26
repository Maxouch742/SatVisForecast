# Code Python pour la génération automatique d'un masque d'élévation
Le but du script est de générer de manière automatique un masque azimuth-élévation depuis un geotiff et une coordonnée définie au préalable.

## Principe de fonctionnement

Le script python est configuré afin de fonctionner en Backend avec une solution [FastAPI](https://fastapi.tiangolo.com/).
La commande FastAPI doit être lancé dans le répertoire backend où se trouve le fichier 'main.py' est la suivante : 'uvicorn main:app --reload'.

## Les données de base pour le calcul

L'API d'extraction du masque d'observation fonctionne avec 
'''
{
    "east": "2581190",
    "nord": "1119010",
    "i": "1.7",
    "minElevation": "5",
    "elevation": "1210"
}
'''
