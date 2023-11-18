from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship

from db.models.base import Base


# Define an enumeration for the InteractionType
class InteractionTypeEnum(str, Enum):
    view = "view"
    like = "like"
    comment = "comment"
    save = "save"


class Interaction(Base):
    __tablename__ = "interactions"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    time = Column(String)  # timestamp or datetime for the interaction time
    # eventType = Column(Enum(InteractionTypeEnum), nullable=False)  # eventType as ENUM
    recipeID = Column(Integer, ForeignKey('recipes.id'))  # foreign key to recipeID
    userID = Column(Integer, ForeignKey('users.id'))  # foreign key to userID

    # Define a relationship to the Recipe table
    recipes = relationship("Recipe", back_populates="interactions")

    # Define a relationship to the User table
    users = relationship("User", back_populates="interactions")

# You can add more functionality and relationships as needed
