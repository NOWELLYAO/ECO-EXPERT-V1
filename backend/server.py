from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta, timezone
import math
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ── Authentification ──
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me-in-production-' + str(uuid.uuid4()))
JWT_ALGORITHM = 'HS256'
JWT_EXPIRE_DAYS = 30
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
bearer_scheme = HTTPBearer(auto_error=False)


# Create the main app without a prefix
app = FastAPI()

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """Messages d'erreur de validation plus lisibles (ex: champ requis, valeur hors limites)"""
    errors = []
    for err in exc.errors():
        field = ".".join(str(p) for p in err.get("loc", []) if p != "body")
        errors.append(f"{field}: {err.get('msg')}")
    return JSONResponse(status_code=422, content={"detail": "Données invalides — " + " | ".join(errors)})

@app.exception_handler(ZeroDivisionError)
async def zero_division_handler(request, exc):
    return JSONResponse(status_code=400, content={"detail": "Calcul impossible : une valeur d'entrée (diamètre, longueur...) est nulle. Vérifiez vos paramètres."})

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============================================================================
# PIPE MATERIALS AND FITTINGS DATABASE
# ============================================================================

PIPE_MATERIALS = {
    "pvc": {
        "name": "PVC",
        "roughness": 0.0015,  # mm
        "description": "Polychlorure de vinyle"
    },
    "pehd": {
        "name": "PEHD",
        "roughness": 0.007,  # mm
        "description": "Polyéthylène haute densité"
    },
    "steel": {
        "name": "Acier",
        "roughness": 0.045,  # mm
        "description": "Acier commercial"
    },
    "steel_galvanized": {
        "name": "Acier galvanisé",
        "roughness": 0.15,  # mm
        "description": "Acier galvanisé"
    },
    "cast_iron": {
        "name": "Fonte",
        "roughness": 0.25,  # mm
        "description": "Fonte"
    },
    "concrete": {
        "name": "Béton",
        "roughness": 0.3,  # mm
        "description": "Béton lissé"
    }
}

FITTING_COEFFICIENTS = {
    "elbow_90": {"name": "Coude 90°", "k": 0.9},
    "elbow_45": {"name": "Coude 45°", "k": 0.4},
    "elbow_30": {"name": "Coude 30°", "k": 0.2},
    "tee_through": {"name": "Té passage direct", "k": 0.6},
    "tee_flow": {"name": "Té passage direct", "k": 0.6},
    "tee_branch": {"name": "Té dérivation", "k": 1.8},
    "gate_valve_open": {"name": "Vanne guillotine ouverte", "k": 0.15},
    "gate_valve_half": {"name": "Vanne guillotine mi-ouverte", "k": 5.6},
    "gate_valve": {"name": "Vanne guillotine", "k": 0.15},
    "globe_valve": {"name": "Vanne à soupape (globe)", "k": 6.0},
    "butterfly_valve": {"name": "Vanne papillon", "k": 0.3},
    "ball_valve": {"name": "Vanne à boule", "k": 0.05},
    "check_valve": {"name": "Clapet anti-retour", "k": 2.0},
    "foot_valve": {"name": "Clapet de pied (crépine + anti-retour)", "k": 2.5},
    "strainer": {"name": "Crépine / filtre", "k": 1.5},
    "flow_meter": {"name": "Débitmètre", "k": 0.3},
    "pressure_gauge": {"name": "Manomètre (piquage, pas dans le flux)", "k": 0.0},
    "reducer": {"name": "Réducteur", "k": 0.5},
    "reducer_gradual": {"name": "Réducteur progressif", "k": 0.15},
    "reducer_sudden": {"name": "Réducteur brusque", "k": 0.5},
    "enlarger": {"name": "Élargisseur", "k": 1.0},
    "entrance_sharp": {"name": "Entrée vive", "k": 0.5},
    "entrance_smooth": {"name": "Entrée arrondie", "k": 0.1},
    "exit": {"name": "Sortie", "k": 1.0}
}

FLUID_PROPERTIES = {
    "water": {
        "name": "Eau",
        "density_20c": 1000,  # kg/m³
        "viscosity_20c": 0.001,  # Pa·s
        "vapor_pressure_20c": 2340,  # Pa
        "temp_coeffs": {
            "density": -0.2,  # kg/m³/°C
            "viscosity": -0.00005,  # Pa·s/°C
            "vapor_pressure": 100  # Pa/°C
        }
    },
    "oil": {
        "name": "Huile Hydraulique",
        "density_20c": 850,
        "viscosity_20c": 0.05,
        "vapor_pressure_20c": 100,
        "temp_coeffs": {
            "density": -0.7,
            "viscosity": -0.002,
            "vapor_pressure": 20
        }
    },
    "acid": {
        "name": "Solution Acide",
        "density_20c": 1200,
        "viscosity_20c": 0.002,
        "vapor_pressure_20c": 3000,
        "temp_coeffs": {
            "density": -0.3,
            "viscosity": -0.0001,
            "vapor_pressure": 150
        }
    },
    "glycol": {
        "name": "Éthylène Glycol",
        "density_20c": 1113,
        "viscosity_20c": 0.0161,
        "vapor_pressure_20c": 10,
        "temp_coeffs": {
            "density": -0.8,
            "viscosity": -0.0008,
            "vapor_pressure": 5
        }
    },
    # NOUVEAUX FLUIDES INDUSTRIELS - Extension Expertise Hydraulique
    "palm_oil": {
        "name": "Huile de Palme",
        "density_20c": 915,  # kg/m³ (ASTM D1298)
        "viscosity_20c": 0.045,  # Pa·s (à 20°C)
        "vapor_pressure_20c": 0.001,  # Pa (très faible)
        "temp_coeffs": {
            "density": -0.65,  # Coefficient thermique typique huiles végétales
            "viscosity": -0.0018,  # Forte variation avec température
            "vapor_pressure": 0.0001
        },
        "technical_specs": {
            "flash_point": 315,  # °C
            "pour_point": 2,  # °C
            "saponification_value": 199,  # mg KOH/g
            "iodine_value": 53,  # g I2/100g
            "compatibility": ["stainless_steel", "bronze", "pvc"],
            "incompatibility": ["galvanized_steel", "copper_alloys"]
        }
    },
    "gasoline": {
        "name": "Essence (Octane 95)",
        "density_20c": 740,  # kg/m³ (ASTM D4052)
        "viscosity_20c": 0.00055,  # Pa·s (très faible)
        "vapor_pressure_20c": 13000,  # Pa (très volatile)
        "temp_coeffs": {
            "density": -0.9,  # Fort coefficient pour hydrocarbures légers
            "viscosity": -0.000015,  # Très faible viscosité
            "vapor_pressure": 850  # Augmentation rapide avec température
        },
        "technical_specs": {
            "flash_point": -43,  # °C (très inflammable)
            "autoignition_temp": 280,  # °C
            "octane_rating": 95,
            "reid_vapor_pressure": 90,  # kPa
            "compatibility": ["stainless_steel", "ptfe", "viton"],
            "incompatibility": ["rubber", "pvc", "copper"]
        }
    },
    "diesel": {
        "name": "Gazole (Diesel)",
        "density_20c": 840,  # kg/m³ (EN 590)
        "viscosity_20c": 0.0035,  # Pa·s (à 20°C)
        "vapor_pressure_20c": 300,  # Pa
        "temp_coeffs": {
            "density": -0.75,  # Coefficient pour gazole
            "viscosity": -0.00012,
            "vapor_pressure": 25
        },
        "technical_specs": {
            "flash_point": 65,  # °C minimum (EN 590)
            "cetane_number": 51,  # minimum
            "sulfur_content": 10,  # mg/kg maximum
            "cold_filter_plugging_point": -5,  # °C
            "compatibility": ["carbon_steel", "stainless_steel", "aluminum"],
            "incompatibility": ["zinc", "copper"]
        }
    },
    "hydraulic_oil": {
        "name": "Huile Hydraulique ISO VG 46",
        "density_20c": 875,  # kg/m³ (ISO 3675)
        "viscosity_20c": 0.046,  # Pa·s (équivalent à 46 cSt)
        "vapor_pressure_20c": 0.1,  # Pa (très faible)
        "temp_coeffs": {
            "density": -0.65,
            "viscosity": -0.0019,  # Indice de viscosité ~100
            "vapor_pressure": 0.02
        },
        "technical_specs": {
            "iso_grade": "VG 46",
            "viscosity_index": 100,  # Minimum selon ISO 11158
            "flash_point": 220,  # °C minimum
            "pour_point": -30,  # °C maximum
            "anti_wear_additives": True,
            "compatibility": ["steel", "cast_iron", "bronze", "nitrile"],
            "incompatibility": ["zinc", "natural_rubber"]
        }
    },
    "ethanol": {
        "name": "Éthanol (95%)",
        "density_20c": 810,  # kg/m³
        "viscosity_20c": 0.0012,  # Pa·s
        "vapor_pressure_20c": 5870,  # Pa (volatile)
        "temp_coeffs": {
            "density": -1.05,  # Fort coefficient pour alcool
            "viscosity": -0.00004,
            "vapor_pressure": 420
        },
        "technical_specs": {
            "flash_point": 17,  # °C (inflammable)
            "boiling_point": 78,  # °C
            "concentration": 95,  # % vol
            "ph": 7.0,  # Neutre
            "compatibility": ["stainless_steel", "ptfe", "epdm"],
            "incompatibility": ["aluminum", "zinc", "natural_rubber"]
        }
    },
    "seawater": {
        "name": "Eau de Mer",
        "density_20c": 1025,  # kg/m³ (salinité 35‰)
        "viscosity_20c": 0.00107,  # Pa·s (légèrement supérieure à l'eau douce)
        "vapor_pressure_20c": 2280,  # Pa (légèrement inférieure à l'eau pure)
        "temp_coeffs": {
            "density": -0.25,  # Légèrement différent de l'eau pure
            "viscosity": -0.000052,
            "vapor_pressure": 95
        },
        "technical_specs": {
            "salinity": 35,  # g/L (‰)
            "chloride_content": 19000,  # mg/L
            "ph": 8.1,  # Légèrement basique
            "electrical_conductivity": 50000,  # µS/cm
            "compatibility": ["316L_stainless", "duplex_steel", "bronze_naval"],
            "incompatibility": ["carbon_steel", "aluminum", "zinc"]
        }
    },
    "methanol": {
        "name": "Méthanol (99.5%)",
        "density_20c": 792,  # kg/m³
        "viscosity_20c": 0.00059,  # Pa·s
        "vapor_pressure_20c": 12800,  # Pa (très volatile)
        "temp_coeffs": {
            "density": -1.2,
            "viscosity": -0.000025,
            "vapor_pressure": 780
        },
        "technical_specs": {
            "flash_point": 12,  # °C (très inflammable)
            "boiling_point": 64.7,  # °C
            "purity": 99.5,  # % vol
            "water_content": 0.1,  # % max
            "compatibility": ["stainless_steel", "ptfe", "viton"],
            "incompatibility": ["natural_rubber", "pvc", "aluminum"]
        }
    },
    "glycerol": {
        "name": "Glycérine (99%)",
        "density_20c": 1260,  # kg/m³
        "viscosity_20c": 1.48,  # Pa·s (très visqueux)
        "vapor_pressure_20c": 0.001,  # Pa (négligeable)
        "temp_coeffs": {
            "density": -0.65,
            "viscosity": -0.058,  # Forte variation avec température
            "vapor_pressure": 0.0002
        },
        "technical_specs": {
            "purity": 99.0,  # % minimum
            "water_content": 0.5,  # % max
            "ash_content": 0.01,  # % max
            "ph": 7.0,  # Neutre
            "compatibility": ["stainless_steel", "pvc", "ptfe", "epdm"],
            "incompatibility": ["natural_rubber", "neoprene"]
        }
    },
    # NOUVEAUX FLUIDES ALIMENTAIRES ET DOMESTIQUES - Extension Complète
    "milk": {
        "name": "Lait (3.5% MG)",
        "density_20c": 1030,  # kg/m³ (légèrement plus dense que l'eau)
        "viscosity_20c": 0.0015,  # Pa·s (légèrement plus visqueux que l'eau)
        "vapor_pressure_20c": 2200,  # Pa (proche de l'eau)
        "temp_coeffs": {
            "density": -0.3,  # Coefficient similaire à l'eau
            "viscosity": -0.00006,
            "vapor_pressure": 95
        },
        "technical_specs": {
            "fat_content": 3.5,  # % matière grasse
            "ph": 6.7,  # pH légèrement acide
            "total_solids": 12.5,  # % matières sèches
            "protein_content": 3.2,  # % protéines
            "compatibility": ["stainless_steel", "ptfe", "epdm_food", "silicone"],
            "incompatibility": ["copper", "brass", "pvc_food"]
        }
    },
    "honey": {
        "name": "Miel (Naturel)",
        "density_20c": 1400,  # kg/m³ (très dense)
        "viscosity_20c": 8.5,  # Pa·s (très visqueux)
        "vapor_pressure_20c": 0.1,  # Pa (négligeable)
        "temp_coeffs": {
            "density": -0.8,
            "viscosity": -0.25,  # Forte variation avec température
            "vapor_pressure": 0.02
        },
        "technical_specs": {
            "sugar_content": 82,  # % sucres
            "water_content": 17,  # % eau
            "ph": 3.9,  # Acide
            "viscosity_index": "Newtonien à faible cisaillement",
            "compatibility": ["316L_stainless", "glass", "ptfe", "food_grade_silicone"],
            "incompatibility": ["iron", "copper", "aluminum_contact"]
        }
    },
    "wine": {
        "name": "Vin Rouge (12° alcool)",
        "density_20c": 990,  # kg/m³ (moins dense que l'eau à cause de l'alcool)
        "viscosity_20c": 0.0012,  # Pa·s (légèrement plus visqueux que l'eau)
        "vapor_pressure_20c": 2800,  # Pa (plus élevé à cause de l'alcool)
        "temp_coeffs": {
            "density": -0.9,  # Fort coefficient à cause de l'alcool
            "viscosity": -0.00004,
            "vapor_pressure": 120
        },
        "technical_specs": {
            "alcohol_content": 12,  # % vol
            "ph": 3.4,  # Acide
            "sulfites": 150,  # mg/L
            "total_acidity": 6.0,  # g/L
            "compatibility": ["316L_stainless", "glass", "ptfe", "epdm_wine"],
            "incompatibility": ["iron", "lead", "pvc_standard"]
        }
    },
    "bleach": {
        "name": "Eau de Javel (5% NaClO)",
        "density_20c": 1050,  # kg/m³
        "viscosity_20c": 0.0011,  # Pa·s (proche de l'eau)
        "vapor_pressure_20c": 2100,  # Pa
        "temp_coeffs": {
            "density": -0.25,
            "viscosity": -0.000045,
            "vapor_pressure": 90
        },
        "technical_specs": {
            "active_chlorine": 5.0,  # % NaClO
            "ph": 12.5,  # Très basique
            "stability": "Dégradation UV et température",
            "concentration_available": "5-6% chlore actif",
            "compatibility": ["pvc", "cpvc", "ptfe", "viton_chlorine"],
            "incompatibility": ["stainless_steel_prolonged", "rubber", "metal_fittings"]
        }
    },
    "yogurt": {
        "name": "Yaourt Nature",
        "density_20c": 1050,  # kg/m³
        "viscosity_20c": 0.15,  # Pa·s (consistance crémeuse)
        "vapor_pressure_20c": 2150,  # Pa (proche de l'eau)
        "temp_coeffs": {
            "density": -0.35,
            "viscosity": -0.008,  # Forte variation avec température
            "vapor_pressure": 92
        },
        "technical_specs": {
            "protein_content": 3.5,  # % protéines
            "fat_content": 3.2,  # % matière grasse
            "ph": 4.2,  # Acide lactique
            "lactic_acid": 0.8,  # % acide lactique
            "compatibility": ["316L_stainless", "glass", "ptfe", "silicone_food"],
            "incompatibility": ["copper_alloys", "aluminum_direct"]
        }
    },
    "tomato_sauce": {
        "name": "Sauce Tomate Concentrée",
        "density_20c": 1100,  # kg/m³ (concentrée)
        "viscosity_20c": 2.5,  # Pa·s (épaisse)
        "vapor_pressure_20c": 1800,  # Pa
        "temp_coeffs": {
            "density": -0.4,
            "viscosity": -0.12,
            "vapor_pressure": 75
        },
        "technical_specs": {
            "concentration": 28,  # % matière sèche
            "ph": 4.1,  # Acide
            "salt_content": 2.5,  # % NaCl
            "lycopene_content": 150,  # mg/kg
            "compatibility": ["316L_stainless", "glass", "ptfe", "epdm_food"],
            "incompatibility": ["iron", "copper", "tin_prolonged"]
        }
    },
    "soap_solution": {
        "name": "Solution Savonneuse (2%)",
        "density_20c": 1010,  # kg/m³
        "viscosity_20c": 0.0013,  # Pa·s
        "vapor_pressure_20c": 2250,  # Pa
        "temp_coeffs": {
            "density": -0.28,
            "viscosity": -0.00005,
            "vapor_pressure": 95
        },
        "technical_specs": {
            "surfactant_content": 2.0,  # % agents actifs
            "ph": 10.5,  # Basique
            "foam_tendency": "Élevée",
            "biodegradability": "Biodégradable",
            "compatibility": ["stainless_steel", "pvc", "pp", "ptfe"],
            "incompatibility": ["aluminum_prolonged", "zinc"]
        }
    },
    "fruit_juice": {
        "name": "Jus de Fruits (Orange)",
        "density_20c": 1045,  # kg/m³ (sucres naturels)
        "viscosity_20c": 0.0018,  # Pa·s
        "vapor_pressure_20c": 2100,  # Pa
        "temp_coeffs": {
            "density": -0.35,
            "viscosity": -0.00007,
            "vapor_pressure": 88
        },
        "technical_specs": {
            "sugar_content": 11,  # % Brix
            "ph": 3.7,  # Acide citrique
            "vitamin_c": 50,  # mg/100ml
            "pulp_content": 8,  # % pulpe
            "compatibility": ["316L_stainless", "glass", "ptfe", "silicone_food"],
            "incompatibility": ["iron", "copper", "tin_uncoated"]
        }
    }
}

