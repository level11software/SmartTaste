import React from "react";
import "./animation.css";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

let defaultImage =
  "https://images2-milano.corriereobjects.it/methode_image/2017/02/19/Interni/Foto%20Interni%20-%20Trattate/piero-kTxG-U43290312445878V-1224x916@Corriere-Web-Milano-593x443.jpg";

const Recipe = ({ recipe, removal, saveAction, openDetail }) => {
  if (recipe.noRender) {
    return (
      <div className="card card-compact w-72 bg-base-100 shadow-xl flex justify-center items-center">
        <button className="btn">
          <span className="loading loading-spinner"></span>
          loading
        </button>
      </div>
    );
  }

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

  const expanded = useRef(false);

  return (
    <div>
      <motion.div
        className="card card-compact w-72 bg-base-100 shadow-xl"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {/* animate={{ opacity: selectedDiet === null || isSelected ? 1 : 0.6 }} //
      Conditional opacity onClick={() => handleClick(title)}> */}
        <figure>
          <img src={image_link} alt="food" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <div className="flex flex-row">
            <span>
              Cal:
              <div className="badge badge-info ml-2">{nutrition.calories}</div>
            </span>

            <span className="ml-4">
              Protein:
              <div className="badge badge-error ml-2">
                {" "}
                {nutrition.protein}{" "}
              </div>
            </span>

            <span className="ml-4">
              Carbs:
              <div className="badge badge-warning ml-2">
                {" "}
                {nutrition.carbohydrate}{" "}
              </div>
            </span>
          </div>
          <div className="flex flex-wrap">
            {tags_list.split(", ").map((tag) => (
              <span
                key={tag}
                className="badge-primary text-white text-xs  mr-2 px-1.5 py-0.5 my-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="ml-4"></div>
          <div className="card-actions justify-end mr-8 mb-3">
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

            <button
              className="btn btn-sm btn-circle btn-outline"
              onClick={() => {
                document.getElementById(`more_info_${id}`).showModal();
                if (!expanded.current) {
                  expanded.current = true;
                  openDetail(id);
                }
              }}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 7C12.8284 7 13.5 6.32843 13.5 5.5C13.5 4.67157 12.8284 4 12 4C11.1716 4 10.5 4.67157 10.5 5.5C10.5 6.32843 11.1716 7 12 7ZM11 9C10.4477 9 10 9.44772 10 10C10 10.5523 10.4477 11 11 11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V10C13 9.44772 12.5523 9 12 9H11Z"
                  fill="#000000"
                />
              </svg>
            </button>

            <button
              className="btn btn-sm btn-circle btn-outline"
              onClick={() => {
                saveAction(id);
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
        </div>
      </motion.div>
      <dialog id={`more_info_${id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Recipe;
