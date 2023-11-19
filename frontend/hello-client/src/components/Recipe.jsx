import React from "react";
import "./animation.css";
import { useState } from "react";

let defaultImage =
  "https://images2-milano.corriereobjects.it/methode_image/2017/02/19/Interni/Foto%20Interni%20-%20Trattate/piero-kTxG-U43290312445878V-1224x916@Corriere-Web-Milano-593x443.jpg";

/**
 * Recipe Component, renders a single recipe card with the recipe data
 * @param recipe - Recipe Object
 * @returns {Element} - Recipe Card
 * @constructor - Recipe
 */
const Recipe = ({ recipe, removal, saveAction, openDetail }) => {
  // Destructuring Props
  const {
    name,
    headline,
    preptime,
    image_link,
    recipe_link,
    tags_list,
    nutrition,
    allergens,
    ingredient_list,
    id,
  } = recipe;
  const [expanded, setExpanded] = useState(false);
  const [wasExpanded, setWasExpanded] = useState(false);

  return (
    <div className="base-100 rounded-lg shadow-lg p-4 flex flex-col h-min-60">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-bold text-base-content mb-3">{name}</h2>
        <button
          className="btn btn-sm btn-circle btn-outline"
          onClick={() => {
            removal(recipe.id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-row">
        <div className={"w-1/3"}>
          <img
            src={image_link || defaultImage}
            alt={name}
            className="rounded-lg shadow-lg "
          />
        </div>
        <div className="w-2/3 ml-3">
          <p className="text-base-content/80 mb-2 font-thin text-sm">
            {headline}
          </p>
        </div>
      </div>

      <div className={"flex items-end h-full mt-5"}>
        {/* tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags_list.split(", ").map((tag) => (
            <span
              key={tag}
              className="badge-primary text-white text-xs  mr-2 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-row-reverse gap-4">
        {/* details */}
        <button
          className="btn btn-primary btn-xs"
          onClick={() => {
            setExpanded(!expanded);

            if (!wasExpanded) {
              setWasExpanded(true);
              openDetail(id);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        <button
          className="btn btn-xs"
          onClick={() => {
            saveAction(recipe.id);
          }}
        >
          {/* save action */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            className="w-4 h-4"
          >
            <path d="M23.67,114.59c1.74,0.78,3.57,1.17,5.37,1.17c3.1,0,6.14-1.13,8.59-3.31l21.71-19.3c2.65-2.36,6.65-2.36,9.3,0l21.71,19.3 c3.88,3.45,9.23,4.27,13.96,2.14c4.73-2.13,7.67-6.67,7.67-11.86V24c0-7.17-5.83-13-13-13H29c-7.17,0-13,5.83-13,13v78.73 C16,107.92,18.94,112.47,23.67,114.59z M22,24c0-3.86,3.14-7,7-7h70c3.86,0,7,3.14,7,7v78.73c0,2.84-1.54,5.22-4.13,6.39 c-2.59,1.16-5.4,0.73-7.52-1.15l-21.71-19.3c-2.46-2.19-5.55-3.28-8.64-3.28s-6.17,1.09-8.64,3.28l-21.71,19.3 c-2.12,1.88-4.93,2.32-7.52,1.15c-2.59-1.16-4.13-3.55-4.13-6.39V24z" />
          </svg>
        </button>
      </div>
      <div className={expanded ? null : "hidden"}></div>
    </div>
  );
};

export default Recipe;
