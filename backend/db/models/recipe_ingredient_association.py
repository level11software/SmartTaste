from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from db.models.base import Base

recipe_ingredient_association = Table('recipe_ingredient', Base.metadata,
                                      Column('recipe_id', Integer, ForeignKey('recipes.id')),
                                      Column('ingredient_id', Integer, ForeignKey('ingredients.id'))
                                      )
