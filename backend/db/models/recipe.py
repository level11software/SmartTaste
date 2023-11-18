from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from db.models.base import Base
from db.models.ingredient import recipe_ingredient_association
from db.models.recipe_tag_association import recipe_tag_association


class Recipe(Base):
    __tablename__ = "recipes"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    name = Column(String)  # name of the recipe
    preptime = Column(Integer)  # preparation time in minutes
    image_link = Column(String)  # link to an image of the recipe
    recipe_link = Column(String)  # link to the recipe

    # Define a relationship to the Interaction table
    interactions = relationship("Interaction", back_populates="recipes")

    # Many-to-many relationship with Ingredient
    ingredients = relationship("Ingredient",
                               secondary=recipe_ingredient_association,
                               back_populates="recipes")

    # Many-to-many relationship with Tag
    tags = relationship("Tag",
                        secondary=recipe_tag_association,
                        back_populates="recipes")

