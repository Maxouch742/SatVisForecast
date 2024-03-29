# -*- coding: utf-8 -*-
"""
Created on Wed Mar  6 16:28:38 2024

@author: fschmidt
"""


from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import FUNCTION as mo

#general information on the reference model and image extraction
ImgOri = 'SRC_IMG\\SUISSE_ALL_V2.tif'
geoTiff_crop = 'SRC_IMG\\geoTiff_Crop.tif'
#half the length of the cutting right-of-way
sizeCut=8000.00
#define the step for filter the observation
intervalFilter=1.0

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise les requêtes depuis n'importe quel origine (à ajuster selon vos besoins)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

class SiteInformation(BaseModel):
    east: float
    nord: float
    i: float
    minElevation :float
    elevation : float

@app.post("/")
async def generationElevation(siteInformation: SiteInformation):
    print(siteInformation)
    leftHighPoint, rightLowPoint =mo.cuttingArea(siteInformation,sizeCut)
    mo.CutGeotiff(ImgOri,geoTiff_crop,leftHighPoint,rightLowPoint)
    siteInformation.elevation=mo.surchHeightSite(geoTiff_crop,siteInformation)
    imgGeoRefInformation, imageMatrix = mo.gdalinfoImage(geoTiff_crop)
    polarcoordinate=mo.PolarCoordinateCenterView(siteInformation, imgGeoRefInformation, imageMatrix)
    MasqueElevation=mo.FilterPolarcoordinate(polarcoordinate,siteInformation.minElevation,intervalFilter)
    print(siteInformation.elevation)
    return MasqueElevation