# Base de données complète de compatibilité fluide-matériau pour recommandations expertes
FLUID_MATERIAL_COMPATIBILITY = {
    # Structure: fluide -> matériau -> {niveau, recommandations, joints, alertes}
    "water": {
        "stainless_steel_316l": {
            "level": "excellent",
            "description": "Compatibilité parfaite pour installations eau potable",
            "recommended_gaskets": ["EPDM", "Viton", "PTFE"],
            "maintenance": "Maintenance standard - Contrôle annuel",
            "lifespan": "25+ ans",
            "special_notes": "Idéal pour applications alimentaires et sanitaires"
        },
        "pvc": {
            "level": "excellent", 
            "description": "Excellent pour eau froide, bon marché",
            "recommended_gaskets": ["EPDM", "NBR"],
            "maintenance": "Faible maintenance requise",
            "lifespan": "20+ ans",
            "special_notes": "Limiter à 60°C maximum"
        },
        "carbon_steel": {
            "level": "poor",
            "description": "Risque de corrosion importante",
            "recommended_gaskets": ["NBR"],
            "maintenance": "Maintenance préventive intensive - Inspection trimestrielle",
            "lifespan": "5-10 ans avec traitement",
            "special_notes": "ATTENTION: Traitement anticorrosion obligatoire",
            "alternatives": ["316L Stainless Steel", "PVC", "Fonte Ductile revêtue"]
        }
    },
    
    "seawater": {
        "duplex_2205": {
            "level": "excellent",
            "description": "Spécialement conçu pour milieux marins",
            "recommended_gaskets": ["Viton", "PTFE"],
            "maintenance": "Inspection semestrielle - Nettoyage chimique",
            "lifespan": "20+ ans",
            "special_notes": "Résistance optimale aux chlorures"
        },
        "bronze_naval": {
            "level": "excellent",
            "description": "Alliage marin traditionnel éprouvé",
            "recommended_gaskets": ["Viton", "EPDM Naval"],
            "maintenance": "Polissage annuel - Contrôle galvanique",
            "lifespan": "15+ ans",
            "special_notes": "Éviter contact avec acier carbone (corrosion galvanique)"
        },
        "stainless_steel_316l": {
            "level": "good",
            "description": "Acceptable avec surveillance renforcée",
            "recommended_gaskets": ["Viton", "PTFE"],
            "maintenance": "Inspection trimestrielle - Contrôle piqûres",
            "lifespan": "10-15 ans",
            "special_notes": "ATTENTION: Risque de corrosion par piqûres à long terme",
            "alternatives": ["Duplex 2205", "Super Duplex 2507", "Bronze Naval"]
        },
        "carbon_steel": {
            "level": "incompatible",
            "description": "INTERDIT - Corrosion massive assurée",
            "maintenance": "NON APPLICABLE",
            "lifespan": "Défaillance en quelques mois",
            "special_notes": "DANGER: Défaillance catastrophique prévue",
            "alternatives": ["Duplex 2205", "Bronze Naval", "Super Duplex 2507"]
        }
    },

    "diesel": {
        "carbon_steel": {
            "level": "excellent",
            "description": "Standard de l'industrie pétrolière",
            "recommended_gaskets": ["Viton FKM", "NBR Carburant"],
            "maintenance": "Inspection annuelle - Test étanchéité",
            "lifespan": "20+ ans",
            "special_notes": "Solution économique et éprouvée"
        },
        "stainless_steel_316l": {
            "level": "excellent",
            "description": "Qualité premium - Résistance maximale",
            "recommended_gaskets": ["Viton FKM", "PTFE"],
            "maintenance": "Maintenance minimale",
            "lifespan": "25+ ans",
            "special_notes": "Investissement à long terme"
        },
        "pvc": {
            "level": "poor",
            "description": "Non recommandé - Gonflement et fragilisation",
            "maintenance": "Remplacement fréquent nécessaire",
            "lifespan": "2-5 ans maximum",
            "special_notes": "ATTENTION: Risque de fuite à terme",
            "alternatives": ["Acier Carbone", "316L Stainless Steel", "HDPE Carburant"]
        }
    },

    "gasoline": {
        "stainless_steel_316l": {
            "level": "excellent",
            "description": "Sécurité maximale pour carburant volatile",
            "recommended_gaskets": ["Viton FKM", "PTFE"],
            "maintenance": "Inspection stricte semestrielle",
            "lifespan": "20+ ans",
            "special_notes": "Conforme réglementation carburants"
        },
        "aluminum_5052": {
            "level": "excellent",
            "description": "Léger et résistant - Standard aviation",
            "recommended_gaskets": ["Viton FKM"],
            "maintenance": "Contrôle corrosion annuel",
            "lifespan": "15+ ans",
            "special_notes": "Excellent rapport poids/résistance"
        },
        "pvc": {
            "level": "incompatible",
            "description": "INTERDIT - Dissolution du plastique",
            "maintenance": "NON APPLICABLE",
            "lifespan": "Défaillance immédiate",
            "special_notes": "DANGER: Risque de fuite majeure et incendie",
            "alternatives": ["316L Stainless Steel", "Aluminum 5052", "Acier Revêtu PTFE"]
        }
    },

    "milk": {
        "stainless_steel_316l": {
            "level": "excellent",
            "description": "Standard alimentaire - Hygiène maximale",
            "recommended_gaskets": ["EPDM Food Grade", "Silicone Alimentaire"],
            "maintenance": "Nettoyage CIP quotidien - Stérilisation périodique",
            "lifespan": "20+ ans",
            "special_notes": "Certification FDA/CE alimentaire"
        },
        "pvc_food": {
            "level": "good",
            "description": "Acceptable pour circuits froids",
            "recommended_gaskets": ["EPDM Food Grade"],
            "maintenance": "Nettoyage manuel quotidien",
            "lifespan": "10+ ans",
            "special_notes": "Limiter à 40°C - Certification alimentaire obligatoire"
        },
        "copper": {
            "level": "incompatible",
            "description": "INTERDIT - Contamination métallique",
            "maintenance": "NON APPLICABLE",
            "special_notes": "DANGER: Contamination du lait - Non conforme normes alimentaires",
            "alternatives": ["316L Stainless Steel", "PVC Food Grade", "Verre Borosilicate"]
        }
    },

    "honey": {
        "stainless_steel_316l": {
            "level": "excellent",
            "description": "Idéal pour produits sucrés acides",
            "recommended_gaskets": ["Silicone Food Grade", "EPDM Alimentaire"],
            "maintenance": "Nettoyage à l'eau chaude - Pas de détergent agressif",
            "lifespan": "25+ ans",
            "special_notes": "Résistance parfaite aux acides naturels du miel"
        },
        "copper": {
            "level": "incompatible", 
            "description": "INTERDIT - Catalyse fermentation",
            "special_notes": "DANGER: Accélération fermentation - Altération qualité miel",
            "alternatives": ["316L Stainless Steel", "Verre", "Céramique Alimentaire"]
        }
    },

    "bleach": {
        "pvc": {
            "level": "excellent",
            "description": "Matériau de référence pour hypochlorite",
            "recommended_gaskets": ["Viton Chlore", "EPDM Résistant Chlore"],
            "maintenance": "Rinçage après usage - Contrôle visuel mensuel",
            "lifespan": "10+ ans",
            "special_notes": "Spécialement formulé pour résister au chlore"
        },
        "cpvc": {
            "level": "excellent",
            "description": "Haute résistance chimique et thermique",
            "recommended_gaskets": ["Viton Chlore", "PTFE"],
            "maintenance": "Inspection trimestrielle",
            "lifespan": "15+ ans",
            "special_notes": "Supérieur au PVC pour applications chaudes"
        },
        "stainless_steel_316l": {
            "level": "incompatible",
            "description": "INTERDIT - Corrosion par piqûres rapide",
            "special_notes": "DANGER: Défaillance structurelle assurée avec hypochlorite",
            "alternatives": ["PVC", "CPVC", "PVDF", "PTFE"]
        }
    }
}

# ============================================================================
# ENHANCED PYDANTIC MODELS FOR THREE TABS
# ============================================================================

class FluidProperties(BaseModel):
    name: str
    density: float  # kg/m³
    viscosity: float  # Pa·s
    vapor_pressure: float  # Pa

class FittingInput(BaseModel):
    fitting_type: str
    quantity: int = 1

class NPSHdCalculationInput(BaseModel):
    suction_type: str = "flooded"  # "flooded" or "suction_lift"
    hasp: float = Field(ge=0)  # m (suction height - positive = flooded / negative = suction lift)
    flow_rate: float = Field(gt=0, description="Le débit doit être supérieur à 0")
    fluid_type: str
    temperature: float = 20  # °C
    pipe_diameter: float = Field(gt=0, description="Le diamètre de tuyauterie doit être supérieur à 0")
    pipe_material: str
    pipe_length: float = Field(gt=0, description="La longueur de tuyauterie doit être supérieure à 0")
    suction_fittings: List[FittingInput] = []
    npsh_required: float = 3.5  # m (NPSH requis from pump manufacturer)

class HMTCalculationInput(BaseModel):
    installation_type: str = "surface"  # "surface" or "submersible"
    suction_type: str = "flooded"  # "flooded" or "suction_lift" (only for surface installation)
    hasp: float = Field(ge=0)  # m (suction height - only for surface installation)
    discharge_height: float  # m
    useful_pressure: float = 0  # bar (required delivery pressure)
    suction_pipe_diameter: float = Field(gt=0, description="Le diamètre d'aspiration doit être supérieur à 0")
    discharge_pipe_diameter: float = Field(gt=0, description="Le diamètre de refoulement doit être supérieur à 0")
    suction_pipe_length: float = Field(gt=0, description="La longueur d'aspiration doit être supérieure à 0")
    discharge_pipe_length: float = Field(gt=0, description="La longueur de refoulement doit être supérieure à 0")
    suction_pipe_material: str
    discharge_pipe_material: str
    suction_fittings: List[FittingInput] = []
    discharge_fittings: List[FittingInput] = []
    fluid_type: str
    temperature: float = 20  # °C
    flow_rate: float = Field(gt=0, description="Le débit doit être supérieur à 0")
    pump_efficiency: float = Field(70, gt=0, le=100)  # % - used only for the indicative absorbed power shown in this tab

class PerformanceAnalysisInput(BaseModel):
    flow_rate: float = Field(gt=0, description="Le débit doit être supérieur à 0")
    hmt: float = Field(gt=0, description="La HMT doit être supérieure à 0")
    pipe_diameter: float = Field(gt=0, description="Le diamètre de tuyauterie doit être supérieur à 0")
    required_npsh: Optional[float] = None  # m (from pump datasheet) - Made optional
    calculated_npshd: Optional[float] = None  # m (from Tab 1) - Made optional
    fluid_type: str
    pipe_material: str
    pump_efficiency: float = Field(gt=0, le=100)  # %
    motor_efficiency: float = Field(gt=0, le=100)  # %
    absorbed_power: Optional[float] = None  # kW (P1)
    hydraulic_power: Optional[float] = None  # kW (P2)
    starting_method: str = "star_delta"  # or "direct_on_line"
    power_factor: float = Field(0.8, gt=0, le=1)  # cos φ
    cable_length: float = Field(ge=0)  # m
    cable_material: str = "copper"  # or "aluminum"
    cable_section: Optional[float] = None  # mm²
    voltage: int = Field(400, gt=0)  # V

class NPSHdResult(BaseModel):
    input_data: NPSHdCalculationInput
    fluid_properties: FluidProperties
    atmospheric_pressure: float  # Pa (constant at sea level)
    velocity: float  # m/s
    reynolds_number: float
    friction_factor: float
    linear_head_loss: float  # m
    singular_head_loss: float  # m
    total_head_loss: float  # m
    npshd: float  # m
    npsh_required: float  # m
    npsh_margin: float  # m (NPSHd - NPSHr)
    cavitation_risk: bool
    recommendations: List[str]  # Corrective actions for cavitation
    warnings: List[str]

class HMTResult(BaseModel):
    input_data: HMTCalculationInput
    fluid_properties: FluidProperties
    suction_velocity: Optional[float] = None  # m/s - Optional for submersible
    discharge_velocity: float  # m/s
    suction_head_loss: Optional[float] = None  # m - Optional for submersible
    discharge_head_loss: float  # m
    total_head_loss: float  # m
    static_head: float  # m
    useful_pressure_head: float  # m
    hmt: float  # m
    warnings: List[str]
    # Champs détaillés attendus par l'interface (décomposition HMT + KPIs)
    velocity_suction: Optional[float] = None  # m/s - alias de suction_velocity
    velocity_discharge: float = 0  # m/s - alias de discharge_velocity
    geometric_height: float = 0  # m - alias de static_head
    suction_linear_loss: Optional[float] = None  # m
    suction_singular_loss: Optional[float] = None  # m
    discharge_linear_loss: float = 0  # m
    discharge_singular_loss: float = 0  # m
    total_hmt: float = 0  # m - alias de hmt
    absorbed_power: Optional[float] = None  # kW - estimation indicative
    recommendations: List[str] = []

class ExpertAnalysisInput(BaseModel):
    # Paramètres hydrauliques
    flow_rate: float  # m³/h
    fluid_type: str
    temperature: float = 20  # °C
    
    # Type d'aspiration
    suction_type: str = "flooded"  # "flooded" ou "suction_lift"
    
    # Géométrie
    suction_pipe_diameter: float  # mm
    discharge_pipe_diameter: float  # mm
    suction_height: float  # m
    discharge_height: float  # m
    suction_length: float  # m
    discharge_length: float  # m
    total_length: float  # m
    
    # Pression utile
    useful_pressure: float = 0  # bar
    
    # Matériaux
    suction_material: str
    discharge_material: str
    
    # Singularités détaillées ASPIRATION
    suction_elbow_90: int = 0
    suction_elbow_45: int = 0
    suction_elbow_30: int = 0
    suction_tee_flow: int = 0
    suction_tee_branch: int = 0
    suction_reducer_gradual: int = 0
    suction_reducer_sudden: int = 0
    suction_enlarger_gradual: int = 0
    suction_enlarger_sudden: int = 0
    suction_gate_valve: int = 0
    suction_globe_valve: int = 0
    suction_ball_valve: int = 0
    suction_butterfly_valve: int = 0
    suction_check_valve: int = 0
    suction_strainer: int = 0
    suction_foot_valve: int = 0
    
    # Singularités détaillées REFOULEMENT
    discharge_elbow_90: int = 0
    discharge_elbow_45: int = 0
    discharge_elbow_30: int = 0
    discharge_tee_flow: int = 0
    discharge_tee_branch: int = 0
    discharge_reducer_gradual: int = 0
    discharge_reducer_sudden: int = 0
    discharge_enlarger_gradual: int = 0
    discharge_enlarger_sudden: int = 0
    discharge_gate_valve: int = 0
    discharge_globe_valve: int = 0
    discharge_ball_valve: int = 0
    discharge_butterfly_valve: int = 0
    discharge_check_valve: int = 0
    discharge_strainer: int = 0
    discharge_flow_meter: int = 0
    discharge_pressure_gauge: int = 0
    
    # Électrique
    pump_efficiency: float  # %
    motor_efficiency: float  # %
    voltage: int = 400  # V
    power_factor: float = 0.8
    starting_method: str = "star_delta"
    cable_length: float  # m
    cable_material: str = "copper"
    
    # Expert
    npsh_required: float  # m
    installation_type: str = "surface"
    pump_type: str = "centrifugal"
    operating_hours: float = 8760  # h/an
    electricity_cost: float = 0.12  # €/kWh
    
    # Conditions environnementales
    altitude: float = 0
    ambient_temperature: float = 25
    humidity: float = 60

class ExpertAnalysisResult(BaseModel):
    input_data: ExpertAnalysisInput
    
    # Résultats combinés
    npshd_analysis: Dict[str, Any]
    hmt_analysis: Dict[str, Any]
    performance_analysis: Dict[str, Any]
    electrical_analysis: Dict[str, Any]
    
    # Analyse globale
    overall_efficiency: float  # %
    total_head_loss: float  # m
    system_stability: bool
    energy_consumption: float  # kWh/m³
    
    # Recommandations d'expert
    expert_recommendations: List[Dict[str, Any]]
    optimization_potential: Dict[str, Any]
    
    # Données pour graphiques
    performance_curves: Dict[str, Any]
    system_curves: Dict[str, Any]

class PerformanceAnalysisResult(BaseModel):
    input_data: PerformanceAnalysisInput
    # Removed NPSH fields as requested
    pump_efficiency: float  # %
    motor_efficiency: float  # %
    overall_efficiency: float  # %
    velocity: float  # m/s - Added velocity data
    reynolds_number: float  # Added Reynolds number
    nominal_current: float  # A
    starting_current: float  # A
    recommended_cable_section: float  # mm²
    power_calculations: Dict[str, float]
    electrical_data: Dict[str, Any]
    performance_curves: Dict[str, Any]  # Flow points and corresponding values
    recommendations: List[str]
    warnings: List[str]
    alerts: List[str]  # Added alerts field
    # Champs détaillés attendus par l'interface (onglet Performance)
    hydraulic_power: float = 0  # kW - Ph, puissance hydraulique pure
    mechanical_power: float = 0  # kW - Pm, puissance mécanique à l'arbre
    absorbed_power: float = 0  # kW - P1, puissance électrique absorbée
    cable_section: float = 0  # mm² - alias de recommended_cable_section
    voltage_drop: float = 0  # V
    voltage_drop_percent: float = 0  # %

# Legacy models for backward compatibility
class CalculationInput(BaseModel):
    flow_rate: float  # m³/h
    suction_height: float  # m (positive for suction, negative for flooded)
    pipe_diameter: float  # mm
    pipe_length: float  # m
    fluid_type: str
    temperature: float = 20  # °C
    npsh_available: Optional[float] = None  # m
    pump_efficiency: float = 75  # %
    motor_efficiency: float = 90  # %
    voltage: int = 400  # V (230 or 400)
    cable_length: float = 50  # m

