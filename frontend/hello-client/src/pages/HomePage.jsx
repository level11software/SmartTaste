import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifiedGET } from "../consts";
import Recipe from "../components/Recipe.jsx";
import recipesData from '../assets/db_16.json';

function HomePage() {
  const userCode = useRef(-1);
  const navigate = useNavigate();

  async function getUser() {
    const user = await verifiedGET("hello", userCode.current);
    console.log(user);
  }

  useEffect(() => {
    const cookie = localStorage.getItem("user-code");

    if (cookie == null || cookie == undefined) {
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
      <div className="overflow-auto p-5" style={{ maxHeight: '80vh' }}>
        {recipesData.map(item => (
            <Recipe key={item.recipe.id} recipe={item.recipe} />
        ))}
      </div>
    </>
  );
}

export default HomePage;
