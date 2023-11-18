import json
import random
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import csr_matrix
from collections import defaultdict
from typing import List, Dict, Any


def sqlToPandas(sqlalchemy_objects: List[Any]) -> Dict[str, List]:
    """
    Converts a list of SQLAlchemy objects to a single dictionary,
    where each key holds a list of values from all objects for that key.

    Args:
    sqlalchemy_objects (List[Any]): A list of SQLAlchemy objects.

    Returns:
    Dict[str, List]: A dictionary with keys corresponding to the SQLAlchemy object's attributes,
    and values are lists of these attributes from all objects in the list.
    """
    merged_dict = defaultdict(list)
    for obj in sqlalchemy_objects:
        obj_dict = obj.to_dict()
        for key, value in obj_dict.items():
            merged_dict[key].append(value)

    return pd.DataFrame(dict(merged_dict))


def collaborative_score(user_id, df_interactions, neutral_rating=0.3, neighbors=5):
    # Create user-item matrix
    user_item_matrix = df_interactions.pivot(index='userID', columns='recipeID', values='rating').fillna(neutral_rating)

    # Calculate similarity
    user_similarity = cosine_similarity(user_item_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

    # Get similar users' preferences
    similar_users = user_similarity_df[user_id].nlargest(neighbors+1).index[1:]  # Top 5 similar users
    similar_users_ratings = df_interactions[df_interactions['userID'].isin(similar_users)]
    collab_scores = similar_users_ratings.groupby('recipeID')['rating'].mean()
    
    return collab_scores


def content_based_score(user_id, df_interactions, df_recipes, rating_threshold=2):
    # User's liked recipes
    liked_recipes = df_interactions[(df_interactions['userID'] == user_id) & (df_interactions['rating']>rating_threshold)]['recipeID']

    # TF-IDF Vectorizer
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    df_recipes['combined_content'] = df_recipes['name'] + ' ' + df_recipes['ingredients_list']

    # Compute similarity for name+ingredients
    tfidf_matrix = tfidf_vectorizer.fit_transform(df_recipes['combined_content'])  # or other relevant content
    recipe_similarity = cosine_similarity(tfidf_matrix)
    recipe_similarity_df = pd.DataFrame(recipe_similarity, index=df_recipes['id'], columns=df_recipes['id'])
    content_scores = recipe_similarity_df[liked_recipes].mean(axis=1) # Score based on liked recipes (only liked recipes will be >0)

    # Compute similarity for type
    tfidf_matrix = tfidf_vectorizer.fit_transform(df_recipes['tags_list'])
    type_similarity = cosine_similarity(tfidf_matrix)
    type_similarity_df = pd.DataFrame(type_similarity, index=df_recipes['id'], columns=df_recipes['id'])
    type_scores = type_similarity_df[liked_recipes].mean(axis=1) # Score based on liked recipes (only liked recipes will be >0)

    # Drop combined_content column
    df_recipes.drop(columns=['combined_content'], inplace=True)

    return content_scores, type_scores

def hybrid_recommendation(user_id, df_recipes, df_interactions, weights, top_N=4):
    collab_scores = collaborative_score(user_id, df_interactions)
    content_scores, type_scores = content_based_score(user_id, df_interactions, df_recipes)

    # Normalize scores
    max_score = max(collab_scores.max(), content_scores.max(), type_scores.max())
    collab_scores /= max_score
    content_scores /= max_score
    type_scores /= max_score

    # Weighted sum of scores
    final_scores = (weights['collab'] * collab_scores +
                    weights['content'] * content_scores +
                    weights['type'] * type_scores).fillna(0)

    # Join final scores with df_recipes
    df_recipes_with_scores = df_recipes.set_index('id').join(final_scores.rename('final_score'))
    
    # Sort by final score and return top recipes
    sorted_recipes = df_recipes_with_scores.sort_values(by='final_score', ascending=False).head(top_N)
    #sorted_recipes.drop(columns=['final_score'], inplace=True)
    return sorted_recipes.reset_index()