import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifiedGET } from "../consts";

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

    getUser();
  }, []);

  return (
    <>
      <div>ciao</div>
    </>
  );
}

export default HomePage;
