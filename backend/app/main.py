# IMPORTS
import datetime
import random
import json

import databases
import requests

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi import Request, Response
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
from db.models.interaction import Interaction, InteractionTypeEnum
from db.models.ingredient import Ingredient
from db.models.recipe import Recipe
from db.models.tag import Tag
from db.models.user import User

from app.recommendation import hybrid_recommendation, sqlToPandas

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

    json_data = get_recommended_recipes(user).to_json(orient='records', indent=4)

    return Response(content=json_data, media_type="application/json")


# def internal function that return the recipes most recommended for the user
@app.post("/get_new_recommendation")
async def get_new_recommendation(token: str = Depends(get_current_token)):
    """
    The homepage endpoint, only accessible with a valid token
    :param token: the token of the user
    :return:  a message
    """

    user = await get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    json_data = get_recommended_recipes(user, 1, [0, 1, 2]).to_json(orient='records', indent=4)

    return Response(content=json_data, media_type="application/json")


# def internal function that return the recipes most recommended for the user
def get_recommended_recipes(user: User, N_recipes=NUMBER_OF_MEALS, exclude_ids=[]):
    """
    Get the four recipes most recommended for the user
    :param user: the user object
    :return: a list of four recipes
    """

    # TODO REAL CODE

    with Session(engine) as session:
        recipes = session.query(Recipe).all()
        df_recipes = sqlToPandas(recipes)
        interactions = session.query(Interaction).all()
        df_interactions = sqlToPandas(interactions)

    # for each row in df_interaction, add a new column rating with value depending on eventType ( if discarded, 0 otherwise)

    df_interactions['rating'] = df_interactions.apply(
        lambda row:
        0 if row['eventType'] == InteractionTypeEnum.DISCARDED_RECIPE else
        3 if row['eventType'] == InteractionTypeEnum.OPENED_RECIPE else
        4 if row['eventType'] == InteractionTypeEnum.SAVED_RECIPE else
        5 if row['eventType'] == InteractionTypeEnum.BOUGHT_RECIPE else
        None,  # This can be adjusted if there are other event types or to handle unexpected values
        axis=1
    )

    top_recipes = hybrid_recommendation(user.id, df_recipes, df_interactions, {'collab': 1, 'content': 1, 'type': 1},
                                        top_N=N_recipes)

    return top_recipes


@app.post("/send_interaction")
async def send_interaction(request: Request, token: str = Depends(get_current_token)):
    """
    Send an interaction to the database
    :param token: the token of the user
    :return: a message
    """
    data = await request.json()

    user = await get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not data or data['recipe_id'] is None or data['event_type'] is None:
        raise HTTPException(status_code=404, detail="Data not found")

    # retrieve recipe from db
    with Session(engine) as session:
        recipe = session.query(Recipe).filter(Recipe.id == data['recipe_id']).first()
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")

    with Session(engine) as session:
        interaction = session.query(Interaction).filter(Interaction.userID == user.id,
                                                        Interaction.recipeID == recipe.id).first()
        if interaction is not None:
            interaction.eventType = data['event_type']
            interaction.time = str(datetime.datetime.now())
            session.commit()
        else:
            add_interaction_to_db(recipe, user, data['event_type'])

    return "Interaction stored"


def add_interaction_to_db(recipe, user, event_type):
    """
    Add an interaction to the database
    :param recipe: the id of the recipe
    :param user: the id of the user
    :param event_type: the type of the event
    :return: a message
    """

    new_interaction = Interaction(time=str(datetime.datetime.now()), eventType=event_type, recipeID=recipe.id,
                                  userID=user.id)

    with Session(engine) as session:
        session.add(new_interaction)
        session.commit()

    return


# new endpoint post /set_diet to set preference of user
@app.post("/set_diet")
async def set_diet(request: Request, token: str = Depends(get_current_token)):
    """
    Set the diet of the user
    :param diet: the diet of the user
    :param token: the token of the user
    :return: a message
    """

    data = await request.json()

    user = await get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not data or data['selected_diet'] is None:
        raise HTTPException(status_code=404, detail="Data not found")

    with Session(engine) as session:
        updated_user = session.query(User).filter_by(id=user.id).first()
        updated_user.diet = data['selected_diet']
        session.commit()

    return "Diet set"


@app.post("/set_allergens")
async def set_allergens(request: Request, token: str = Depends(get_current_token)):
    """
    Set the diet of the user
    :param diet: the diet of the user
    :param token: the token of the user
    :return: a message
    """

    data = await request.json()

    user = await get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    with Session(engine) as session:
        updated_user = session.query(User).filter_by(id=user.id).first()
        updated_user.allergies = ', '.join(data)
        session.commit()

    return "Allergies set"