class CalculationResult(BaseModel):
    # Input parameters
    input_data: CalculationInput
    
    # Fluid properties
    fluid_properties: FluidProperties
    
    # Flow calculations
    flow_velocity: float  # m/s
    reynolds_number: float
    friction_factor: float
    
    # Pressure calculations
    linear_pressure_loss: float  # Pa
    total_pressure_loss: float  # Pa
    hmt_meters: float  # m
    hmt_bar: float  # bar
    
    # NPSH calculations
    npsh_required: float  # m
    npsh_available_calc: float  # m
    cavitation_risk: bool
    
    # Power calculations
    hydraulic_power: float  # kW
    absorbed_power: float  # kW
    total_efficiency: float  # %
    
    # Electrical calculations
    nominal_current: float  # A
    cable_section: float  # mm²
    starting_method: str
    
    # Warnings and alerts
    warnings: List[str]

class PumpHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_name: str
    calculation_type: str  # "npshd" | "hmt" | "performance" | "expert"
    input_data: Dict[str, Any]
    result_data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PumpHistoryCreate(BaseModel):
    project_name: str
    calculation_type: str
    input_data: Dict[str, Any]
    result_data: Dict[str, Any]

# ── Modèles Authentification ──
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    company: Optional[str] = None
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic

# ============================================================================
# ENHANCED HYDRAULIC CALCULATION FUNCTIONS
# ============================================================================

def calculate_atmospheric_pressure(altitude: float) -> float:
    """Calculate atmospheric pressure based on altitude (m)"""
    # Barometric formula: P = P0 * (1 - 0.0065 * h / 288.15)^5.255
    P0 = 101325  # Pa at sea level
    return P0 * (1 - 0.0065 * altitude / 288.15) ** 5.255

def calculate_singular_head_loss(velocity: float, fittings: List[FittingInput]) -> float:
    """Calculate singular head losses from fittings"""
    total_k = 0
    for fitting in fittings:
        if fitting.fitting_type in FITTING_COEFFICIENTS:
            k_value = FITTING_COEFFICIENTS[fitting.fitting_type]["k"]
            total_k += k_value * fitting.quantity
        else:
            logger.warning(f"Type de raccord inconnu ignoré dans le calcul de pertes de charge: '{fitting.fitting_type}'")
    
    return total_k * (velocity**2) / (2 * 9.81)  # Head loss in meters

def calculate_linear_head_loss_enhanced(velocity: float, pipe_length: float, 
                                      pipe_diameter: float, pipe_material: str,
                                      reynolds_number: float) -> float:
    """Enhanced linear head loss calculation using pipe material roughness"""
    if pipe_material not in PIPE_MATERIALS:
        roughness = 0.045  # Default steel roughness
    else:
        roughness = PIPE_MATERIALS[pipe_material]["roughness"]
    
    diameter_m = pipe_diameter / 1000  # Convert mm to m
    relative_roughness = roughness / pipe_diameter  # Relative roughness
    
    # Calculate friction factor using Colebrook-White equation (Swamee-Jain approximation)
    # f = 0.25 / [log10(ε/(3.7D) + 5.74/Re^0.9)]²  — formule de Swamee-Jain correcte
    # (l'ancienne implémentation mélangeait par erreur ce coefficient 0.25 avec les
    # termes internes de la formule de Haaland — 6.9/Re et exposant 1.11 — ce qui
    # sous-estimait le facteur de frottement d'environ 19-20%)
    if reynolds_number < 2300:
        # Laminar flow
        friction_factor = 64 / reynolds_number
    else:
        # Turbulent flow
        term1 = relative_roughness / 3.7
        term2 = 5.74 / (reynolds_number ** 0.9)
        friction_factor = 0.25 / (math.log10(term1 + term2) ** 2)
    
    # Darcy-Weisbach equation for head loss
    return friction_factor * (pipe_length / diameter_m) * (velocity**2) / (2 * 9.81)

def get_fluid_properties(fluid_type: str, temperature: float) -> FluidProperties:
    """Calculate temperature-dependent fluid properties"""
    if fluid_type not in FLUID_PROPERTIES:
        raise ValueError(f"Unknown fluid type: {fluid_type}")
    
    base_props = FLUID_PROPERTIES[fluid_type]
    temp_diff = temperature - 20
    
    # Calculate temperature-adjusted properties
    density = base_props["density_20c"] + (base_props["temp_coeffs"]["density"] * temp_diff)
    viscosity = base_props["viscosity_20c"] + (base_props["temp_coeffs"]["viscosity"] * temp_diff)
    vapor_pressure = base_props["vapor_pressure_20c"] + (base_props["temp_coeffs"]["vapor_pressure"] * temp_diff)
    
    # Ensure minimum values
    density = max(density, 500)
    viscosity = max(viscosity, 0.0001)
    vapor_pressure = max(vapor_pressure, 0)
    
    return FluidProperties(
        name=base_props["name"],
        density=density,
        viscosity=viscosity,
        vapor_pressure=vapor_pressure
    )

def analyze_chemical_compatibility(fluid_type: str, suction_material: str, discharge_material: str, temperature: float) -> Dict[str, Any]:
    """
    Analyser la compatibilité chimique entre le fluide et les matériaux à une température donnée
    avec recommandations avancées de matériaux, joints et suggestions hydrauliques
    """
    if fluid_type not in FLUID_PROPERTIES:
        return {"status": "unknown_fluid", "recommendations": [], "warnings": []}
    
    fluid_data = FLUID_PROPERTIES[fluid_type]
    fluid_name = fluid_data["name"]
    
    # Dictionnaire de mapping des matériaux (nom technique -> nom FLUID_PROPERTIES)
    material_mapping = {
        "pvc": ["pvc", "pvc_food"],
        "pehd": ["pehd", "pe", "polyethylene"],
        "steel": ["steel", "carbon_steel"],
        "steel_galvanized": ["galvanized_steel", "galvanized"],
        "stainless_steel_316": ["stainless_steel", "316L_stainless", "316L", "stainless"],
        "stainless_steel_304": ["stainless_steel", "304_stainless", "304", "stainless"],
        "copper": ["copper", "copper_alloys"],
        "brass": ["brass", "copper_alloys"],
        "cast_iron": ["cast_iron", "fonte"],
        "concrete": ["concrete"],
        "aluminum": ["aluminum"]
    }
    
    # Base de données avancée des joints selon les fluides
    recommended_seals = {
        "acid": {
            "seals": ["PTFE", "FKM (Viton)", "EPDM"],
            "avoid": ["NBR (Nitrile)", "Caoutchouc naturel"],
            "notes": "Joints en PTFE pour acides concentrés, FKM pour acides dilués"
        },
        "gasoline": {
            "seals": ["NBR (Nitrile)", "FKM (Viton)", "CR (Néoprène)"],
            "avoid": ["EPDM", "Caoutchouc naturel"],
            "notes": "FKM obligatoire pour températures élevées >80°C"
        },
        "diesel": {
            "seals": ["NBR (Nitrile)", "FKM (Viton)", "CR (Néoprène)"],
            "avoid": ["EPDM", "Caoutchouc naturel"],
            "notes": "Attention aux biocarburants - préférer FKM"
        },
        "seawater": {
            "seals": ["EPDM", "FKM (Viton)", "CR (Néoprène)"],
            "avoid": ["NBR", "Caoutchouc naturel"],
            "notes": "EPDM résistant au chlore, FKM pour applications critiques"
        },
        "milk": {
            "seals": ["EPDM alimentaire", "Silicone FDA", "FKM alimentaire"],
            "avoid": ["NBR", "Caoutchouc naturel"],
            "notes": "Certifications FDA/CE obligatoires pour contact alimentaire"
        },
        "honey": {
            "seals": ["EPDM alimentaire", "Silicone FDA", "PTFE"],
            "avoid": ["NBR", "Caoutchouc naturel"],
            "notes": "Résistance aux sucres concentrés, nettoyage vapeur"
        },
        "water": {
            "seals": ["EPDM", "NBR", "CR (Néoprène)"],
            "avoid": [],
            "notes": "EPDM recommandé pour eau potable"
        },
        "oil": {
            "seals": ["NBR (Nitrile)", "FKM (Viton)", "Polyuréthane"],
            "avoid": ["EPDM"],
            "notes": "NBR économique, FKM pour huiles haute température"
        }
    }
    
    compatibility_analysis = {
        "fluid_name": fluid_name,
        "compatible_materials": [],
        "incompatible_materials": [],
        "suction_material_status": "unknown",
        "discharge_material_status": "unknown",
        "temperature_warnings": [],
        "recommendations": [],
        "optimal_materials": [],
        "seal_recommendations": [],
        "hydraulic_advice": []
    }
    
    # Obtenir les listes de compatibilité du fluide
    if "technical_specs" in fluid_data and "compatibility" in fluid_data["technical_specs"]:
        compatibility_analysis["compatible_materials"] = fluid_data["technical_specs"]["compatibility"]
    
    if "technical_specs" in fluid_data and "incompatibility" in fluid_data["technical_specs"]:
        compatibility_analysis["incompatible_materials"] = fluid_data["technical_specs"]["incompatibility"]
    
    # Analyser la compatibilité des matériaux d'aspiration et refoulement
    def check_material_compatibility(material: str) -> str:
        """Vérifier la compatibilité d'un matériau avec le fluide"""
        if not material or material == "unknown":
            return "unknown"
        
        # Rechercher le matériau dans le mapping
        material_variants = material_mapping.get(material, [material])
        material_variants.append(material)  # Ajouter le matériau original
        
        # Vérifier compatibilité
        for variant in material_variants:
            if variant in compatibility_analysis["compatible_materials"]:
                return "compatible"
            if variant in compatibility_analysis["incompatible_materials"]:
                return "incompatible"
        
        return "unknown"
    
    compatibility_analysis["suction_material_status"] = check_material_compatibility(suction_material)
    compatibility_analysis["discharge_material_status"] = check_material_compatibility(discharge_material)
    
    # === RECOMMANDATIONS AVANCÉES DE JOINTS ===
    if fluid_type in recommended_seals:
        seal_info = recommended_seals[fluid_type]
        compatibility_analysis["seal_recommendations"].extend([
            f"🔧 JOINTS RECOMMANDÉS pour {fluid_name}:",
            f"✅ Joints adaptés: {', '.join(seal_info['seals'])}",
            f"❌ Joints à éviter: {', '.join(seal_info['avoid'])}" if seal_info['avoid'] else "❌ Aucun joint spécifiquement déconseillé",
            f"💡 Note technique: {seal_info['notes']}"
        ])
    
    # === RECOMMANDATIONS SPÉCIFIQUES PAR FLUIDE ===
    if fluid_type == "acid":
        compatibility_analysis["recommendations"].extend([
            "⚠️ FLUIDE CORROSIF - Précautions spéciales requises",
            "🏗️ Matériaux recommandés: Inox 316L (optimal), PVC/PP (économique)",
            "🔧 Boulonnerie: Inox A4 (316L) obligatoire",
            "🛡️ Revêtements: Résine époxy ou polyuréthane",
            "📊 Surveillance pH et inspection trimestrielle",
            "🚿 Équipements rinçage d'urgence obligatoires"
        ])
        
        if temperature > 60:
            compatibility_analysis["recommendations"].append(
                "🌡️ HAUTE TEMPÉRATURE + ACIDE: Utiliser uniquement Inox 316L ou Hastelloy"
            )
    
    elif fluid_type in ["gasoline", "diesel"]:
        compatibility_analysis["recommendations"].extend([
            "⛽ FLUIDE INFLAMMABLE - Mise à la terre obligatoire",
            "🏗️ Matériaux: Inox 316L ou acier au carbone avec revêtement",
            "⚡ Équipements antidéflagrants (ATEX Zone 1)",
            "🔧 Joints FKM (Viton) - résistance hydrocarbures",
            "🔄 Système de récupération des vapeurs",
            "📏 Dilatation thermique importante - compensateurs requis"
        ])
        
        if fluid_type == "gasoline":
            compatibility_analysis["recommendations"].append(
                "🚨 ESSENCE: Pression vapeur élevée - réservoirs sous pression"
            )
    
    elif fluid_type == "seawater":
        compatibility_analysis["recommendations"].extend([
            "🌊 EAU DE MER - Corrosion saline critique",
            "🏗️ Matériau OBLIGATOIRE: Inox 316L minimum (idéal: Duplex 2205)",
            "🔧 Anodes sacrificielles en zinc ou aluminium",
            "🛡️ Protection cathodique active recommandée",
            "🧪 Surveillance chlorures et inspection mensuelle",
            "💧 Rinçage eau douce après arrêt prolongé"
        ])
    
    elif fluid_type in ["milk", "honey", "wine"]:
        compatibility_analysis["recommendations"].extend([
            "🥛 FLUIDE ALIMENTAIRE - Normes sanitaires strictes",
            "🏗️ Matériaux: Inox 316L poli sanitaire (Ra ≤ 0.8 μm)",
            "🔧 Joints FDA/CE - Silicone ou EPDM alimentaire",
            "🧽 Nettoyage CIP (Clean In Place) intégré",
            "🌡️ Traçage vapeur pour maintien température",
            "📋 Traçabilité et validation HACCP"
        ])
        
        if fluid_type == "milk":
            compatibility_analysis["recommendations"].append(
                "❄️ LAIT: Refroidissement rapide <4°C - échangeurs plates"
            )
    
    # === CONSEILS HYDRAULIQUES AVANCÉS ===
    viscosity = fluid_data["viscosity_20c"]
    
    if viscosity > 0.1:  # Fluides visqueux
        compatibility_analysis["hydraulic_advice"].extend([
            "🌊 FLUIDE VISQUEUX - Adaptations hydrauliques:",
            "📏 Diamètres majorés +20% minimum",
            "⚙️ Pompe volumétrique recommandée si η < 10 cP",
            "🔄 Vitesses réduites: aspiration <1m/s, refoulement <2m/s",
            "🌡️ Préchauffage pour réduire viscosité",
            "📊 Courbes de pompe à recalculer selon viscosité"
        ])
    
    if "vapor_pressure_20c" in fluid_data and fluid_data["vapor_pressure_20c"] > 5000:  # Fluides volatils
        compatibility_analysis["hydraulic_advice"].extend([
            "💨 FLUIDE VOLATIL - Précautions NPSH:",
            "📏 Diamètres aspiration majorés +30%",
            "⬇️ Hauteur aspiration minimisée (<3m si possible)",
            "❄️ Refroidissement fluide recommandé",
            "🔒 Réservoir sous pression inerte (azote)",
            "📊 Calcul NPSH avec marge sécurité +50%"
        ])
    
    # === RECOMMANDATIONS DE MATÉRIAUX OPTIMAUX ===
    if fluid_type in ["acid", "seawater"]:
        compatibility_analysis["optimal_materials"] = [
            "Inox 316L (optimal)",
            "Duplex 2205 (haute performance)", 
            "Hastelloy C-276 (extrême)",
            "PVC/CPVC (économique température <60°C)",
            "PTFE (joints et revêtements)"
        ]
    elif fluid_type in ["gasoline", "diesel", "ethanol", "methanol"]:
        compatibility_analysis["optimal_materials"] = [
            "Inox 316L",
            "Acier au carbone + revêtement époxy",
            "Aluminium 5083 (réservoirs)",
            "PTFE/FKM (joints)",
            "Acier galvanisé (interdit - corrosion galvanique)"
        ]
    elif fluid_type in ["milk", "honey", "wine"]:
        compatibility_analysis["optimal_materials"] = [
            "Inox 316L poli sanitaire",
            "Inox 304L (acceptable usage non critique)",
            "PTFE/Silicone alimentaire (joints)",
            "PVC alimentaire (tuyauteries secondaires)",
            "Cuivre (interdit - contamination)"
        ]
    elif temperature > 80:
        compatibility_analysis["optimal_materials"] = [
            "Inox 316L (haute température)",
            "Inox 321 (stabilisé titane)",
            "Acier P91/P92 (vapeur)",
            "Réfractaires (>200°C)",
            "PVC (interdit >60°C)"
        ]
    else:
        compatibility_analysis["optimal_materials"] = [
            "Inox 316L (polyvalent)",
            "PVC/CPVC (économique)",
            "PEHD (enterré)",
            "Fonte ductile (réseaux)",
            "Acier galvanisé (air comprimé)"
        ]
    
    # Générer des recommandations basées sur l'analyse
    if compatibility_analysis["suction_material_status"] == "incompatible":
        compatibility_analysis["recommendations"].extend([
            f"⚠️ INCOMPATIBILITÉ DÉTECTÉE - Aspiration ({suction_material})",
            f"🔄 Remplacement URGENT par: {compatibility_analysis['optimal_materials'][0]}",
            "⏰ Risque de défaillance prématurée",
            "💰 Coût remplacement < coût panne"
        ])
    
    if compatibility_analysis["discharge_material_status"] == "incompatible":
        compatibility_analysis["recommendations"].extend([
            f"⚠️ INCOMPATIBILITÉ DÉTECTÉE - Refoulement ({discharge_material})",
            f"🔄 Remplacement URGENT par: {compatibility_analysis['optimal_materials'][0]}",
            "⏰ Risque de défaillance prématurée",
            "💰 Coût remplacement < coût panne"
        ])
    
    # Recommandations générales de température
    if temperature > 100:
        compatibility_analysis["recommendations"].extend([
            f"🌡️ HAUTE TEMPÉRATURE ({temperature}°C) - Précautions:",
            "🔧 Compensateurs de dilatation obligatoires",
            "🛡️ Isolation thermique et calorifugeage",
            "⚙️ Supports coulissants/pendulaires",
            "📊 Calculs contraintes thermiques",
            "🔥 Protection personnel - risque brûlure"
        ])
    elif temperature > 60:
        compatibility_analysis["recommendations"].append(
            f"🌡️ Température élevée ({temperature}°C) - Éviter PVC, prévoir dilatation"
        )
    
    return compatibility_analysis

def calculate_reynolds_number(velocity: float, diameter: float, density: float, viscosity: float) -> float:
    """Calculate Reynolds number"""
    return (density * velocity * diameter) / viscosity

