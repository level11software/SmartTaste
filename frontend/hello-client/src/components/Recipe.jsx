import React from 'react';

let defaultImage = "https://images2-milano.corriereobjects.it/methode_image/2017/02/19/Interni/Foto%20Interni%20-%20Trattate/piero-kTxG-U43290312445878V-1224x916@Corriere-Web-Milano-593x443.jpg"

/**
 * Recipe Component, renders a single recipe card with the recipe data
 * @param recipe - Recipe Object
 * @returns {Element} - Recipe Card
 * @constructor - Recipe
 */
const Recipe = ({ recipe }) => {
    // Destructuring Props
    const { name, headline, prepTime, image, tags, nutrition } = recipe;

    return (
        <div className="base-100 rounded-lg shadow-lg p-4 flex flex-col h-60">
            <h2 className="text-xl font-bold text-base-content mb-3">{name}</h2>
            <div className="flex flex-row">
                <div className={"w-1/3"}>
                    <img src={image || defaultImage} alt={name} className="rounded-lg shadow-lg " />

                </div>
                <div className="w-2/3 ml-3">
                    <p className="text-base-content/80 mb-2 font-thin text-sm">{headline}</p>
                </div>
            </div>

            <div className={"flex items-end h-full"}>
                {/* tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {tags.map(tag => (
                        <span key={tag.name} className="badge-primary text-white text-xs  mr-2 px-1.5 py-0.5 rounded">
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Recipe;
