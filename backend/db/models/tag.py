from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from db.models.base import Base
from db.models.recipe_tag_association import recipe_tag_association


class Tag(Base):
    __tablename__ = "tags"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    name = Column(String)  # name of the tag

    # Many-to-many relationship with Recipe
    recipes = relationship("Recipe",
                           secondary=recipe_tag_association,
                           back_populates="tags")