def calculate_friction_factor(reynolds_number: float, roughness: float = 0.000045) -> float:
    """Calculate friction factor using Colebrook-White equation (approximation)"""
    if reynolds_number < 2300:
        # Laminar flow
        return 64 / reynolds_number
    else:
        # Turbulent flow - Swamee-Jain approximation
        # f = 0.25 / [log10(ε/(3.7D) + 5.74/Re^0.9)]²
        relative_roughness = roughness / 1000  # Assume 1m diameter for relative roughness
        term1 = relative_roughness / 3.7
        term2 = 5.74 / (reynolds_number ** 0.9)
        return 0.25 / (math.log10(term1 + term2) ** 2)

def calculate_npshd_enhanced(input_data: NPSHdCalculationInput) -> NPSHdResult:
    """Enhanced NPSHd calculation with corrected formulas based on suction type"""
    warnings = []
    
    # Atmospheric pressure constant at sea level
    atmospheric_pressure = 101325  # Pa
    
    # Get fluid properties
    fluid_props = get_fluid_properties(input_data.fluid_type, input_data.temperature)
    
    # Calculate velocity
    pipe_area = math.pi * (input_data.pipe_diameter / 1000 / 2) ** 2
    velocity = (input_data.flow_rate / 3600) / pipe_area
    
    # Reynolds number
    reynolds_number = calculate_reynolds_number(
        velocity, input_data.pipe_diameter / 1000, 
        fluid_props.density, fluid_props.viscosity
    )
    
    # Calculate friction factor
    friction_factor = calculate_friction_factor(reynolds_number)
    
    # Linear head loss
    linear_head_loss = calculate_linear_head_loss_enhanced(
        velocity, input_data.pipe_length, input_data.pipe_diameter,
        input_data.pipe_material, reynolds_number
    )
    
    # Singular head loss
    singular_head_loss = calculate_singular_head_loss(velocity, input_data.suction_fittings)
    
    # Total head loss
    total_head_loss = linear_head_loss + singular_head_loss
    
    # Calculate NPSHd using the corrected formulas based on suction type
    # Convert atmospheric pressure to meters of fluid column
    patm_head = atmospheric_pressure / (fluid_props.density * 9.81)
    
    # Convert vapor pressure to meters of fluid column
    vapor_pressure_head = fluid_props.vapor_pressure / (fluid_props.density * 9.81)
    
    # Calculate NPSHd according to the corrected formulas
    if input_data.suction_type == "flooded":
        # En charge: NPSHd = Patm + ρ*g*H_aspiration - Pertes de charges totales - Pression de vapeur saturante
        npshd = patm_head + abs(input_data.hasp) - total_head_loss - vapor_pressure_head
    else:  # suction_lift
        # En aspiration: NPSHd = Patm - ρ*g*H_aspiration - Pertes de charges totales - Pression de vapeur saturante
        npshd = patm_head - abs(input_data.hasp) - total_head_loss - vapor_pressure_head
    
    # Enhanced warnings and alerts
    if velocity > 3.0:
        warnings.append(f"Vitesse élevée ({velocity:.2f} m/s) - RECOMMANDATION: Augmenter le diamètre de la tuyauterie")
    if velocity < 0.5:
        warnings.append(f"Vitesse faible ({velocity:.2f} m/s) - risque de sédimentation")
    if velocity > 2.5:
        warnings.append("ALERTE: Vitesse excessive - augmenter le diamètre de la tuyauterie pour réduire les pertes de charge")
    
    if npshd < 0:
        warnings.append("ATTENTION: NPSHd négatif - conditions d'aspiration impossibles")
        warnings.append("RECOMMANDATION: Réduire la hauteur d'aspiration et/ou la longueur de tuyauterie")
    if npshd < 2:
        warnings.append("ATTENTION: NPSHd très faible - risque de cavitation élevé")
        warnings.append("RECOMMANDATION: Vérifier le clapet anti-retour et réduire les pertes de charge")
    
    if total_head_loss > 3:
        warnings.append(f"Pertes de charge élevées ({total_head_loss:.2f} m) - RECOMMANDATION: Augmenter le diamètre ou réduire la longueur")
    
    if input_data.hasp > 6 and input_data.suction_type == "suction_lift":
        warnings.append("ALERTE: Hauteur d'aspiration excessive - réduire la hauteur d'aspiration")
    
    if input_data.pipe_length > 100:
        warnings.append("ALERTE: Longueur de tuyauterie excessive - réduire la longueur pour diminuer les pertes de charge")
    
    # Temperature and material alerts
    if input_data.temperature > 60:
        material_warnings = {
            "pvc": "ALERTE MATÉRIAU: PVC non recommandé au-dessus de 60°C - utiliser PEHD ou acier",
            "pehd": "ATTENTION: PEHD près de sa limite de température - vérifier la résistance",
            "steel": "Matériau acier adapté aux hautes températures",
            "steel_galvanized": "Matériau acier galvanisé adapté aux hautes températures",
            "cast_iron": "Matériau fonte adapté aux hautes températures",
            "concrete": "Matériau béton adapté aux hautes températures"
        }
        if input_data.pipe_material in material_warnings:
            warnings.append(material_warnings[input_data.pipe_material])
    
    if input_data.temperature > 80:
        warnings.append("ALERTE TEMPÉRATURE: Température très élevée - vérifier la compatibilité de tous les matériaux")
    
    # Check valve alerts
    has_check_valve = any(fitting.fitting_type == "check_valve" for fitting in input_data.suction_fittings)
    if input_data.suction_type == "suction_lift" and not has_check_valve:
        warnings.append("RECOMMANDATION: Ajouter un clapet anti-retour pour l'aspiration en dépression")
    
    # Fitting-specific alerts
    total_fittings = sum(fitting.quantity for fitting in input_data.suction_fittings)
    if total_fittings > 5:
        warnings.append("ALERTE: Nombre excessif de raccords - réduire les raccords pour diminuer les pertes de charge")
    
    # NPSH Comparison and Cavitation Analysis
    npsh_required = input_data.npsh_required
    npsh_margin = npshd - npsh_required
    cavitation_risk = npshd <= npsh_required
    
    # Initialize recommendations list
    recommendations = []
    
    # Cavitation risk analysis and recommendations
    if cavitation_risk:
        warnings.append("🚨 RISQUE DE CAVITATION DÉTECTÉ!")
        warnings.append(f"NPSHd calculé ({npshd:.2f} m) ≤ NPSH requis ({npsh_required:.2f} m)")
        warnings.append(f"Marge de sécurité: {npsh_margin:.2f} m (NÉGATIVE)")
        
        # Detailed corrective recommendations
        recommendations.append("🔧 CORRECTIONS POUR ÉLIMINER LA CAVITATION:")
        
        # 1. Reduce suction height
        if input_data.suction_type == "suction_lift" and input_data.hasp > 0:
            new_hasp = input_data.hasp - abs(npsh_margin) - 0.5
            if new_hasp > 0:
                recommendations.append(f"• Réduire la hauteur d'aspiration de {input_data.hasp:.1f}m à {new_hasp:.1f}m")
            else:
                recommendations.append(f"• Passer en aspiration en charge (pompe sous le niveau du liquide)")
        
        # 2. Increase pipe diameter
        current_velocity = velocity
        if current_velocity > 1.5:
            # Calculate required diameter for velocity <= 1.5 m/s
            pipe_area = math.pi * (input_data.pipe_diameter / 1000 / 2) ** 2
            required_area = (input_data.flow_rate / 3600) / 1.5
            required_diameter = math.sqrt(4 * required_area / math.pi) * 1000
            recommendations.append(f"• Augmenter le diamètre de {input_data.pipe_diameter:.0f}mm à {required_diameter:.0f}mm")
        
        # 3. Reduce pipe length
        if input_data.pipe_length > 20:
            max_length = input_data.pipe_length * 0.7  # Reduce by 30%
            recommendations.append(f"• Réduire la longueur de tuyauterie de {input_data.pipe_length:.1f}m à {max_length:.1f}m")
        
        # 4. Reduce fittings
        if total_fittings > 2:
            recommendations.append(f"• Réduire le nombre de raccords de {total_fittings} à maximum 2")
        
        # 5. Use smoother pipe material
        rough_materials = ["concrete", "cast_iron", "steel_galvanized"]
        if input_data.pipe_material in rough_materials:
            recommendations.append(f"• Utiliser un matériau plus lisse (PVC ou PEHD) au lieu de {PIPE_MATERIALS[input_data.pipe_material]['name']}")
        
        # 6. Lower fluid temperature
        if input_data.temperature > 20:
            recommendations.append(f"• Réduire la température du fluide de {input_data.temperature}°C à 20°C si possible")
        
        # 7. Change pump location
        recommendations.append("• Repositionner la pompe plus près du réservoir")
        recommendations.append("• Installer la pompe en charge (niveau pompe < niveau liquide)")
    
    else:
        # No cavitation risk
        if npsh_margin < 0.5:
            warnings.append("⚠️ ATTENTION: Marge de sécurité NPSH faible")
            warnings.append(f"NPSHd calculé ({npshd:.2f} m) > NPSH requis ({npsh_required:.2f} m)")
            warnings.append(f"Marge de sécurité: {npsh_margin:.2f} m (RECOMMANDÉ: > 0.5 m)")
            recommendations.append("• Améliorer la marge de sécurité en réduisant les pertes de charge")
        elif npsh_margin < 1.0:
            warnings.append("✅ NPSH acceptable avec marge de sécurité limitée")
            warnings.append(f"NPSHd calculé ({npshd:.2f} m) > NPSH requis ({npsh_required:.2f} m)")
            warnings.append(f"Marge de sécurité: {npsh_margin:.2f} m (RECOMMANDÉ: > 1.0 m)")
        else:
            warnings.append("✅ NPSH excellent - Aucun risque de cavitation")
            warnings.append(f"NPSHd calculé ({npshd:.2f} m) >> NPSH requis ({npsh_required:.2f} m)")
            warnings.append(f"Marge de sécurité: {npsh_margin:.2f} m (EXCELLENTE)")
    
    return NPSHdResult(
        input_data=input_data,
        fluid_properties=fluid_props,
        atmospheric_pressure=atmospheric_pressure,
        velocity=velocity,
        reynolds_number=reynolds_number,
        friction_factor=friction_factor,
        linear_head_loss=linear_head_loss,
        singular_head_loss=singular_head_loss,
        total_head_loss=total_head_loss,
        npshd=npshd,
        npsh_required=npsh_required,
        npsh_margin=npsh_margin,
        cavitation_risk=cavitation_risk,
        recommendations=recommendations,
        warnings=warnings
    )

def calculate_hmt_enhanced(input_data: HMTCalculationInput) -> HMTResult:
    """Enhanced HMT calculation for Tab 2"""
    warnings = []
    
    # Get fluid properties
    fluid_props = get_fluid_properties(input_data.fluid_type, input_data.temperature)
    
    # Calculate velocities
    discharge_area = math.pi * (input_data.discharge_pipe_diameter / 1000 / 2) ** 2
    discharge_velocity = (input_data.flow_rate / 3600) / discharge_area
    
    # Calculate Reynolds numbers
    discharge_reynolds = calculate_reynolds_number(
        discharge_velocity, input_data.discharge_pipe_diameter / 1000,
        fluid_props.density, fluid_props.viscosity
    )
    
    # Calculate head losses
    if input_data.installation_type == "surface":
        suction_area = math.pi * (input_data.suction_pipe_diameter / 1000 / 2) ** 2
        suction_velocity = (input_data.flow_rate / 3600) / suction_area
        suction_reynolds = calculate_reynolds_number(
            suction_velocity, input_data.suction_pipe_diameter / 1000,
            fluid_props.density, fluid_props.viscosity
        )
        suction_linear_loss = calculate_linear_head_loss_enhanced(
            suction_velocity, input_data.suction_pipe_length, 
            input_data.suction_pipe_diameter, input_data.suction_pipe_material,
            suction_reynolds
        )
        suction_singular_loss = calculate_singular_head_loss(suction_velocity, input_data.suction_fittings)
        suction_head_loss = suction_linear_loss + suction_singular_loss
    else:  # submersible - no suction calculations
        suction_velocity = None
        suction_head_loss = 0
        suction_linear_loss = None
        suction_singular_loss = None
    
    discharge_linear_loss = calculate_linear_head_loss_enhanced(
        discharge_velocity, input_data.discharge_pipe_length,
        input_data.discharge_pipe_diameter, input_data.discharge_pipe_material,
        discharge_reynolds
    )
    discharge_singular_loss = calculate_singular_head_loss(discharge_velocity, input_data.discharge_fittings)
    discharge_head_loss = discharge_linear_loss + discharge_singular_loss
    
    # Total head losses
    total_head_loss = (suction_head_loss or 0) + discharge_head_loss
    
    # Static head
    if input_data.installation_type == "surface":
        static_head = input_data.discharge_height - input_data.hasp
    else:  # submersible
        static_head = input_data.discharge_height
    
    # Useful pressure head
    useful_pressure_head = (input_data.useful_pressure * 100000) / (fluid_props.density * 9.81)  # bar to m
    
    # Total HMT
    hmt = static_head + total_head_loss + useful_pressure_head
    
    # Warnings - Only check suction velocity if it exists
    if suction_velocity is not None and suction_velocity > 3.0:
        warnings.append(f"Vitesse d'aspiration élevée ({suction_velocity:.2f} m/s)")
    if discharge_velocity > 5.0:
        warnings.append(f"Vitesse de refoulement élevée ({discharge_velocity:.2f} m/s)")
    if hmt > 200:
        warnings.append(f"HMT très élevée ({hmt:.1f} m) - vérifier le dimensionnement")
    if input_data.useful_pressure > 10:
        warnings.append(f"Pression utile élevée ({input_data.useful_pressure} bar)")

    recommendations = []
    if suction_velocity is not None and suction_velocity > 1.5:
        recommendations.append("Augmentez le diamètre de la conduite d'aspiration pour réduire la vitesse.")
    if discharge_velocity > 3.0:
        recommendations.append("Augmentez le diamètre de la conduite de refoulement pour réduire la vitesse.")

    # Estimation indicative de la puissance absorbée (P1 ≈ (Q x HMT) / (367 x rendement pompe))
    absorbed_power = None
    if input_data.pump_efficiency and input_data.pump_efficiency > 0:
        absorbed_power = ((input_data.flow_rate * hmt) / (input_data.pump_efficiency * 367)) * 100

    return HMTResult(
        input_data=input_data,
        fluid_properties=fluid_props,
        suction_velocity=suction_velocity,
        discharge_velocity=discharge_velocity,
        suction_head_loss=suction_head_loss,
        discharge_head_loss=discharge_head_loss,
        total_head_loss=total_head_loss,
        static_head=static_head,
        useful_pressure_head=useful_pressure_head,
        hmt=hmt,
        warnings=warnings,
        # Champs détaillés pour l'interface
        velocity_suction=suction_velocity,
        velocity_discharge=discharge_velocity,
        geometric_height=static_head,
        suction_linear_loss=suction_linear_loss,
        suction_singular_loss=suction_singular_loss,
        discharge_linear_loss=discharge_linear_loss,
        discharge_singular_loss=discharge_singular_loss,
        total_hmt=hmt,
        absorbed_power=absorbed_power,
        recommendations=recommendations
    )

def calculate_darcy_head_loss(flow_rate: float, pipe_diameter: float, pipe_length: float, 
                             pipe_material: str, fluid_density: float, fluid_viscosity: float) -> float:
    """Calculate head loss using Darcy-Weisbach formula"""
    if flow_rate <= 0 or pipe_diameter <= 0:
        return 0
    
    # Convert units
    diameter_m = pipe_diameter / 1000  # mm to m
    pipe_area = math.pi * (diameter_m / 2) ** 2  # m²
    velocity = (flow_rate / 3600) / pipe_area  # m/s
    
    # Calculate Reynolds number
    reynolds_number = calculate_reynolds_number(velocity, diameter_m, fluid_density, fluid_viscosity)
    
    # Get pipe roughness
    if pipe_material not in PIPE_MATERIALS:
        roughness = 0.045  # Default steel roughness in mm
    else:
        roughness = PIPE_MATERIALS[pipe_material]["roughness"]  # mm
    
    # Calculate friction factor using Colebrook-White equation (Swamee-Jain approximation)
    relative_roughness = roughness / pipe_diameter  # Relative roughness
    
    if reynolds_number < 2300:
        # Laminar flow
        friction_factor = 64 / reynolds_number
    else:
        # Turbulent flow - Swamee-Jain approximation
        term1 = relative_roughness / 3.7
        term2 = 5.74 / (reynolds_number ** 0.9)
        friction_factor = 0.25 / (math.log10(term1 + term2) ** 2)
    
    # Darcy-Weisbach formula: ΔH = f × (L/D) × (V²/2g)
    head_loss = friction_factor * (pipe_length / diameter_m) * (velocity**2) / (2 * 9.81)
    
    return head_loss

