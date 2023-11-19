import React, { useState } from 'react';

const CarouselQuiz = ({ onContinue }) => {
  const [diet, setDiet] = useState(null);

  // Carousel content can be more dynamic, but for simplicity, it's hardcoded here.
  const carouselItems = [
      '../../src/assets/sample_images/fish.jpeg',
    '../../src/assets/sample_images/meat_fat.jpeg',
    '../../src/assets/sample_images/pasta.jpeg',
    '../../src/assets/sample_images/spicy.jpeg',
    '../../src/assets/sample_images/veg.jpeg',
    '../../src/assets/sample_images/vegan.jpeg',
    '../../src/assets/sample_images/vegan_salad.jpeg',

  ];

  const renderCarousel = (key) => (
      <div key={key} className="h-60 carousel carousel-vertical rounded-box shadow-lg">
        {carouselItems.map((src, index) => (
            <div key={index} className="carousel-item h-full">
              <img src={src} alt={`Carousel item ${index + 1}`} />
            </div>
        ))}
      </div>
  );

  return (
      <div className="flex flex-col h-screen justify-between">
        <div className="p-4">
          <h1 className="text-2xl font-bold">What describes you the most?</h1>
          <h5> Show us what represents your taste </h5>
        </div>

        <div className="flex justify-center gap-4 p-5">
          {renderCarousel("carousel1")}
          {renderCarousel("carousel2")}
          {renderCarousel("carousel3")}
        </div>


        <div className="p-4 justify-center">
          <button
              className="bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
              onClick={onContinue}
          >
            <span>Continue</span>
            <i className="fa-solid fa-angles-right pl-5"></i>
          </button>
        </div>
      </div>
  );
};

export default CarouselQuiz;
