from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from db.models.base import Base
from db.models.recipe_ingredient_association import recipe_ingredient_association


class Ingredient(Base):
    __tablename__ = "ingredients"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    name = Column(String)  # name of the ingredient
    image_link = Column(String)  # link to an image of the ingredient

# # Many-to-many relationship with Recipe
    recipes = relationship("Recipe",
                           secondary=recipe_ingredient_association,
                           back_populates="ingredients")