def generate_performance_curves(input_data: PerformanceAnalysisInput) -> Dict[str, List[float]]:
    """Generate comprehensive performance curves with operating point matching input values and Darcy head loss"""
    flow_points = []
    hmt_points = []
    efficiency_points = []
    power_points = []
    head_loss_points = []
    
    base_flow = input_data.flow_rate
    base_hmt = input_data.hmt
    base_efficiency = input_data.pump_efficiency
    
    # Calculate base power using the corrected formula
    base_hydraulic_power = ((base_flow * base_hmt) / (base_efficiency * 367)) * 100
    
    # Operating point corresponds exactly to input values (not 85% of max flow)
    operating_point_flow = base_flow
    operating_point_hmt = base_hmt
    operating_point_efficiency = base_efficiency
    
    # Get fluid properties for Darcy calculations
    fluid_props = get_fluid_properties(input_data.fluid_type, 20)  # Default temperature for curves
    
    # Generate curve points from 0% to 150% of nominal flow
    for i in range(0, 151, 10):  # 0% to 150% of nominal flow
        flow_ratio = i / 100
        flow = base_flow * flow_ratio
        
        # HMT curve (quadratic curve: HMT = H0 - a*Q - b*Q²)
        # Adjusted to pass through the operating point exactly
        h0 = base_hmt * 1.2  # Shut-off head
        a = 0.2 * base_hmt / base_flow if base_flow > 0 else 0
        b = 0.5 * base_hmt / (base_flow**2) if base_flow > 0 else 0
        
        if flow == 0:
            hmt = h0
        else:
            hmt = h0 - a * flow - b * (flow**2)
        
        # Efficiency curve (parabolic with peak at operating point)
        if flow == 0:
            efficiency = 0
        else:
            # Peak efficiency at operating point flow
            efficiency_ratio = flow / operating_point_flow if operating_point_flow > 0 else 0
            efficiency = base_efficiency * (1 - 0.3 * (efficiency_ratio - 1)**2)
            efficiency = max(0, min(100, efficiency))
        
        # Power curve using corrected formula: P = ((Q * H) / (η * 367)) * 100
        if flow == 0:
            power = 0
        else:
            power = ((flow * hmt) / (efficiency * 367)) * 100 if efficiency > 0 else 0
        
        # Head loss curve using Darcy-Weisbach formula
        # Adjusted to intersect with HMT curve at operating point
        if flow == 0:
            head_loss = 0
        else:
            # Calculate base head loss at operating point
            base_head_loss = calculate_darcy_head_loss(
                flow_rate=operating_point_flow,
                pipe_diameter=input_data.pipe_diameter,
                pipe_length=50.0,  # Assumed standard length for curves
                pipe_material=input_data.pipe_material,
                fluid_density=fluid_props.density,
                fluid_viscosity=fluid_props.viscosity
            )
            
            # Scale head loss to ensure intersection at operating point
            # Head loss should equal HMT at operating point
            scaling_factor = operating_point_hmt / base_head_loss if base_head_loss > 0 else 1
            
            head_loss = calculate_darcy_head_loss(
                flow_rate=flow,
                pipe_diameter=input_data.pipe_diameter,
                pipe_length=50.0,
                pipe_material=input_data.pipe_material,
                fluid_density=fluid_props.density,
                fluid_viscosity=fluid_props.viscosity
            ) * scaling_factor
        
        flow_points.append(flow)
        hmt_points.append(max(0, hmt))
        efficiency_points.append(max(0, efficiency))
        power_points.append(max(0, power))
        head_loss_points.append(max(0, head_loss))
    
    # Operating point power using corrected formulas
    operating_point_power = ((operating_point_flow * operating_point_hmt) / (operating_point_efficiency * 367)) * 100
    
    return {
        "flow": flow_points,
        "hmt": hmt_points,
        "efficiency": efficiency_points,
        "power": power_points,
        "head_loss": head_loss_points,
        "best_operating_point": {
            "flow": operating_point_flow,
            "hmt": operating_point_hmt,
            "efficiency": operating_point_efficiency,
            "power": operating_point_power
        }
    }

def calculate_performance_analysis(input_data: PerformanceAnalysisInput) -> PerformanceAnalysisResult:
    """Performance analysis calculation for Tab 3 with corrected power formulas"""
    warnings = []
    recommendations = []
    alerts = []
    
    # Calculate velocity and Reynolds number
    diameter_m = input_data.pipe_diameter / 1000  # Convert mm to m
    pipe_area = math.pi * (diameter_m / 2) ** 2  # m²
    velocity = (input_data.flow_rate / 3600) / pipe_area  # m/s
    
    # Get fluid properties
    fluid_props = get_fluid_properties(input_data.fluid_type, 20)  # Default temperature
    reynolds_number = calculate_reynolds_number(velocity, diameter_m, fluid_props.density, fluid_props.viscosity)
    
    # Power calculations using the corrected formulas
    if input_data.hydraulic_power:
        # Use provided hydraulic power
        hydraulic_power = input_data.hydraulic_power
    else:
        # Calculate hydraulic power using the corrected formula:
        # P2 = ((débit × HMT) / (rendement pompe × 367)) * 100
        hydraulic_power = ((input_data.flow_rate * input_data.hmt) / (input_data.pump_efficiency * 367)) * 100
    
    if input_data.absorbed_power:
        # Use provided absorbed power
        absorbed_power = input_data.absorbed_power
        # Calculate actual motor efficiency
        actual_motor_efficiency = (hydraulic_power / absorbed_power) * 100
    else:
        # Calculate absorbed power using the corrected formula:
        # P1 = P2 / (rendement moteur / 100)
        absorbed_power = hydraulic_power / (input_data.motor_efficiency / 100)
        actual_motor_efficiency = input_data.motor_efficiency
    
    # Overall efficiency: Rendement Global = Rendement Moteur × Rendement Pompe
    overall_efficiency = (actual_motor_efficiency / 100) * (input_data.pump_efficiency / 100) * 100
    
    # Electrical calculations adapted for starting method
    if input_data.voltage == 230:
        # Single phase
        nominal_current = (absorbed_power * 1000) / (input_data.voltage * input_data.power_factor)
        if input_data.starting_method == "direct_on_line":
            starting_current = nominal_current * 7.0
        else:  # star_delta
            starting_current = nominal_current * 2.0
    else:
        # Three phase
        nominal_current = (absorbed_power * 1000) / (input_data.voltage * 1.732 * input_data.power_factor)
        if input_data.starting_method == "direct_on_line":
            starting_current = nominal_current * 6.0
        else:  # star_delta
            starting_current = nominal_current * 2.0
    
    # Cable section calculation
    if input_data.cable_section:
        recommended_cable_section = input_data.cable_section
    else:
        # Basic cable sizing
        if input_data.voltage == 230:
            current_density = 6  # A/mm²
        else:
            current_density = 8  # A/mm²
        
        base_section = nominal_current / current_density
        length_factor = 1 + (input_data.cable_length / 100) * 0.2
        required_section = base_section * length_factor
        
        # Round to standard cable sections
        standard_sections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]
        recommended_cable_section = next((s for s in standard_sections if s >= required_section), 300)

    # Puissance hydraulique pure Ph (sans pertes de rendement), à partir de rho.g.Q.H
    true_hydraulic_power = (fluid_props.density * 9.81 * (input_data.flow_rate / 3600) * input_data.hmt) / 1000  # kW

    # Chute de tension câble (formule NF C 15-100 simplifiée)
    cable_resistivity = {"copper": 0.0225, "aluminum": 0.036}.get(getattr(input_data, 'cable_material', 'copper'), 0.0225)
    if input_data.voltage == 230:  # monophasé
        voltage_drop = (2 * cable_resistivity * input_data.cable_length * nominal_current * input_data.power_factor) / recommended_cable_section
    else:  # triphasé
        voltage_drop = (1.732 * cable_resistivity * input_data.cable_length * nominal_current * input_data.power_factor) / recommended_cable_section
    voltage_drop_percent = (voltage_drop / input_data.voltage) * 100
    if voltage_drop_percent > 3:
        warnings.append(f"Chute de tension excessive ({voltage_drop_percent:.1f}% > 3% autorisé NF C 15-100)")
        recommendations.append("Augmentez la section de câble ou réduisez la longueur de câble")

    # Generate performance curves (débit en fonction de HMT)
    performance_curves = generate_performance_curves(input_data)
    
    # Velocity alerts
    if velocity > 3.0:
        alerts.append(f"Vitesse élevée ({velocity:.2f} m/s) - Risque d'érosion")
        recommendations.append("Considérer un diamètre de tuyauterie plus grand")
    elif velocity < 0.5:
        alerts.append(f"Vitesse faible ({velocity:.2f} m/s) - Risque de sédimentation")
        recommendations.append("Considérer un diamètre de tuyauterie plus petit")
    
    # Reynolds number alerts
    if reynolds_number < 2300:
        alerts.append("Écoulement laminaire détecté")
    elif reynolds_number > 4000:
        alerts.append("Écoulement turbulent détecté")
    
    # Warnings and recommendations
    if overall_efficiency < 60:
        warnings.append(f"Rendement global faible ({overall_efficiency:.1f}%)")
        recommendations.append("Vérifier le dimensionnement de la pompe et du moteur")
    
    if input_data.pump_efficiency < 70:
        warnings.append(f"Rendement pompe faible ({input_data.pump_efficiency:.1f}%)")
        recommendations.append("Considérer une pompe plus efficace")
    
    if input_data.motor_efficiency < 85:
        warnings.append(f"Rendement moteur faible ({input_data.motor_efficiency:.1f}%)")
        recommendations.append("Considérer un moteur plus efficace")
    
    if starting_current > 150:
        warnings.append(f"Courant de démarrage élevé ({starting_current:.1f} A)")
        recommendations.append("Considérer un démarreur progressif ou étoile-triangle")
    
    if absorbed_power > 100:
        warnings.append(f"Puissance absorbée élevée ({absorbed_power:.1f} kW)")
        recommendations.append("Vérifier le dimensionnement du système")
    
    # Power formula verification
    if hydraulic_power > absorbed_power:
        warnings.append("ERREUR: Puissance hydraulique > puissance absorbée - vérifier les valeurs")
    
    return PerformanceAnalysisResult(
        input_data=input_data,
        pump_efficiency=input_data.pump_efficiency,
        motor_efficiency=actual_motor_efficiency,
        overall_efficiency=overall_efficiency,
        velocity=velocity,
        reynolds_number=reynolds_number,
        nominal_current=nominal_current,
        starting_current=starting_current,
        recommended_cable_section=recommended_cable_section,
        power_calculations={
            "hydraulic_power": hydraulic_power,
            "absorbed_power": absorbed_power,
            "overall_efficiency": overall_efficiency
        },
        electrical_data={
            "voltage": input_data.voltage,
            "power_factor": input_data.power_factor,
            "starting_method": input_data.starting_method,
            "cable_length": input_data.cable_length,
            "cable_material": getattr(input_data, 'cable_material', 'copper')
        },
        performance_curves=performance_curves,
        recommendations=recommendations,
        warnings=warnings,
        alerts=alerts,
        # Champs détaillés pour l'interface
        hydraulic_power=true_hydraulic_power,
        mechanical_power=hydraulic_power,
        absorbed_power=absorbed_power,
        cable_section=recommended_cable_section,
        voltage_drop=voltage_drop,
        voltage_drop_percent=voltage_drop_percent
    )

