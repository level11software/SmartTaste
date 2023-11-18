from sqlalchemy import Table, Column, Integer, ForeignKey
from db.models.base import Base

# Association table for Recipe-Tag relationship
recipe_tag_association = Table('recipe_tag', Base.metadata,
                               Column('recipe_id', Integer, ForeignKey('recipes.id')),
                               Column('tag_id', Integer, ForeignKey('tags.id'))
                               )
