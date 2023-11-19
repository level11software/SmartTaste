import { motion } from "framer-motion";

import { useEffect, useState, useRef } from "react";

function AniSium() {
  const [animation, setAnimation] = useState([]);
  const [element, setElements] = useState([]);
  const elRef = useRef(null);

  useEffect(() => {
    setElements([1, 2, 3]);
    setAnimation([{}, {}, {}]);
  }, []);

  const borderPixel = 20;
  const durationSec = 1;

  function handleAnimation(index, ani) {
    let flag = false;
    const new_animation = animation.map((el, i) => {
      if (i == index) {
        flag = true;
        return ani;
      } else if (flag) {
        return {
          y: -elRef.current.offsetHeight,
          transition: { duration: 1, ease: "easeInOut" },
        };
      } else return el;
    });

    setAnimation(new_animation);
    setTimeout(() => {
      setAnimation(
        animation.filter((el, i) => {
          return i != index;
        })
      );
      setElements(
        element.filter((el, i) => {
          return i != index;
        })
      );
    }, durationSec * 1500);
  }
  console.log(element);

  return (
    <div
      className="flex flex-col items-center gap-5 m-5"
      style={{ height: "800px" }}
    >
      {element.map((item, index) => {
        return (
          <motion.div
            key={item}
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
            <div ref={elRef} className="h-52 w-52 bg-black">
              ciao
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default AniSium;