def calculate_expert_analysis(input_data: ExpertAnalysisInput) -> ExpertAnalysisResult:
    """
    Analyse complète d'expert avec tous les calculs hydrauliques et électriques
    """
    
    # Détermination du type d'aspiration
    suction_type = input_data.suction_type
    hasp = abs(input_data.suction_height)
    
    # Construction des raccords ASPIRATION
    suction_fittings = []
    
    # Coudes
    if input_data.suction_elbow_90 > 0:
        suction_fittings.append({"fitting_type": "elbow_90", "quantity": input_data.suction_elbow_90})
    if input_data.suction_elbow_45 > 0:
        suction_fittings.append({"fitting_type": "elbow_45", "quantity": input_data.suction_elbow_45})
    if input_data.suction_elbow_30 > 0:
        suction_fittings.append({"fitting_type": "elbow_30", "quantity": input_data.suction_elbow_30})
    
    # Tés
    if input_data.suction_tee_flow > 0:
        suction_fittings.append({"fitting_type": "tee_flow", "quantity": input_data.suction_tee_flow})
    if input_data.suction_tee_branch > 0:
        suction_fittings.append({"fitting_type": "tee_branch", "quantity": input_data.suction_tee_branch})
    
    # Réductions
    if input_data.suction_reducer_gradual > 0:
        suction_fittings.append({"fitting_type": "reducer_gradual", "quantity": input_data.suction_reducer_gradual})
    if input_data.suction_reducer_sudden > 0:
        suction_fittings.append({"fitting_type": "reducer_sudden", "quantity": input_data.suction_reducer_sudden})
    
    # Vannes
    if input_data.suction_gate_valve > 0:
        suction_fittings.append({"fitting_type": "gate_valve", "quantity": input_data.suction_gate_valve})
    if input_data.suction_globe_valve > 0:
        suction_fittings.append({"fitting_type": "globe_valve", "quantity": input_data.suction_globe_valve})
    if input_data.suction_ball_valve > 0:
        suction_fittings.append({"fitting_type": "ball_valve", "quantity": input_data.suction_ball_valve})
    if input_data.suction_butterfly_valve > 0:
        suction_fittings.append({"fitting_type": "butterfly_valve", "quantity": input_data.suction_butterfly_valve})
    
    # Accessoires
    if input_data.suction_check_valve > 0:
        suction_fittings.append({"fitting_type": "check_valve", "quantity": input_data.suction_check_valve})
    if input_data.suction_strainer > 0:
        suction_fittings.append({"fitting_type": "strainer", "quantity": input_data.suction_strainer})
    if input_data.suction_foot_valve > 0:
        suction_fittings.append({"fitting_type": "foot_valve", "quantity": input_data.suction_foot_valve})
    
    # Construction des raccords REFOULEMENT
    discharge_fittings = []
    
    # Coudes
    if input_data.discharge_elbow_90 > 0:
        discharge_fittings.append({"fitting_type": "elbow_90", "quantity": input_data.discharge_elbow_90})
    if input_data.discharge_elbow_45 > 0:
        discharge_fittings.append({"fitting_type": "elbow_45", "quantity": input_data.discharge_elbow_45})
    if input_data.discharge_elbow_30 > 0:
        discharge_fittings.append({"fitting_type": "elbow_30", "quantity": input_data.discharge_elbow_30})
    
    # Tés
    if input_data.discharge_tee_flow > 0:
        discharge_fittings.append({"fitting_type": "tee_flow", "quantity": input_data.discharge_tee_flow})
    if input_data.discharge_tee_branch > 0:
        discharge_fittings.append({"fitting_type": "tee_branch", "quantity": input_data.discharge_tee_branch})
    
    # Réductions
    if input_data.discharge_reducer_gradual > 0:
        discharge_fittings.append({"fitting_type": "reducer_gradual", "quantity": input_data.discharge_reducer_gradual})
    if input_data.discharge_reducer_sudden > 0:
        discharge_fittings.append({"fitting_type": "reducer_sudden", "quantity": input_data.discharge_reducer_sudden})
    
    # Vannes
    if input_data.discharge_gate_valve > 0:
        discharge_fittings.append({"fitting_type": "gate_valve", "quantity": input_data.discharge_gate_valve})
    if input_data.discharge_globe_valve > 0:
        discharge_fittings.append({"fitting_type": "globe_valve", "quantity": input_data.discharge_globe_valve})
    if input_data.discharge_ball_valve > 0:
        discharge_fittings.append({"fitting_type": "ball_valve", "quantity": input_data.discharge_ball_valve})
    if input_data.discharge_butterfly_valve > 0:
        discharge_fittings.append({"fitting_type": "butterfly_valve", "quantity": input_data.discharge_butterfly_valve})
    
    # Accessoires
    if input_data.discharge_check_valve > 0:
        discharge_fittings.append({"fitting_type": "check_valve", "quantity": input_data.discharge_check_valve})
    if input_data.discharge_strainer > 0:
        discharge_fittings.append({"fitting_type": "strainer", "quantity": input_data.discharge_strainer})
    if input_data.discharge_flow_meter > 0:
        discharge_fittings.append({"fitting_type": "flow_meter", "quantity": input_data.discharge_flow_meter})
    if input_data.discharge_pressure_gauge > 0:
        discharge_fittings.append({"fitting_type": "pressure_gauge", "quantity": input_data.discharge_pressure_gauge})
    
    # Calcul NPSHd
    npshd_input = NPSHdCalculationInput(
        suction_type=suction_type,
        hasp=hasp,
        flow_rate=input_data.flow_rate,
        fluid_type=input_data.fluid_type,
        temperature=input_data.temperature,
        pipe_diameter=input_data.suction_pipe_diameter,
        pipe_material=input_data.suction_material,
        pipe_length=input_data.suction_length,
        suction_fittings=[FittingInput(**f) for f in suction_fittings],
        npsh_required=input_data.npsh_required
    )
    npshd_result = calculate_npshd_enhanced(npshd_input)
    
    # Calcul HMT avec pression utile
    hmt_input = HMTCalculationInput(
        installation_type=input_data.installation_type,
        suction_type=suction_type,
        hasp=hasp,
        discharge_height=input_data.discharge_height,
        useful_pressure=input_data.useful_pressure,  # Pression utile intégrée
        suction_pipe_diameter=input_data.suction_pipe_diameter,
        discharge_pipe_diameter=input_data.discharge_pipe_diameter,
        suction_pipe_length=input_data.suction_length,
        discharge_pipe_length=input_data.discharge_length,
        suction_pipe_material=input_data.suction_material,
        discharge_pipe_material=input_data.discharge_material,
        suction_fittings=[FittingInput(**f) for f in suction_fittings],
        discharge_fittings=[FittingInput(**f) for f in discharge_fittings],
        fluid_type=input_data.fluid_type,
        temperature=input_data.temperature,
        flow_rate=input_data.flow_rate
    )
    hmt_result = calculate_hmt_enhanced(hmt_input)
    
    # Calcul Performance
    perf_input = PerformanceAnalysisInput(
        flow_rate=input_data.flow_rate,
        hmt=hmt_result.hmt,
        pipe_diameter=input_data.suction_pipe_diameter,
        fluid_type=input_data.fluid_type,
        pipe_material=input_data.suction_material,
        pump_efficiency=input_data.pump_efficiency,
        motor_efficiency=input_data.motor_efficiency,
        starting_method=input_data.starting_method,
        power_factor=input_data.power_factor,
        cable_length=input_data.cable_length,
        cable_material=input_data.cable_material,
        voltage=input_data.voltage
    )
    perf_result = calculate_performance_analysis(perf_input)
    
    # Analyse globale
    overall_efficiency = perf_result.overall_efficiency
    total_head_loss = npshd_result.total_head_loss + hmt_result.total_head_loss
    
    # Stabilité du système
    system_stability = not npshd_result.cavitation_risk and overall_efficiency > 60
    
    # Consommation énergétique (kWh/m³) — basée sur la puissance ABSORBÉE réelle (P1),
    # c'est-à-dire ce qui est effectivement prélevé sur le réseau électrique.
    # (perf_result.power_calculations["hydraulic_power"] est en réalité la puissance
    # mécanique à l'arbre Pm, plus faible que P1 — l'utiliser ici sous-estimait le
    # coût énergétique réel et les économies potentielles calculées plus bas)
    absorbed_power_for_cost = perf_result.absorbed_power
    energy_consumption = absorbed_power_for_cost / input_data.flow_rate if input_data.flow_rate > 0 else 0
    
    # Coût énergétique annuel
    annual_energy_consumption = absorbed_power_for_cost * input_data.operating_hours
    annual_energy_cost = annual_energy_consumption * input_data.electricity_cost
    
    # Recommandations d'expert enrichies
    expert_recommendations = []
    
    # Analyse critique de cavitation
    if npshd_result.cavitation_risk:
        expert_recommendations.append({
            "type": "critical",
            "priority": 1,
            "title": "🚨 CAVITATION CRITIQUE",
            "description": f"NPSHd ({npshd_result.npshd:.2f}m) ≤ NPSH requis ({input_data.npsh_required:.2f}m)",
            "impact": "DESTRUCTION DE LA POMPE - Arrêt immédiat requis",
            "solutions": [
                f"Réduire hauteur d'aspiration de {hasp:.1f}m à {max(0, hasp - abs(npshd_result.npsh_margin) - 0.5):.1f}m",
                f"Augmenter diamètre aspiration de {input_data.suction_pipe_diameter:.0f}mm à {input_data.suction_pipe_diameter * 1.3:.0f}mm",
                f"Réduire longueur aspiration de {input_data.suction_length:.0f}m à {input_data.suction_length * 0.7:.0f}m",
                "Supprimer raccords non essentiels sur aspiration",
                "Installer pompe en charge si possible",
                "Augmenter température pour réduire pression vapeur",
                "Installer pompe plus proche du réservoir"
            ],
            "urgency": "IMMÉDIATE",
            "cost_impact": "ÉLEVÉ"
        })
    
    # Recommandations d'installation hydraulique spécifiques
    installation_recommendations = []
    
    # Recommandations selon le type d'aspiration
    if suction_type == "suction_lift":
        installation_recommendations.extend([
            "Configuration aspiration en dépression détectée",
            "Installer crépine foot valve pour maintenir l'amorçage",
            "Prévoir système d'amorçage automatique",
            "Éviter les points hauts sur la ligne d'aspiration",
            "Installer clapet anti-retour sur aspiration",
            "Hauteur aspiration maximale: 7m en pratique",
            "Prévoir purgeur d'air en point haut"
        ])
    else:  # flooded
        installation_recommendations.extend([
            "Configuration aspiration en charge optimale",
            "Vanne d'arrêt sur aspiration pour maintenance",
            "Prévoir by-pass pour continuité de service",
            "Éviter réduction de section sur aspiration",
            "Installer manomètre aspiration pour surveillance"
        ])
    
    # Recommandations pour les vitesses d'écoulement
    velocity_recommendations = []
    if npshd_result.velocity > 3.0:
        velocity_recommendations.extend([
            f"Vitesse aspiration excessive: {npshd_result.velocity:.2f} m/s",
            f"Augmenter diamètre aspiration: {input_data.suction_pipe_diameter}mm → {input_data.suction_pipe_diameter * 1.2:.0f}mm",
            "Utiliser courbes à grand rayon (3D minimum)",
            "Installer supports anti-vibratoires",
            "Prévoir isolation acoustique"
        ])
    elif npshd_result.velocity < 0.8:
        velocity_recommendations.extend([
            f"Vitesse aspiration faible: {npshd_result.velocity:.2f} m/s",
            "Risque de sédimentation et dépôts",
            "Prévoir nettoyage périodique des conduites",
            "Considérer réduction de diamètre si possible"
        ])
    
    # Recommandations pour les pertes de charge
    head_loss_recommendations = []
    if npshd_result.total_head_loss > 5.0:
        head_loss_recommendations.extend([
            f"Pertes de charge aspiration élevées: {npshd_result.total_head_loss:.2f} m",
            "Optimiser tracé hydraulique (éviter coudes)",
            "Utiliser raccords progressive au lieu de brusques",
            "Vérifier état intérieur des conduites",
            "Considérer matériau plus lisse",
            "Réduire nombre de singularités"
        ])
    
    # Recommandations matériaux selon le fluide - ANALYSE COMPLÈTE DE COMPATIBILITÉ CHIMIQUE
    material_recommendations = []
    
    # Nouvelle analyse complète de compatibilité chimique
    compatibility_analysis = analyze_chemical_compatibility(
        input_data.fluid_type,
        input_data.suction_material,
        input_data.discharge_material,
        input_data.temperature
    )
    
    # Intégrer les résultats de l'analyse de compatibilité
    if compatibility_analysis["recommendations"]:
        material_recommendations.extend([
            f"🧪 ANALYSE DE COMPATIBILITÉ CHIMIQUE - {compatibility_analysis['fluid_name']}"
        ])
        material_recommendations.extend(compatibility_analysis["recommendations"])
        
        # Ajouter les recommandations de joints
        if compatibility_analysis["seal_recommendations"]:
            material_recommendations.extend(compatibility_analysis["seal_recommendations"])
        
        # Ajouter les conseils hydrauliques avancés
        if compatibility_analysis["hydraulic_advice"]:
            material_recommendations.extend(compatibility_analysis["hydraulic_advice"])
        
        # Ajouter les matériaux optimaux
        if compatibility_analysis["optimal_materials"]:
            material_recommendations.append(
                f"🏗️ MATÉRIAUX OPTIMAUX: {', '.join(compatibility_analysis['optimal_materials'][:3])}"
            )
    
    # Recommandations générales pour certains fluides (complément)
    if input_data.fluid_type == "acid":
        material_recommendations.extend([
            "📋 RÉGLEMENTATION: Directive ATEX pour milieux corrosifs",
            "🧯 Sécurité: EPI résistant acides obligatoire"
        ])
    elif input_data.temperature > 60:
        material_recommendations.extend([
            f"🌡️ Température élevée: {input_data.temperature}°C",
            "📏 Calcul dilatation: ΔL = α × L × ΔT",
            "🔧 Supports: Coulissants tous les 20m maximum"
        ])
    
    # Recommandations électriques d'installation
    electrical_recommendations = []
    if perf_result.starting_current > 150:
        electrical_recommendations.extend([
            f"Courant de démarrage élevé: {perf_result.starting_current:.0f}A",
            "Démarreur progressif recommandé",
            "Vérifier capacité du transformateur",
            "Prévoir compensation d'énergie réactive",
            "Installer protection thermique renforcée"
        ])
    
    # Recommandations de maintenance préventive
    maintenance_recommendations = [
        "Maintenance préventive recommandée:",
        "- Vérification alignement pompe-moteur (6 mois)",
        "- Contrôle vibrations et bruit (mensuel)",
        "- Inspection étanchéité (trimestriel)",
        "- Analyse d'huile roulement (annuel)",
        "- Vérification serrage boulonnage (6 mois)",
        "- Contrôle isolement électrique (annuel)"
    ]
    
    # Ajout des recommandations spécialisées
    if len(installation_recommendations) > 0:
        expert_recommendations.append({
            "type": "installation",
            "priority": 2,
            "title": "🏗️ INSTALLATION HYDRAULIQUE",
            "description": f"Optimisations spécifiques pour configuration {suction_type}",
            "impact": "Amélioration fiabilité et performance",
            "solutions": installation_recommendations,
            "urgency": "MOYENNE",
            "cost_impact": "MODÉRÉ"
        })
    
    if len(velocity_recommendations) > 0:
        expert_recommendations.append({
            "type": "velocity",
            "priority": 3,
            "title": "🌊 OPTIMISATION VITESSES",
            "description": "Ajustement des vitesses d'écoulement",
            "impact": "Réduction usure et optimisation énergétique",
            "solutions": velocity_recommendations,
            "urgency": "MOYENNE",
            "cost_impact": "MODÉRÉ"
        })
    
    if len(head_loss_recommendations) > 0:
        expert_recommendations.append({
            "type": "head_loss",
            "priority": 4,
            "title": "⚡ RÉDUCTION PERTES DE CHARGE",
            "description": "Optimisation circuit hydraulique",
            "impact": "Économie d'énergie et performance",
            "solutions": head_loss_recommendations,
            "urgency": "FAIBLE",
            "cost_impact": "RENTABLE"
        })
    
    if len(material_recommendations) > 0:
        expert_recommendations.append({
            "type": "materials",
            "priority": 5,
            "title": "🔧 MATÉRIAUX ET TEMPÉRATURE",
            "description": "Compatibilité matériaux/fluide/température",
            "impact": "Durabilité et sécurité installation",
            "solutions": material_recommendations,
            "urgency": "MOYENNE",
            "cost_impact": "VARIABLE"
        })
    
    if len(electrical_recommendations) > 0:
        expert_recommendations.append({
            "type": "electrical",
            "priority": 6,
            "title": "🔌 OPTIMISATION ÉLECTRIQUE",
            "description": "Améliorations système électrique",
            "impact": "Fiabilité démarrage et protection",
            "solutions": electrical_recommendations,
            "urgency": "MOYENNE",
            "cost_impact": "MODÉRÉ"
        })
    
    expert_recommendations.append({
        "type": "maintenance",
        "priority": 7,
        "title": "🔍 MAINTENANCE PRÉVENTIVE",
        "description": "Plan de maintenance pour fiabilité optimale",
        "impact": "Prolongation durée de vie équipement",
        "solutions": maintenance_recommendations,
        "urgency": "FAIBLE",
        "cost_impact": "RENTABLE"
    })
    
    # Analyse de performance énergétique
    if overall_efficiency < 65:
        potential_savings = (75 - overall_efficiency) * 0.01 * annual_energy_cost
        expert_recommendations.append({
            "type": "energy",
            "priority": 2,
            "title": "⚡ EFFICACITÉ ÉNERGÉTIQUE FAIBLE",
            "description": f"Rendement global {overall_efficiency:.1f}% - Potentiel d'économie de {potential_savings:.0f} FCFA/an",
            "impact": f"Surconsommation: {potential_savings * 10:.0f} FCFA sur 10 ans",
            "solutions": [
                "Pompe haute efficacité (gain 5-10%)",
                "Moteur haut rendement Premium (gain 2-5%)",
                "Variateur de vitesse (gain 10-30%)",
                "Optimisation point de fonctionnement",
                "Maintenance préventive régulière"
            ],
            "urgency": "MOYENNE",
            "cost_impact": "RENTABLE"
        })
    
    # Analyse hydraulique avancée
    if npshd_result.velocity > 3.0:
        expert_recommendations.append({
            "type": "hydraulic",
            "priority": 3,
            "title": "🌊 VITESSE EXCESSIVE",
            "description": f"Vitesse {npshd_result.velocity:.2f}m/s > 3m/s - Risque d'érosion et cavitation",
            "impact": "Usure prématurée, bruit, vibrations, perte de performance",
            "solutions": [
                f"Diamètre aspiration: {input_data.suction_pipe_diameter:.0f}mm → {input_data.suction_pipe_diameter * math.sqrt(npshd_result.velocity / 2.5):.0f}mm",
                f"Diamètre refoulement: {input_data.discharge_pipe_diameter:.0f}mm → {input_data.discharge_pipe_diameter * math.sqrt(npshd_result.velocity / 3.0):.0f}mm",
                "Matériaux anti-érosion (inox, fonte)",
                "Supports anti-vibratoires",
                "Réduction débit si possible"
            ],
            "urgency": "MOYENNE",
            "cost_impact": "MODÉRÉ"
        })
    
    # Analyse des singularités
    total_singularities = sum([
        input_data.suction_elbow_90, input_data.suction_elbow_45, input_data.suction_elbow_30,
        input_data.suction_tee_flow, input_data.suction_tee_branch,
        input_data.suction_reducer_gradual, input_data.suction_reducer_sudden,
        input_data.suction_gate_valve, input_data.suction_globe_valve, input_data.suction_ball_valve,
        input_data.suction_butterfly_valve, input_data.suction_check_valve, input_data.suction_strainer,
        input_data.suction_foot_valve,
        input_data.discharge_elbow_90, input_data.discharge_elbow_45, input_data.discharge_elbow_30,
        input_data.discharge_tee_flow, input_data.discharge_tee_branch,
        input_data.discharge_reducer_gradual, input_data.discharge_reducer_sudden,
        input_data.discharge_gate_valve, input_data.discharge_globe_valve, input_data.discharge_ball_valve,
        input_data.discharge_butterfly_valve, input_data.discharge_check_valve, input_data.discharge_strainer,
        input_data.discharge_flow_meter, input_data.discharge_pressure_gauge
    ])
    
    if total_singularities > 15:
        expert_recommendations.append({
            "type": "complexity",
            "priority": 4,
            "title": "🔧 INSTALLATION COMPLEXE",
            "description": f"{total_singularities} singularités - Pertes de charge élevées",
            "impact": "Réduction du rendement, maintenance accrue, coûts d'exploitation",
            "solutions": [
                "Simplification du circuit hydraulique",
                "Réduction nombre de raccords",
                "Tuyauterie rectiligne privilégiée",
                "Raccords à rayon large",
                "Maintenance préventive renforcée"
            ],
            "urgency": "FAIBLE",
            "cost_impact": "LONG TERME"
        })
    
    # Potentiel d'optimisation
    optimization_potential = {
        "energy_savings": max(0, 80 - overall_efficiency),  # Potentiel d'économie d'énergie
        "npsh_margin": npshd_result.npsh_margin,
        "velocity_optimization": max(0, npshd_result.velocity - 2.0),  # Réduction de vitesse possible
        "head_loss_reduction": max(0, total_head_loss - (total_head_loss * 0.7)),  # Réduction pertes possible
        "annual_cost_savings": potential_savings if overall_efficiency < 65 else 0
    }
    
    # Courbes de performance étendues
    performance_curves = generate_performance_curves(perf_input)
    
    # Courbes système
    system_curves = {
        "flow_points": performance_curves["flow"],
        "system_curve": [flow**2 * (total_head_loss / input_data.flow_rate**2) for flow in performance_curves["flow"]],
        "operating_point": {
            "flow": input_data.flow_rate,
            "head": hmt_result.hmt,
            "efficiency": overall_efficiency,
            "power": perf_result.hydraulic_power
        }
    }
    
    return ExpertAnalysisResult(
        input_data=input_data,
        npshd_analysis={
            "npshd": npshd_result.npshd,
            "npsh_required": npshd_result.npsh_required,
            "npsh_margin": npshd_result.npsh_margin,
            "cavitation_risk": npshd_result.cavitation_risk,
            "velocity": npshd_result.velocity,
            "reynolds_number": npshd_result.reynolds_number,
            "total_head_loss": npshd_result.total_head_loss,
            "warnings": npshd_result.warnings,
            "recommendations": npshd_result.recommendations
        },
        hmt_analysis={
            "hmt": hmt_result.hmt,
            "static_head": hmt_result.static_head,
            "total_head_loss": hmt_result.total_head_loss,
            "suction_velocity": hmt_result.suction_velocity,
            "discharge_velocity": hmt_result.discharge_velocity,
            "useful_pressure_head": hmt_result.useful_pressure_head,
            "warnings": hmt_result.warnings
        },
        performance_analysis={
            "overall_efficiency": perf_result.overall_efficiency,
            "pump_efficiency": perf_result.pump_efficiency,
            "motor_efficiency": perf_result.motor_efficiency,
            "hydraulic_power": perf_result.hydraulic_power,
            "electrical_power": perf_result.power_calculations.get("absorbed_power", 0),
            "nominal_current": perf_result.nominal_current,
            "starting_current": perf_result.starting_current,
            "power_calculations": perf_result.power_calculations,
            "warnings": perf_result.warnings,
            "alerts": perf_result.alerts
        },
        electrical_analysis={
            "voltage": input_data.voltage,
            "power_factor": input_data.power_factor,
            "starting_method": input_data.starting_method,
            "cable_length": input_data.cable_length,
            "cable_section": perf_result.recommended_cable_section,
            "annual_energy_cost": annual_energy_cost,
            "daily_energy_cost": annual_energy_cost / 365,
            "energy_consumption_per_m3": energy_consumption,
            "operating_hours": input_data.operating_hours,
            "electricity_cost": input_data.electricity_cost
        },
        overall_efficiency=overall_efficiency,
        total_head_loss=total_head_loss,
        system_stability=system_stability,
        energy_consumption=energy_consumption,
        expert_recommendations=expert_recommendations,
        optimization_potential=optimization_potential,
        performance_curves=performance_curves,
        system_curves=system_curves
    )

@api_router.post("/expert-analysis", response_model=ExpertAnalysisResult)
async def expert_analysis(input_data: ExpertAnalysisInput):
    """
    Analyse complète d'expert avec tous les calculs hydrauliques et électriques
    """
    try:
        result = calculate_expert_analysis(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur dans l'analyse expert: {str(e)}")

# Legacy functions for backward compatibility
def calculate_cable_section(current: float, cable_length: float, voltage: int) -> float:
    """Calculate required cable section"""
    if voltage == 230:
        base_section = current / 6  # A/mm²
    else:  # 400V
        base_section = current / 8  # A/mm²
    
    length_factor = 1 + (cable_length / 100) * 0.2
    required_section = base_section * length_factor
    
    standard_sections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]
    for section in standard_sections:
        if section >= required_section:
            return section
    
    return 300

