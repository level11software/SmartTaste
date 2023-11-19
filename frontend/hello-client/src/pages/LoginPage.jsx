import { backend_url } from "../consts";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user-code", "cicciogamer89");
    console.log("done");
    navigate("/");
  }, []);

  return (
    <>
      <h1>Cookie set. You can start testing.</h1>
    </>
  );
}

export default LoginPage;
