import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifiedGET } from "../consts";
import Recipe from "../components/Recipe.jsx";
import recipesData from '../assets/db_16.json';
import DietGlassCard from "../components/Quiz/SubComponents/DietGlassCard.jsx";
import DietQuiz from "../components/Quiz/DietQuiz.jsx";
import AllergensQuiz from "../components/Quiz/AllergensQuiz.jsx";
import QuizContainer from "../components/Quiz/QuizContainer.jsx";

function QuizPage() {
  const userCode = useRef(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = localStorage.getItem("user-code");

    if (cookie == null) {
      navigate("/login");
    } else {
      userCode.current = cookie;
      //console.log(cookie);
    }

    // getUser();
  }, []);

  return (
    <>
      {/*A list of recipes*/}
      <QuizContainer />
    </>
  );
}

export default QuizPage;