def perform_hydraulic_calculation(input_data: CalculationInput) -> CalculationResult:
    """Legacy hydraulic calculation function"""
    warnings = []
    
    # Get fluid properties
    fluid_props = get_fluid_properties(input_data.fluid_type, input_data.temperature)
    
    # Convert units
    flow_rate_m3s = input_data.flow_rate / 3600
    pipe_diameter_m = input_data.pipe_diameter / 1000
    pipe_area = math.pi * (pipe_diameter_m / 2) ** 2
    
    # Calculate flow velocity
    flow_velocity = flow_rate_m3s / pipe_area
    
    # Calculate Reynolds number
    reynolds_number = calculate_reynolds_number(
        flow_velocity, pipe_diameter_m, fluid_props.density, fluid_props.viscosity
    )
    
    # Calculate friction factor
    friction_factor = calculate_friction_factor(reynolds_number)
    
    # Calculate pressure losses
    linear_pressure_loss = friction_factor * (input_data.pipe_length / pipe_diameter_m) * (fluid_props.density * flow_velocity**2 / 2)
    total_pressure_loss = linear_pressure_loss * 1.2
    
    # Calculate HMT
    static_head = input_data.suction_height if input_data.suction_height > 0 else 0
    pressure_head = total_pressure_loss / (fluid_props.density * 9.81)
    hmt_meters = static_head + pressure_head
    hmt_bar = hmt_meters * fluid_props.density * 9.81 / 100000
    
    # Calculate NPSH
    npsh_required = 2.0 + (input_data.flow_rate / 100) ** 0.8
    npsh_available_calc = 10.3 - abs(input_data.suction_height) - (total_pressure_loss / (fluid_props.density * 9.81))
    cavitation_risk = npsh_available_calc <= npsh_required
    
    # Calculate power
    hydraulic_power = (flow_rate_m3s * hmt_meters * fluid_props.density * 9.81) / 1000
    total_efficiency = (input_data.pump_efficiency * input_data.motor_efficiency) / 10000
    absorbed_power = hydraulic_power / total_efficiency
    
    # Calculate electrical parameters
    if input_data.voltage == 230:
        nominal_current = (absorbed_power * 1000) / (input_data.voltage * 0.8)
    else:
        nominal_current = (absorbed_power * 1000) / (input_data.voltage * 1.732 * 0.8)
    
    cable_section = calculate_cable_section(nominal_current, input_data.cable_length, input_data.voltage)
    starting_method = "Direct start" if absorbed_power < 3 else "Star-delta"
    
    if cavitation_risk:
        warnings.append("RISQUE DE CAVITATION: NPSHd ≤ NPSHr")
    
    return CalculationResult(
        input_data=input_data,
        fluid_properties=fluid_props,
        flow_velocity=flow_velocity,
        reynolds_number=reynolds_number,
        friction_factor=friction_factor,
        linear_pressure_loss=linear_pressure_loss,
        total_pressure_loss=total_pressure_loss,
        hmt_meters=hmt_meters,
        hmt_bar=hmt_bar,
        npsh_required=npsh_required,
        npsh_available_calc=npsh_available_calc,
        cavitation_risk=cavitation_risk,
        hydraulic_power=hydraulic_power,
        absorbed_power=absorbed_power,
        total_efficiency=total_efficiency * 100,
        nominal_current=nominal_current,
        cable_section=cable_section,
        starting_method=starting_method,
        warnings=warnings
    )

# ============================================================================
# AUTHENTIFICATION
# ============================================================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentification requise. Veuillez vous connecter.")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée. Veuillez vous reconnecter.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Jeton d'authentification invalide.")
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable.")
    return user

