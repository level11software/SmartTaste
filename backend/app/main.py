# IMPORTS
import email
import uuid
from email.header import decode_header, make_header
from email.utils import parseaddr

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