from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.models.base import Base


class User(Base):
    __tablename__ = "users"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    client_secret = Column(String, unique=True)  # bearer token for the user, given by Level11 to test the API
    user_name = Column(String)
    user_uuid = Column(String, index=True, unique=True)

    # Define a relationship to the Interaction table
    interactions = relationship("Interaction", back_populates="users")