def user_to_public(user: dict) -> UserPublic:
    return UserPublic(id=user["id"], email=user["email"], name=user["name"],
                       company=user.get("company"), created_at=user["created_at"])

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email.")
    user = {
        "id": str(uuid.uuid4()),
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "name": data.name,
        "company": data.company,
        "created_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(user)
    token = create_access_token(user["id"])
    return TokenResponse(access_token=token, user=user_to_public(user))

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")
    token = create_access_token(user["id"])
    return TokenResponse(access_token=token, user=user_to_public(user))

@api_router.get("/auth/me", response_model=UserPublic)
async def get_me(current_user: dict = Depends(get_current_user)):
    return user_to_public(current_user)

# ============================================================================
# ENHANCED API ENDPOINTS FOR THREE TABS
# ============================================================================

@api_router.get("/")
async def root():
    return {"message": "API de Calcul Hydraulique pour Pompes Centrifuges"}

@api_router.get("/fluids")
async def get_available_fluids():
    """Obtenir la liste des fluides disponibles"""
    return {
        "fluids": [
            {"id": key, "name": value["name"]} 
            for key, value in FLUID_PROPERTIES.items()
        ]
    }

@api_router.get("/pipe-materials")
async def get_pipe_materials():
    """Obtenir la liste des matériaux de tuyauterie"""
    return {
        "materials": [
            {"id": key, "name": value["name"], "description": value["description"]}
            for key, value in PIPE_MATERIALS.items()
        ]
    }

@api_router.get("/fittings")
async def get_fittings():
    """Obtenir la liste des raccords disponibles"""
    return {
        "fittings": [
            {"id": key, "name": value["name"], "k_coefficient": value["k"]}
            for key, value in FITTING_COEFFICIENTS.items()
        ]
    }

@api_router.post("/calculate-npshd", response_model=NPSHdResult)
async def calculate_npshd_endpoint(input_data: NPSHdCalculationInput):
    """Calcul NPSHd - Onglet 1"""
    try:
        result = calculate_npshd_enhanced(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/calculate-hmt", response_model=HMTResult)
async def calculate_hmt_endpoint(input_data: HMTCalculationInput):
    """Calcul HMT - Onglet 2"""
    try:
        result = calculate_hmt_enhanced(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/calculate-performance", response_model=PerformanceAnalysisResult)
async def calculate_performance_endpoint(input_data: PerformanceAnalysisInput):
    """Analyse de performance - Onglet 3"""
    try:
        result = calculate_performance_analysis(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Legacy endpoint for backward compatibility
@api_router.post("/calculate")
async def calculate_pump_performance(input_data: CalculationInput):
    """Calcul de performance de pompe (compatibilité ancienne version)"""
    try:
        result = perform_hydraulic_calculation(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/save-calculation", response_model=PumpHistory)
async def save_calculation(input_data: PumpHistoryCreate, current_user: dict = Depends(get_current_user)):
    """Save calculation to history (per-user)"""
    history_obj = PumpHistory(user_id=current_user["id"], **input_data.dict())
    await db.pump_history.insert_one(history_obj.dict())
    return history_obj

@api_router.get("/history", response_model=List[PumpHistory])
async def get_calculation_history(current_user: dict = Depends(get_current_user)):
    """Get calculation history for the current user only"""
    history = await db.pump_history.find({"user_id": current_user["id"]}).sort("timestamp", -1).to_list(100)
    return [PumpHistory(**item) for item in history]

@api_router.delete("/history/{history_id}")
async def delete_calculation(history_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a calculation from history — only if it belongs to the current user"""
    result = await db.pump_history.delete_one({"id": history_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Calcul introuvable")
    return {"message": "Calcul supprimé"}

# ============================================================================
# EXPERT SOLAIRE - DIMENSIONNEMENT POMPAGE SOLAIRE
# ============================================================================

# Base de données d'irradiation solaire par région (kWh/m²/jour)
SOLAR_IRRADIATION_DATABASE = {
    "france": {
        "nord": {"name": "Nord de la France", "irradiation_annual": 3.2, "peak_month": 5.8, "min_month": 1.1},
        "centre": {"name": "Centre de la France", "irradiation_annual": 3.8, "peak_month": 6.5, "min_month": 1.4},
        "sud": {"name": "Sud de la France", "irradiation_annual": 4.6, "peak_month": 7.2, "min_month": 2.1},
        "corse": {"name": "Corse", "irradiation_annual": 4.9, "peak_month": 7.5, "min_month": 2.4}
    },
    "afrique": {
        "maroc_nord": {"name": "Maroc Nord", "irradiation_annual": 5.2, "peak_month": 8.1, "min_month": 2.8},
        "maroc_sud": {"name": "Maroc Sud", "irradiation_annual": 6.8, "peak_month": 9.2, "min_month": 4.1},
        "algerie": {"name": "Algérie", "irradiation_annual": 5.8, "peak_month": 8.5, "min_month": 3.2},
        "tunisie": {"name": "Tunisie", "irradiation_annual": 5.4, "peak_month": 8.0, "min_month": 2.9},
        "senegal": {"name": "Sénégal", "irradiation_annual": 6.2, "peak_month": 7.8, "min_month": 4.8},
        "burkina": {"name": "Burkina Faso", "irradiation_annual": 6.5, "peak_month": 7.2, "min_month": 5.1},
        "mali": {"name": "Mali", "irradiation_annual": 6.8, "peak_month": 7.5, "min_month": 5.4},
        "niger": {"name": "Niger", "irradiation_annual": 7.1, "peak_month": 7.8, "min_month": 5.8},
        "tchad": {"name": "Tchad", "irradiation_annual": 6.9, "peak_month": 7.4, "min_month": 5.2},
        "cote_ivoire": {"name": "Côte d'Ivoire", "irradiation_annual": 5.1, "peak_month": 6.8, "min_month": 3.9},
        "egypte": {"name": "Égypte", "irradiation_annual": 6.4, "peak_month": 8.9, "min_month": 3.8}
    },
    "moyen_orient": {
        "arabie": {"name": "Arabie Saoudite", "irradiation_annual": 6.2, "peak_month": 8.7, "min_month": 3.9},
        "emirats": {"name": "Émirats Arabes Unis", "irradiation_annual": 5.9, "peak_month": 8.2, "min_month": 3.6},
        "jordanie": {"name": "Jordanie", "irradiation_annual": 5.8, "peak_month": 8.5, "min_month": 3.1}
    },
    "asie": {
        "inde_nord": {"name": "Inde Nord", "irradiation_annual": 5.1, "peak_month": 7.8, "min_month": 2.9},
        "inde_sud": {"name": "Inde Sud", "irradiation_annual": 5.8, "peak_month": 6.9, "min_month": 4.2},
        "chine": {"name": "Chine", "irradiation_annual": 4.2, "peak_month": 6.8, "min_month": 1.8},
        "vietnam": {"name": "Vietnam", "irradiation_annual": 4.6, "peak_month": 6.1, "min_month": 2.8}
    }
}

# Base de données des pompes solaires
SOLAR_PUMP_DATABASE = {
    "grundfos_sqflex": {
        "name": "Grundfos SQFlex 2.5-2",
        "power_range": [180, 400],  # Watts
        "flow_range": [1, 8],  # m³/h
        "head_range": [10, 120],  # mètres
        "efficiency": 0.45,
        "voltage": [24, 48],  # DC volts
        "price_eur": 1250,
        "type": "submersible"
    },
    "grundfos_sqflex_high": {
        "name": "Grundfos SQFlex 5-7",
        "power_range": [500, 1200],  # Watts
        "flow_range": [2, 15],  # m³/h
        "head_range": [20, 180],  # mètres
        "efficiency": 0.52,
        "voltage": [48, 96],  # DC volts
        "price_eur": 2150,
        "type": "submersible"
    },
    "lorentz_ps": {
        "name": "Lorentz PS2-600",
        "power_range": [150, 600],  # Watts
        "flow_range": [0.5, 12],  # m³/h
        "head_range": [5, 140],  # mètres
        "efficiency": 0.48,
        "voltage": [24, 48],  # DC volts
        "price_eur": 980,
        "type": "submersible"
    },
    "surface_solar": {
        "name": "Pompe Surface Solaire 1kW",
        "power_range": [300, 1000],  # Watts
        "flow_range": [5, 25],  # m³/h
        "head_range": [15, 80],  # mètres
        "efficiency": 0.42,
        "voltage": [48, 96],  # DC volts
        "price_eur": 1450,
        "type": "surface"
    }
}

# Base de données des panneaux solaires
SOLAR_PANEL_DATABASE = {
    "polycristallin_270w": {
        "name": "Panneau Polycristallin 270W",
        "power_nominal": 270,  # Watts
        "voltage_nominal": 24,  # Volts
        "current_nominal": 11.25,  # Ampères
        "efficiency": 0.17,  # 17%
        "size": [1.65, 0.99],  # mètres [longueur, largeur]
        "price_eur": 175,
        "warranty": 20,  # années
        "temperature_coefficient": -0.43  # %/°C
    },
    "polycristallin_320w": {
        "name": "Panneau Polycristallin 320W",
        "power_nominal": 320,  # Watts
        "voltage_nominal": 24,  # Volts
        "current_nominal": 13.33,  # Ampères
        "efficiency": 0.18,  # 18%
        "size": [1.96, 0.99],  # mètres [longueur, largeur]
        "price_eur": 195,
        "warranty": 20,  # années
        "temperature_coefficient": -0.42  # %/°C
    },
    "monocristallin_400w": {
        "name": "Panneau Monocristallin 400W",
        "power_nominal": 400,  # Watts
        "voltage_nominal": 24,  # Volts
        "current_nominal": 16.67,  # Ampères
        "efficiency": 0.21,  # 21%
        "size": [2.0, 1.0],  # mètres [longueur, largeur]
        "price_eur": 280,
        "warranty": 25,  # années
        "temperature_coefficient": -0.38  # %/°C
    },
    "monocristallin_550w": {
        "name": "Panneau Monocristallin 550W",
        "power_nominal": 550,  # Watts
        "voltage_nominal": 48,  # Volts
        "current_nominal": 11.46,  # Ampères
        "efficiency": 0.22,  # 22%
        "size": [2.3, 1.1],  # mètres [longueur, largeur]
        "price_eur": 380,
        "warranty": 25,  # années
        "temperature_coefficient": -0.35  # %/°C
    }
}

# Base de données des batteries solaires
SOLAR_BATTERY_DATABASE = {
    "lithium_100ah": {
        "name": "Batterie Lithium LiFePO4 100Ah",
        "capacity": 100,  # Ah
        "voltage": 12,  # Volts
        "energy": 1.2,  # kWh
        "efficiency": 0.95,  # 95%
        "cycles": 6000,
        "price_eur": 450,
        "weight": 13,  # kg
        "discharge_depth": 0.95  # 95% DOD
    },
    "lithium_200ah": {
        "name": "Batterie Lithium LiFePO4 200Ah",
        "capacity": 200,  # Ah
        "voltage": 12,  # Volts
        "energy": 2.4,  # kWh
        "efficiency": 0.96,  # 96%
        "cycles": 6000,
        "price_eur": 850,
        "weight": 24,  # kg
        "discharge_depth": 0.95  # 95% DOD
    },
    "gel_150ah": {
        "name": "Batterie Gel 150Ah",
        "capacity": 150,  # Ah
        "voltage": 12,  # Volts
        "energy": 1.8,  # kWh
        "efficiency": 0.85,  # 85%
        "cycles": 1500,
        "price_eur": 320,
        "weight": 45,  # kg
        "discharge_depth": 0.50  # 50% DOD pour longévité
    }
}

# Base de données des régulateurs MPPT
MPPT_CONTROLLER_DATABASE = {
    "victron_75_15": {
        "name": "Victron MPPT 75/15",
        "max_pv_voltage": 75,  # Volts
        "max_current": 15,  # Ampères
        "max_power": 220,  # Watts (12V)
        "efficiency": 0.98,  # 98%
        "price_eur": 95,
        "bluetooth": True
    },
    "victron_100_30": {
        "name": "Victron MPPT 100/30",
        "max_pv_voltage": 100,  # Volts
        "max_current": 30,  # Ampères
        "max_power": 440,  # Watts (12V)
        "efficiency": 0.98,  # 98%
        "price_eur": 180,
        "bluetooth": True
    },
    "victron_150_45": {
        "name": "Victron MPPT 150/45",
        "max_pv_voltage": 150,  # Volts
        "max_current": 45,  # Ampères
        "max_power": 650,  # Watts (12V)
        "efficiency": 0.98,  # 98%
        "price_eur": 285,
        "bluetooth": True
    }
}

# Modèles Pydantic pour le dimensionnement solaire
class SolarPumpingInput(BaseModel):
    # Informations du projet
    project_name: str = "Système de Pompage Solaire"
    location_region: str = "france"
    location_subregion: str = "centre"
    
    # Besoins en eau et hydrauliques
    daily_water_need: float  # m³/jour
    operating_hours: float = 8.0  # heures de fonctionnement par jour
    flow_rate: float = 1.25  # m³/h - calculé automatiquement (volume/heures)
    seasonal_variation: float = 1.2  # coefficient saisonnier (1.0 = constant, 1.5 = +50% en été)
    peak_months: List[int] = [6, 7, 8]  # mois de pic (juin, juillet, août)
    
    # Paramètres hydrauliques pour calcul HMT restructuré
    dynamic_level: float = 15.0  # Niveau dynamique (profondeur pompage)
    tank_height: float = 5.0  # Hauteur du château d'eau
    static_head: float = 20.0  # Hauteur géométrique (calculée auto: niveau + château)
    dynamic_losses: float = 5.0  # Pertes de charge dynamiques
    useful_pressure_head: float = 0.0  # Pression utile convertie en hauteur
    total_head: float  # HMT totale (calculée automatiquement dans le frontend)
    pipe_diameter: float = 100  # mm
    pipe_length: float = 50  # mètres
    
    # Paramètres solaires
    panel_peak_power: float = 400  # Wc - nouveau champ puissance crête panneau
    
    # Contraintes du système
    autonomy_days: int = 2  # jours d'autonomie souhaités
    system_voltage: int = 24  # Volts DC (12, 24, 48 ou 96)
    installation_type: str = "submersible"  # ou "surface"
    
    # Paramètres économiques
    electricity_cost: float = 0.15  # €/kWh (coût électricité locale)
    project_lifetime: int = 25  # années
    maintenance_cost_annual: float = 0.02  # % du coût initial par an
    
    # Contraintes d'installation
    available_surface: Optional[float] = None  # m² disponibles pour panneaux
    max_budget: Optional[float] = None  # € budget maximum
    grid_connection_available: bool = False  # connexion réseau disponible
    
    # Paramètres environnementaux
    ambient_temperature_avg: float = 25  # °C température ambiante moyenne
    dust_factor: float = 0.95  # facteur de réduction dû à la poussière (0.9-1.0)
    shading_factor: float = 1.0  # facteur d'ombrage (0.8-1.0)

class SolarSystemDimensioning(BaseModel):
    # Dimensionnement automatique des composants
    recommended_pump: Dict[str, Any]
    solar_panels: Dict[str, Any]
    batteries: Dict[str, Any]
    mppt_controller: Dict[str, Any]
    
    # Calculs de performance
    energy_production: Dict[str, float]  # kWh/jour par mois
    energy_consumption: Dict[str, float]  # kWh/jour requis
    system_sizing: Dict[str, Any]
    
    # Analyse économique
    economic_analysis: Dict[str, float]
    
    # Recommandations
    technical_recommendations: List[str]
    optimization_suggestions: List[str]
    
class SolarPumpingResult(BaseModel):
    input_data: SolarPumpingInput
    dimensioning: SolarSystemDimensioning
    
    # Calculs détaillés
    solar_irradiation: Dict[str, Any]  # Changé de float vers Any pour accepter les dicts
    system_efficiency: float
    pump_operating_hours: Dict[str, float]  # heures/jour par mois
    
    # Graphiques et courbes
    monthly_performance: Dict[str, List[float]]
    system_curves: Dict[str, Any]
    
    # Alertes et warnings
    warnings: List[str]
    critical_alerts: List[str]

def calculate_solar_pumping_system(input_data: SolarPumpingInput) -> SolarPumpingResult:
    """
    Calcul complet du dimensionnement d'un système de pompage solaire
    """
    warnings = []
    critical_alerts = []
    
    # 1. Récupération des données d'irradiation solaire
    try:
        region_data = SOLAR_IRRADIATION_DATABASE[input_data.location_region]
        location_data = region_data[input_data.location_subregion]
        irradiation_annual = location_data["irradiation_annual"]
        irradiation_peak = location_data["peak_month"]
        irradiation_min = location_data["min_month"]
    except KeyError:
        warnings.append("Région non trouvée, utilisation des valeurs par défaut")
        irradiation_annual = 4.0
        irradiation_peak = 6.5
        irradiation_min = 2.0
    
    # 2. Calcul des besoins énergétiques hydrauliques
    # Puissance hydraulique = (Q × H × ρ × g) / 3600  [Watts]
    # Q en m³/h, H en mètres
    daily_flow = input_data.daily_water_need  # m³/jour
    peak_daily_flow = daily_flow * input_data.seasonal_variation
    
    # Estimation du débit horaire (fonctionnement sur heures de soleil utile)
    useful_sun_hours = irradiation_annual  # approximation
    hourly_flow_avg = daily_flow / useful_sun_hours  # m³/h
    hourly_flow_peak = peak_daily_flow / useful_sun_hours  # m³/h
    
    # Puissance hydraulique requise
    hydraulic_power_avg = (hourly_flow_avg * input_data.total_head * 1000 * 9.81) / 3600  # Watts
    hydraulic_power_peak = (hourly_flow_peak * input_data.total_head * 1000 * 9.81) / 3600  # Watts
    
    # 3. Sélection automatique de la pompe optimale
    suitable_pumps = []
    for pump_id, pump_data in SOLAR_PUMP_DATABASE.items():
        if (pump_data["type"] == input_data.installation_type and
            hydraulic_power_peak <= max(pump_data["power_range"]) and
            hourly_flow_peak <= max(pump_data["flow_range"]) and
            input_data.total_head <= max(pump_data["head_range"])):
            
            # Calculer l'efficacité du point de fonctionnement
            power_ratio = hydraulic_power_peak / max(pump_data["power_range"])
            efficiency_penalty = 1.0 if power_ratio > 0.5 else (0.8 + 0.2 * power_ratio / 0.5)
            
            suitable_pumps.append({
                "id": pump_id,
                "data": pump_data,
                "required_power": hydraulic_power_peak / (pump_data["efficiency"] * efficiency_penalty),
                "efficiency_score": pump_data["efficiency"] * efficiency_penalty,
                "cost_score": pump_data["price_eur"] / max(pump_data["power_range"])
            })
    
    if not suitable_pumps:
        critical_alerts.append("Aucune pompe compatible trouvée pour ces spécifications")
        # Sélection de la pompe la plus puissante par défaut
        selected_pump_id = "grundfos_sqflex_high"
        selected_pump = SOLAR_PUMP_DATABASE[selected_pump_id]
        required_electrical_power = 1200  # Watts par défaut
    else:
        # Sélection de la pompe avec le meilleur compromis efficacité/coût
        best_pump = min(suitable_pumps, key=lambda x: x["required_power"] * x["cost_score"])
        selected_pump_id = best_pump["id"]
        selected_pump = best_pump["data"]
        required_electrical_power = best_pump["required_power"]
    
    # 4. Dimensionnement des panneaux solaires
    # Facteur de dégradation et pertes système
    system_losses = 0.85  # 15% pertes (câblage, MPPT, température, vieillissement)
    environmental_factor = input_data.dust_factor * input_data.shading_factor
    
    # Puissance crête nécessaire
    peak_power_needed = required_electrical_power / (system_losses * environmental_factor)
    
    # Sélection des panneaux optimaux
    selected_panels = {}
    for panel_id, panel_data in SOLAR_PANEL_DATABASE.items():
        if input_data.system_voltage in [12, 24] and panel_data["voltage_nominal"] <= input_data.system_voltage * 2:
            nb_panels = math.ceil(peak_power_needed / panel_data["power_nominal"])
            total_power = nb_panels * panel_data["power_nominal"]
            total_cost = nb_panels * panel_data["price_eur"]
            surface_required = nb_panels * (panel_data["size"][0] * panel_data["size"][1])
            
            selected_panels[panel_id] = {
                "panel_data": panel_data,
                "quantity": nb_panels,
                "total_power": total_power,
                "total_cost": total_cost,
                "surface_required": surface_required,
                "power_ratio": total_power / peak_power_needed
            }
    
    # Sélection du meilleur compromis
    if selected_panels:
        best_panels_id = min(selected_panels.keys(), 
                           key=lambda x: selected_panels[x]["total_cost"] / selected_panels[x]["total_power"])
        recommended_panels = selected_panels[best_panels_id]
    else:
        warnings.append("Configuration de panneaux par défaut utilisée")
        recommended_panels = {
            "panel_data": SOLAR_PANEL_DATABASE["monocristallin_400w"],
            "quantity": math.ceil(peak_power_needed / 400),
            "total_power": math.ceil(peak_power_needed / 400) * 400,
            "total_cost": math.ceil(peak_power_needed / 400) * 280,
            "surface_required": math.ceil(peak_power_needed / 400) * 2.0,
            "power_ratio": (math.ceil(peak_power_needed / 400) * 400) / peak_power_needed
        }
    
    # 5. Dimensionnement des batteries
    # Énergie requise pour l'autonomie
    daily_energy_need = required_electrical_power * useful_sun_hours / 1000  # kWh/jour
    autonomy_energy = daily_energy_need * input_data.autonomy_days  # kWh
    
    # Sélection des batteries
    selected_batteries = {}
    for battery_id, battery_data in SOLAR_BATTERY_DATABASE.items():
        if battery_data["voltage"] == 12:  # Standardisation sur 12V
            usable_energy = battery_data["energy"] * battery_data["discharge_depth"]
            nb_batteries = math.ceil(autonomy_energy / usable_energy)
            
            # Configuration série/parallèle pour atteindre la tension système
            voltage_multiplier = input_data.system_voltage // battery_data["voltage"]
            nb_series = voltage_multiplier
            nb_parallel = math.ceil(nb_batteries / nb_series)
            total_batteries = nb_series * nb_parallel
            
            selected_batteries[battery_id] = {
                "battery_data": battery_data,
                "series": nb_series,
                "parallel": nb_parallel,
                "total_quantity": total_batteries,
                "total_capacity": total_batteries * battery_data["capacity"],
                "total_energy": total_batteries * battery_data["energy"],
                "usable_energy": total_batteries * usable_energy,
                "total_cost": total_batteries * battery_data["price_eur"]
            }
    
    # Sélection des meilleures batteries (compromis coût/performance)
    if selected_batteries:
        best_battery_id = min(selected_batteries.keys(),
                            key=lambda x: selected_batteries[x]["total_cost"] / selected_batteries[x]["usable_energy"])
        recommended_batteries = selected_batteries[best_battery_id]
    else:
        warnings.append("Configuration de batteries par défaut utilisée")
        recommended_batteries = {
            "battery_data": SOLAR_BATTERY_DATABASE["lithium_100ah"],
            "series": input_data.system_voltage // 12,
            "parallel": 2,
            "total_quantity": 4,
            "total_capacity": 400,
            "total_energy": 4.8,
            "usable_energy": 4.56,
            "total_cost": 1800
        }
    
    # 6. Sélection du régulateur MPPT
    max_pv_current = recommended_panels["quantity"] * recommended_panels["panel_data"]["current_nominal"]
    max_pv_voltage = recommended_panels["panel_data"]["voltage_nominal"] * 1.25  # facteur de sécurité
    
    suitable_mppt = []
    for mppt_id, mppt_data in MPPT_CONTROLLER_DATABASE.items():
        if (mppt_data["max_current"] >= max_pv_current * 1.25 and
            mppt_data["max_pv_voltage"] >= max_pv_voltage):
            suitable_mppt.append({
                "id": mppt_id,
                "data": mppt_data,
                "cost_efficiency": mppt_data["price_eur"] / mppt_data["max_power"]
            })
    
    if suitable_mppt:
        best_mppt = min(suitable_mppt, key=lambda x: x["cost_efficiency"])
        recommended_mppt = {
            "mppt_data": best_mppt["data"],
            "quantity": 1,
            "total_cost": best_mppt["data"]["price_eur"]
        }
    else:
        warnings.append("Régulateur MPPT par défaut utilisé")
        recommended_mppt = {
            "mppt_data": MPPT_CONTROLLER_DATABASE["victron_100_30"],
            "quantity": 1,
            "total_cost": 180
        }
    
    # 7. Calculs de performance mensuelle
    monthly_irradiation = []
    for month in range(12):
        if month + 1 in input_data.peak_months:
            irradiation = irradiation_peak - (irradiation_peak - irradiation_annual) * 0.3
        elif month + 1 in [11, 12, 1, 2]:  # mois d'hiver
            irradiation = irradiation_min + (irradiation_annual - irradiation_min) * 0.5
        else:
            irradiation = irradiation_annual
        monthly_irradiation.append(irradiation)
    
    # Production énergétique mensuelle
    energy_production = {}
    energy_consumption = {}
    pump_hours = {}
    
    for month, irradiation in enumerate(monthly_irradiation):
        monthly_production = (recommended_panels["total_power"] * irradiation * 
                            system_losses * environmental_factor) / 1000  # kWh/jour
        
        # Besoins saisonniers
        if month + 1 in input_data.peak_months:
            monthly_need = peak_daily_flow
        else:
            monthly_need = daily_flow
        
        # Heures de fonctionnement de la pompe
        available_energy = monthly_production
        pump_power_kw = required_electrical_power / 1000
        max_pump_hours = available_energy / pump_power_kw if pump_power_kw > 0 else 0
        
        # Limitation par les besoins en eau
        required_pump_hours = (monthly_need * input_data.total_head * 1000 * 9.81) / (
            selected_pump["efficiency"] * required_electrical_power * 3600)
        
        actual_pump_hours = min(max_pump_hours, required_pump_hours, irradiation)
        
        energy_production[f"month_{month+1}"] = monthly_production
        energy_consumption[f"month_{month+1}"] = actual_pump_hours * pump_power_kw
        pump_hours[f"month_{month+1}"] = actual_pump_hours
    
    # 8. Analyse économique
    total_system_cost = (recommended_panels["total_cost"] + 
                        recommended_batteries["total_cost"] + 
                        recommended_mppt["total_cost"] + 
                        selected_pump["price_eur"] + 
                        1500)  # Installation et accessoires
    
    # Économies annuelles (vs pompe électrique)
    annual_water_production = sum([pump_hours[f"month_{month}"] * 
                                  (hourly_flow_avg if month not in input_data.peak_months 
                                   else hourly_flow_avg * input_data.seasonal_variation) * 30.44 
                                  for month in range(1, 13)])
    
    equivalent_electrical_consumption = annual_water_production * input_data.total_head * 1000 * 9.81 / (
        0.70 * 3600 * 1000)  # kWh/an avec rendement pompe électrique 70%
    
    annual_savings = equivalent_electrical_consumption * input_data.electricity_cost
    
    # Analyse de rentabilité
    payback_period = total_system_cost / annual_savings if annual_savings > 0 else float('inf')
    
    # Maintenance annuelle
    annual_maintenance = total_system_cost * input_data.maintenance_cost_annual
    net_annual_savings = annual_savings - annual_maintenance
    
    economic_analysis = {
        "total_system_cost": total_system_cost,
        "annual_savings": annual_savings,
        "annual_maintenance": annual_maintenance,
        "net_annual_savings": net_annual_savings,
        "payback_period": payback_period,
        "project_lifetime": input_data.project_lifetime,
        "total_lifetime_savings": net_annual_savings * input_data.project_lifetime,
        "roi_percentage": (net_annual_savings * input_data.project_lifetime / total_system_cost) * 100
    }
    
    # 9. Recommandations techniques
    technical_recommendations = []
    optimization_suggestions = []
    
    if payback_period > 10:
        optimization_suggestions.append(f"Période de retour élevée ({payback_period:.1f} ans) - Considérer l'optimisation du système")
    
    if recommended_panels["surface_required"] > 100:
        technical_recommendations.append(f"Surface importante requise ({recommended_panels['surface_required']:.1f} m²)")
    
    if input_data.autonomy_days > 3:
        technical_recommendations.append("Autonomie élevée - Système de stockage important requis")
    
    if irradiation_annual < 3.5:
        warnings.append("Irradiation faible pour cette région - Performance réduite")
    
    # Vérifications critiques
    if required_electrical_power > recommended_panels["total_power"] * 0.8:
        critical_alerts.append("Puissance des panneaux juste suffisante - Prévoir une marge de sécurité")
    
    if autonomy_energy > recommended_batteries["usable_energy"] * 0.9:
        critical_alerts.append("Capacité de stockage limite atteinte")
    
    # 10. Compilation des résultats
    dimensioning = SolarSystemDimensioning(
        recommended_pump={
            "model": selected_pump["name"],
            "power": required_electrical_power,
            "efficiency": selected_pump["efficiency"],
            "type": selected_pump["type"],
            "cost": selected_pump["price_eur"],
            "specifications": selected_pump
        },
        solar_panels={
            "model": recommended_panels["panel_data"]["name"],
            "quantity": recommended_panels["quantity"],
            "total_power": recommended_panels["total_power"],
            "surface_required": recommended_panels["surface_required"],
            "cost": recommended_panels["total_cost"],
            "specifications": recommended_panels
        },
        batteries={
            "model": recommended_batteries["battery_data"]["name"],
            "configuration": f"{recommended_batteries['series']}S{recommended_batteries['parallel']}P",
            "total_quantity": recommended_batteries["total_quantity"],
            "total_capacity": recommended_batteries["total_capacity"],
            "usable_energy": recommended_batteries["usable_energy"],
            "cost": recommended_batteries["total_cost"],
            "specifications": recommended_batteries
        },
        mppt_controller={
            "model": recommended_mppt["mppt_data"]["name"],
            "quantity": recommended_mppt["quantity"],
            "cost": recommended_mppt["total_cost"],
            "specifications": recommended_mppt
        },
        energy_production=energy_production,
        energy_consumption=energy_consumption,
        system_sizing={
            "total_power": recommended_panels["total_power"],
            "system_efficiency": system_losses * environmental_factor,
            "autonomy_days": input_data.autonomy_days,
            "daily_water_capacity": daily_flow,
            "peak_water_capacity": peak_daily_flow
        },
        economic_analysis=economic_analysis,
        technical_recommendations=technical_recommendations,
        optimization_suggestions=optimization_suggestions
    )
    
    # Courbes de performance pour graphiques
    monthly_performance = {
        "months": list(range(1, 13)),
        "irradiation": monthly_irradiation,
        "production": [energy_production[f"month_{m}"] for m in range(1, 13)],
        "consumption": [energy_consumption[f"month_{m}"] for m in range(1, 13)],
        "pump_hours": [pump_hours[f"month_{m}"] for m in range(1, 13)],
        "water_production": [pump_hours[f"month_{m}"] * hourly_flow_avg * 
                           (input_data.seasonal_variation if m in input_data.peak_months else 1.0) 
                           for m in range(1, 13)]
    }
    
    system_curves = {
        "power_curve": {
            "irradiation_points": [i for i in range(1, 11)],
            "power_output": [i * recommended_panels["total_power"] * system_losses / 10 for i in range(1, 11)]
        },
        "pump_curve": {
            "flow_points": [i * hourly_flow_peak / 10 for i in range(1, 11)],
            "head_points": [input_data.total_head + (i * input_data.total_head * 0.1) for i in range(1, 11)]
        }
    }
    
    return SolarPumpingResult(
        input_data=input_data,
        dimensioning=dimensioning,
        solar_irradiation={
            "annual": irradiation_annual,
            "peak_month": irradiation_peak,
            "min_month": irradiation_min,
            "monthly": {f"month_{i+1}": monthly_irradiation[i] for i in range(12)}
        },
        system_efficiency=system_losses * environmental_factor,
        pump_operating_hours=pump_hours,
        monthly_performance=monthly_performance,
        system_curves=system_curves,
        warnings=warnings,
        critical_alerts=critical_alerts
    )

@api_router.post("/solar-pumping", response_model=SolarPumpingResult)
async def calculate_solar_pumping(input_data: SolarPumpingInput):
    """
    Dimensionnement complet d'un système de pompage solaire avec calculs automatisés
    """
    try:
        result = calculate_solar_pumping_system(input_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur dans le dimensionnement solaire: {str(e)}")

@api_router.get("/solar-regions")
async def get_solar_regions():
    """Obtenir les régions disponibles pour l'irradiation solaire"""
    regions = []
    for region_key, region_data in SOLAR_IRRADIATION_DATABASE.items():
        for subregion_key, subregion_data in region_data.items():
            regions.append({
                "region": region_key,
                "subregion": subregion_key,
                "name": subregion_data["name"],
                "irradiation_annual": subregion_data["irradiation_annual"]
            })
    return {"regions": regions}

@api_router.get("/solar-equipment")
async def get_solar_equipment():
    """Obtenir la liste des équipements solaires disponibles"""
    return {
        "pumps": SOLAR_PUMP_DATABASE,
        "panels": SOLAR_PANEL_DATABASE,
        "batteries": SOLAR_BATTERY_DATABASE,
        "mppt_controllers": MPPT_CONTROLLER_DATABASE
    }

# Include the router in the main app
app.include_router(api_router)

# CORS : l'authentification se fait par jeton Bearer (pas de cookies), donc
# allow_credentials n'est pas nécessaire. Origines restreintes via env var
# CORS_ORIGINS (liste séparée par des virgules), avec un repli raisonnable.
_cors_origins_env = os.environ.get("CORS_ORIGINS", "")
_allowed_origins = [o.strip() for o in _cors_origins_env.split(",") if o.strip()] or [
    "http://localhost:3000",
    "https://eco-expert-v1.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=_allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()