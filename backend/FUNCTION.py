# -*- coding: utf-8 -*-
"""
Created on Wed Mar  6 16:28:38 2024

@author: fschmidt
"""

import os
os.environ['PROJ_LIB'] = 'C:\\OSGeo4W\\share\\proj'
os.environ['GDAL_DATA'] = 'C:\\OSGeo4W\\share'
import numpy as np
#import matplotlib.pyplot as plt
from osgeo import gdal,gdalconst,osr

#Principal function to create a elevation mask

def cuttingArea(siteInformation,sizeCut):
    """
    calculation of a point offset one on the top left the other low right

    Args:
        coordinate : center point
        sizeCut : half size for the distance

    Returns:
       Liste with the east and nord coordinate
    """
    highLeft=(siteInformation.east-sizeCut,siteInformation.nord+sizeCut)
    lowRight=(siteInformation.east+sizeCut,siteInformation.nord-sizeCut)

    return highLeft, lowRight

def surchHeightSite(path,siteInformation):
    """
    Extraction of geotif elevation for a given coordinate 
    Parameters
    ----------
    path : path of the image
    coordinate : coordinate of the point

    Returns
    -------
    elevation : altitude of the point, variable float

    """
    # Open the image
    image = gdal.Open(path)
    
    # onvert projected coordinates to pixel coordinates
    imageInformation = image.GetGeoTransform()
    pixel_x = int((siteInformation.east - imageInformation[0]) / imageInformation[1])
    pixel_y = int((siteInformation.nord - imageInformation[3]) / imageInformation[5])
    
    # Stock the first strip of the image
    bande = image.GetRasterBand(1)
    
    # Find the pixel value in the matrix and return it
    elevation = bande.ReadAsArray(pixel_x, pixel_y, 1, 1)[0,0]
    
    # Close image
    image = None
    return elevation

def CutGeotiff(geoTiff_entree, geoTiff_crop, leftHighPoint, rightLowPoint):
    """
    Cutting a GeoTIFF from coordinates.

    Args:
        geoTiff_entree (str): GeoTIFF entrance path..
        geoTiff_crop (str): Cut-out GeoTIFF exit path.
        leftHighPoint : upper left point
        rightLowPoint : lower right point 

    Returns:
        None : the file is saved on the hard disk
    """
    imageToCut = gdal.Open(geoTiff_entree, gdalconst.GA_ReadOnly)

    # cut the geotif according to the coordinates outputBound=[top_left_E,low_right_N,low_right_E,top_left_N]
    gdal.Warp(geoTiff_crop, imageToCut,srcSRS=None, dstSRS=None, cutlineSQL=None, outputBounds=[leftHighPoint[0], rightLowPoint[1], rightLowPoint[0], leftHighPoint[1]])
    # Close all GeoTIFF file
    imageToCut = None
    geoTiff_crop=None

def gdalinfoImage(filepath):
    """
    Read the geotiff and extract information on the coordinates of the first pixel at top left, as well as the pixel size 
    the number of bands in the image. All image information is then stored in a matrix array along with the information contained in band 1.

    Args:
        filepath for the image

    Returns:
        table in matrix form with the contents of the first band here altitude
        image information: coo pixel top left, pixel size
    """
    
    # Open the raster dataset
    image = gdal.Open(filepath)

    if image is None:
        print("Failed to open the dataset!")
        return
    
    # let's see how many bands we have in elevation.tif
    image.RasterCount

    # get the first and only band; note here that band numbering is 1-based
    band = image.GetRasterBand(1)

    # read the band as a matrix
    imageMatrix = band.ReadAsArray()

    # Georeferencing information
    geoRefInformation = image.GetGeoTransform()
    if geoRefInformation:
        print(f"Origin = ({geoRefInformation[0]}, {geoRefInformation[3]})")
        print(f"Pixel Size = ({geoRefInformation[1]}, {geoRefInformation[5]})")

    image = None  # Close the dataset
    os.remove(filepath)    
    
    return geoRefInformation, imageMatrix


def PolarCoordinateCenterView(siteInformation, informationimage, imageMatrix):
    """
    Calculation of polar elements in relation to observation points, to produce an obstruction map
    
    Args:
        centerview : coordonnées du points d'analyse
        informationimage : information de l'image (coo premier pixel et taille pixel)
        imageMatrix : tableau matrice des pixels et altitudes
        minelevation : elevation minimum 

    Returns:
        Liste avec les coordonnées polaires 
    """
    #définition du centre de vue avec calcul de l'altitude exact
    coocenterview = [siteInformation.east,siteInformation.nord,siteInformation.elevation+siteInformation.i]
    #liste avec les éléments calculés tel que [tetha, phi, dist2d, pixel i, pixel j, Epts visé, N pts visé, altitude]
    polarcoordinate=[]
    #definition de la coordonnée du premier points du tableau
    firstpointcoordinate=[informationimage[0],informationimage[3]]
    #définition du pas d'incrémentation
    stepcoordinate=[informationimage[1],informationimage[5]]
    #initialisation du compteur
    i=-1
    #calcul des éléments polaires avec itérations sur le tableau ligne par ligne
    for ligne in imageMatrix:
        i=i+1
        j=-1
        nordpointvise = firstpointcoordinate[1]+i*stepcoordinate[1]
        for altitude in ligne :
            j=j+1
            estpoinvise = firstpointcoordinate[0]+j*stepcoordinate[0]
            deltah = altitude-coocenterview[2]
            dist2d = np.sqrt((coocenterview[0]-estpoinvise)**2+(coocenterview[1]-nordpointvise)**2)
            phi = np.rad2deg(np.arctan(deltah/dist2d))
            if phi >= siteInformation.minElevation and dist2d>10.0 :
                theta = np.rad2deg(np.arctan2(estpoinvise-coocenterview[0],nordpointvise-coocenterview[1],))
                #supression valeur négative tout est ramener dans le sens horraire
                if theta<0 :
                    theta=theta+360.0
                coopolar =[theta, phi, dist2d, i, j, estpoinvise, nordpointvise, altitude]
                polarcoordinate.append(coopolar)
                
    return polarcoordinate


def FilterPolarcoordinate(polarcoordinate,minelevation,intervalfilter):
    """
   Selection of the most important elevations according to a direction within a defined inteval: x and every x degrees.
   Elevations smaller than the minimum are eliminated.

    Args:
        polarcordinate : list of the observation direction elevation
        mineleavation : minimum elevation
        intervalfilter : value for step and interval
        
    Returns:
        polarcoordinatefilter : list of filtered values
    """
    #angular step filter loop
    polarcoordinatefilter=[]
    #increment initialization
    initstep=0
    for initstep in range(360):
        #list with observation in a intervall
        thetainstep = [observation for observation in polarcoordinate if initstep <= observation[0] <= initstep+intervalfilter]
        if len(thetainstep)>=1 :
            phimax = max(sous_liste[1] for sous_liste in thetainstep)  
            position_max = [i for i, sous_liste in enumerate(thetainstep) if sous_liste[1] == phimax]
            observphimax=thetainstep[position_max[0]]
            polarcoordinatefilter.append(observphimax)
            
        else :
            elevationficive = [initstep+(intervalfilter/2),minelevation]
            polarcoordinatefilter.append(elevationficive)
                
    polarcoordinatefilter.sort(key=lambda x: x[0])
   # print(polarcoordinatefilter)

    return polarcoordinatefilter