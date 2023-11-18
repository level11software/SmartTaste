from sqlalchemy import Column, Integer, String, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from db.models.base import Base
from db.models.ingredient import recipe_ingredient_association
from db.models.recipe_tag_association import recipe_tag_association


class Recipe(Base):
    __tablename__ = "recipes"  # the name of the table in the database
    id = Column(Integer, primary_key=True, index=True)  # the primary key of the table
    # uuid = Column(String)  # the uuid of the recipe
    name = Column(String)  # name of the recipe
    ingredients_list = Column(String)  # ingredients of the recipe
    preptime = Column(Integer)  # preparation time in minutes
    image_link = Column(String)  # link to an image of the recipe
    recipe_link = Column(String)  # link to the recipe
    headline = Column(String)  # Add headline (string)
    nutrition_energy = Column(Integer)  # Add nutrition_energy (int)
    nutrition_calories = Column(Integer)  # Add nutrition_calories (int)
    nutrition_carbo = Column(Float)  # Add nutrition_carbo (float)
    nutrition_protein = Column(Float)  # Add nutrition_protein (float)
    allergens = Column(String)  # Add allergens
    tags_list = Column(String)

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

    def to_dict(self):
        """Converts the Recipe object into a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'ingredients_list': self.ingredients_list,
            'preptime': self.preptime,
            'image_link': self.image_link,
            'recipe_link': self.recipe_link,
            'headline': self.headline,
            'nutrition': {
                'energy': self.nutrition_energy,
                'calories': self.nutrition_calories,
                'carbohydrate': self.nutrition_carbo,
                'protein': self.nutrition_protein
            },
            'allergens': self.allergens,
            'tags_list': self.tags_list,
            # You can also include relationships if needed, like:
            # 'interactions': [interaction.to_dict() for interaction in self.interactions],
            # 'ingredients': [ingredient.to_dict() for ingredient in self.ingredients],
            # 'tags': [tag.to_dict() for tag in self.tags],
        }
