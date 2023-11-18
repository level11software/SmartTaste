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
def get_recommended_recipes(user: User):
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
            0.0 if row['eventType'] == InteractionTypeEnum.DISCARDED_RECIPE else
            0.5 if row['eventType'] == InteractionTypeEnum.OPENED_RECIPE else
            0.7 if row['eventType'] == InteractionTypeEnum.SAVED_RECIPE else
            1.0 if row['eventType'] == InteractionTypeEnum.BOUGHT_RECIPE else
            None,  # This can be adjusted if there are other event types or to handle unexpected values
        axis=1
    )

    top_recipes = hybrid_recommendation(user.id, df_recipes, df_interactions, {'collab': 1, 'content': 1, 'type': 1}, top_N=NUMBER_OF_MEALS)

    return top_recipes

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


@app.get("/upload_recipes")
async def upload_recipes(token: str = Depends(get_current_token)):
    """
    Upload recipes to the database
    :param token: the token of the user
    :return: a message
    """
    # TODO REAL CODE
    recipes = get_recipes_from_json()
    return upload_recipes_to_db(recipes)


def upload_recipes_to_db(recipes):
    """
    Upload recipes to the database
    :param recipes: a list of recipes
    :return: a message
    """
    # TODO REAL CODE
    for element in recipes:
        recipe = element['recipe']
        print(recipe)

        with Session(engine) as session:
            new_recipe_object = Recipe(
                uuid=recipe['id'],
                name=recipe['name'],
                preptime=recipe['prepTime'],
                image_link=recipe['image'],
                recipe_link=recipe['websiteURL'],
                headline=recipe['headline'],
                nutrition_energy=recipe['nutrition']['energy'],
                nutrition_calories=recipe['nutrition']['calories'],
                nutrition_carbo=recipe['nutrition']['carbohydrate'],
                nutrition_protein=recipe['nutrition']['protein']
            )

            stored_tags = session.query(Tag).all()

            loaded_tags = recipe['tags']
            for loaded_tag in loaded_tags:
                found = False
                for stored_tag in stored_tags:
                    if loaded_tag['name'] == stored_tag.name:
                        found = True
                        break

                if not found:
                    new_tag_object = Tag(name=loaded_tag['name'])
                    session.add(new_tag_object)
                    session.commit()
                    stored_tags.append(new_tag_object)

            stored_tags = session.query(Tag).all()

            for loaded_tag in loaded_tags:
                for stored_tag in stored_tags:
                    if loaded_tag['name'] == stored_tag.name:
                        new_recipe_object.tags.append(stored_tag)
                        break

            session.add(new_recipe_object)
            session.commit()

    return "Recipes uploaded"


