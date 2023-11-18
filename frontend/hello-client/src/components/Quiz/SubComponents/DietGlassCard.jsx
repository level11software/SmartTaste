import React, { useState } from 'react';

const DietGlassCard = ({title, description, image_src}) => {
    const [selectedDiet, setSelectedDiet] = useState(null);

    const handleClick = (level) => {
        setSelectedDiet(level);
    };

    return (
        <div className="card shadow-xl w-64">
            <figure><img className={"h-[170px] object-cover"} src={image_src} alt="car!"/></figure>
            <div className="card-body p-4">
                <h2 className="card-title">{title}</h2>
                <p className={"italic text-sm font-light"}>{description}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Select</button>
                </div>
            </div>
        </div>
    );
};

export default DietGlassCard;
