from enum import Enum

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SQLEnum

from db.models.base import Base


# Define an enumeration for the InteractionType
class InteractionTypeEnum(Enum):
    OPENED_RECIPE = "opened_recipe"
    SAVED_RECIPE = "saved_recipe"
    BOUGHT_RECIPE = "bought_recipe"
    DISCARDED_RECIPE = "discarded_recipe"


class Interaction(Base):
    __tablename__ = "interactions"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    time = Column(String)  # timestamp or datetime for the interaction time
    eventType = Column(SQLEnum(InteractionTypeEnum))
    recipeID = Column(Integer, ForeignKey('recipes.id'))  # foreign key to recipeID
    userID = Column(Integer, ForeignKey('users.id'))  # foreign key to userID

    # Define a relationship to the Recipe table
    recipes = relationship("Recipe", back_populates="interactions")

    # Define a relationship to the User table
    users = relationship("User", back_populates="interactions")

    def to_dict(self):
        """Converts the Recipe object into a dictionary."""
        return {
            'id': self.id,
            'time': self.time,
            'eventType': self.eventType,
            'recipeID': self.recipeID,
            'userID': self.userID,
            # You can also include relationships if needed, like:
            # 'recipes': [recipe.to_dict() for recipe in self.recipes],
            # 'users': [user.to_dict() for user in self.users],
        }

# You can add more functionality and relationships as needed
