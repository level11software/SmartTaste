import React, {useEffect, useRef, useState} from 'react';
import {BOUGHT_RECIPE, postToAPI, registerAction, verifiedGET} from "../../consts.jsx";

const CarouselQuiz = ({onContinue}) => {
    const [carouselItems, setCarouselItems] = useState([[], [], []]);
    const userCode = useRef("");
    const [currentImageIndexes, setCurrentImageIndexes] = useState([0, 0, 0]);


    // Function to fetch homepage data and update carousel items
    const getHomePage = async () => {
        const cookie = localStorage.getItem("user-code");
        let homePageJson = await verifiedGET("get_first_recipes", cookie);

        userCode.current = cookie;
        //const parsedJson = JSON.parse(dummyJsonString);
        // Assuming the JSON structure is as provided, with a key 'carousels'
        setCarouselItems(homePageJson.carousels);
    };

    // useEffect to call getHomePage on component mount
    useEffect(() => {
        getHomePage();
    }, []);



// Function to update the currently viewed image index for a carousel
    const updateCurrentImageIndex = (carouselIndex, newImageIndex) => {
        let newCurrentImageIndexes = [...currentImageIndexes];
        newCurrentImageIndexes[carouselIndex] = newImageIndex;
        setCurrentImageIndexes(newCurrentImageIndexes);
    };

// Updated function to handle button click
    const handleButtonClick = async () => {
        try {
            // Map each image index to a registerAction call and store the promises
            const actionPromises = currentImageIndexes.map((imageIndex, carouselIndex) => {
                const imageId = carouselItems[carouselIndex][imageIndex]?.id;
                if (imageId) {
                    console.log(`Currently viewed image ID in Carousel ${carouselIndex + 1}: ${imageId}`);
                    return registerAction(userCode.current, "BOUGHT_RECIPE", imageId);
                } else {
                    return Promise.resolve(); // Return a resolved promise for non-existent image IDs
                }
            });

            // Wait for all registerAction calls to complete
            await Promise.all(actionPromises);

            // Print upload done after all actions are completed
            console.log("upload done");
            onContinue();
        } catch (error) {
            console.error("An error occurred during the upload process:", error);
        }
    };


// Function to render a single carousel
    const renderCarousel = (carouselIndex) => (
        <div key={carouselIndex} className="h-60 carousel carousel-vertical rounded-box shadow-lg">
            {carouselItems[carouselIndex].map((item, imageIndex) => (
                <div key={item.id} className="carousel-item h-full"
                     onClick={() => updateCurrentImageIndex(carouselIndex, imageIndex)}>
                    <img src={item.image_link} alt={`Carousel ${carouselIndex + 1} Image ${imageIndex + 1}`}
                         className={"object-cover"}/>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex h-screen justify-center items-center p-5">
            <div className="flex flex-col h-screen justify-between p-5 w-2/5">
                <div className="p-4 pt-4">
                    <h1 className="text-2xl font-bold">What describes you?</h1>
                    <div className="divider divider-primary text-xs">Slides through recipes that represent your taste
                    </div>
                </div>

                <div className="flex justify-center gap-8 p-5">
                    {carouselItems.map((_, index) => renderCarousel(index))}
                </div>

                <div className={"flex flex-col justify-center items-center"}>
                    <div className={"p-5 divider divider-base-300 text-xs italic thin"}>4 emojis that represents you well:</div>
                    <div className={"flex flex-row justify-center items-center gap-16"}>
                        <label className="swap swap-flip text-6xl">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox"/>
                            <div className="swap-on">🍦</div>
                            <div className="swap-off">🌶️</div>
                        </label>

                        <label className="swap swap-flip text-6xl">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox"/>
                            <div className="swap-on">🏃🏼</div>
                            <div className="swap-off">⏳️</div>
                        </label>

                        <label className="swap swap-flip text-6xl">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox"/>
                            <div className="swap-on">👵🏼</div>
                            <div className="swap-off">🌏</div>
                        </label>

                        <label className="swap swap-flip text-6xl">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox"/>
                            <div className="swap-on">🌭</div>
                            <div className="swap-off">🏋🏽</div>
                        </label>

                    </div>
                </div>

                <div className="p-4 flex justify-center">
                    <button
                        className="bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                        onClick={handleButtonClick}
                    >
                        <span>Start using the app</span>
                        <i className="fa-solid fa-circle-check pl-5"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarouselQuiz;
