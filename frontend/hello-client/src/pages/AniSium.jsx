import { motion } from "framer-motion";

import { useEffect, useState, useRef } from "react";

function AniSium() {
  const [animation, setAnimation] = useState([]);
  const [element, setElements] = useState([]);

  useEffect(() => {
    setElements([1, 2, 3]);
    setAnimation([{}, {}, {}]);
  }, []);

  const borderPixel = 20;

  function handleAnimation(index, ani) {
    let flag = false;
    const new_animation = animation.map((el, i) => {
      if (i == index) {
        flag = true;
        return ani;
      } else if (flag) {
        return {
          y: "-70px",
          transition: { duration: 1, ease: "easeInOut" },
        };
      } else return el;
    });

    setAnimation(new_animation);
  }

  return (
    <div className="flex flex-col items-center gap-5 m-5">
      {element.map((item, index) => {
        return (
          <motion.div
            drag="x"
            dragSnapToOrigin
            onDragEnd={(event, info) => {
              console.log(info.point.x, window.innerWidth);
              if (info.point.x > window.innerWidth - borderPixel) {
                handleAnimation(index, {
                  x: "100vw",
                  transition: { duration: 1, ease: "easeInOut" },
                });
              } else if (info.point.x < borderPixel) {
                handleAnimation(index, {
                  x: "-100vw",
                  transition: { duration: 1, ease: "easeInOut" },
                });
              }
            }}
            animate={animation[index]}
          >
            <div className="h-52 w-52 bg-black">ciao</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default AniSium;
