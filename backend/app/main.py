# IMPORTS
import random
import json

import databases
import requests

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import Session
from sqlalchemy.sql import select

# CONFIG AND ENV VARIABLES
from app.env_config import (
    REL_DATABASE_URL,
    THIS_SERVER_URL,
    NUMBER_OF_MEALS,
)
# MODELS
from db.models.base import *
from db.models.interaction import Interaction
from db.models.ingredient import Ingredient
from db.models.recipe import Recipe
from db.models.tag import Tag
from db.models.user import User

rel_database = databases.Database(REL_DATABASE_URL)
metadata = MetaData()
# a declarative base is a class that keeps track of the tables that are mapped to it
# Base = declarative_base()

# Configuration check
if not THIS_SERVER_URL.endswith("/"):
    raise ValueError("One or both URLs do not end with '/'.")

# create a session maker object to connect to the database
engine = create_engine(REL_DATABASE_URL)
# create all the tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

# TODO DANGER SECURITY ALLOW ONLY RIGHT DOMAINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_user_by_token(token: str) -> User:
    """
    Get a user object by its token
    :param token: the token of the user, given by Level11
    :return: the user object if found, None otherwise
    """
    query = select(User).where(User.client_secret == token)
    user = await rel_database.fetch_one(query)
    return user


def get_current_token(authorization: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    """
    Get the token from the authorization header
    :param authorization: the authorization header
    :return: the token if valid, raise an exception otherwise
    """
    token = authorization.credentials
    user = get_user_by_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return token


@app.get("/")
async def root(token: str = Depends(get_current_token)):
    """
    The root endpoint, only accessible with a valid token
    :param token: the token of the user
    :return:  a message
    """
    return {"message": "Hello World"}


@app.get("/hello")
async def say_hello(token: str = Depends(get_current_token)):
    """
    A simple endpoint that says hello to the user, for token and identification testing
    :param name: the name of the user
    :param token: the token of the user
    :return: a message
    """

    # get the user object from the rel_database
    user = await get_user_by_token(token)
    if user:
        return {"message": f"Hello {user['user_name']}"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


# define homepage endpoint, restricted to GET with a valid token
@app.get("/homepage")
async def homepage(token: str = Depends(get_current_token)):
    """
    The homepage endpoint, only accessible with a valid token
    :param token: the token of the user
    :return:  a message
    """

    user = await get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    json_data = get_recommended_recipes(user)

    return JSONResponse(content=json_data, status_code=200)


# def internal function that return the recipes most recommended for the user
def get_recommended_recipes(user: User):
    """
    Get the four recipes most recommended for the user
    :param user: the user object
    :return: a list of four recipes
    """

    recipes = get_recipes_from_json()
    # TODO REAL CODE

    return recipes


# def function that read a json and return a list of recipes
def get_recipes_from_json():
    """
    Get a list of recipes from a json
    :param json: the json
    :return: a list of recipes
    """

    file_path = "recipes.json"
    try:
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            index = 0
            recipes = []
            while len(recipes) < NUMBER_OF_MEALS:
                if random.random() < 0.5:
                    recipes.append(data[index])
                index += 1
            return recipes
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as e:
        return f"Error decoding JSON: {str(e)}"
    except Exception as e:
        return f"An error occurred: {str(e)}"
