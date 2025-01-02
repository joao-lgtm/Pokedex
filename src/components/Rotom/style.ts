import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    left: -3.125rem;
`;
export const Content = styled.div`
  height: 48.668rem;
  position: relative;
`; 

export const RotomDex = styled.div<{background: string}>` 
  background: ${(props) => props.background};
  border-radius: 25px;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 62.5rem;
  height: 43.077rem;
  position: absolute;
  left: -2.5rem;
  top: 1.563rem;

  @media (max-width: 768px) {
    background: #ff0000d6;
    border-radius: 25px;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 31.25rem;
    height: 40rem;
    position: absolute;
    left: 14rem;
    top: 2rem;    
  }
`;

export const CircleBetweenEyes = styled.div`
  background: #000000;
  border-radius: 50%;
  width: 23.173rem;
  height: 20.379rem;
  position: absolute;
  left: 16.875rem;
  top: 7.779rem;

  @media (max-width: 768px) {
    display: none;
  }
`;


export const SidePanel = styled.div`
  background: yellow;
  border-radius: 25px;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 25rem;
  height: 43.077rem;
  position: absolute;
  left: -28.125rem;
  top: 1.563rem;


  @media (max-width: 768px) {
    display: none;
  }
`;

export const ScreenDexArea = styled.div`
    width: 49.721rem;
    height: 43.198rem;
    position: static;

    
  .sprite{
    position: relative;
    top: 37%;
    left: 30%;
    width: 26.875rem;
    filter: brightness(0%);
    pointer-events: none;
    user-select: none;
  }

  @media (max-width: 768px) {
    .sprite{
      position: relative;
      top: 30%;
      left: 40%;
      width: 18.875rem;
      filter: brightness(0%);
      pointer-events: none;
      user-select: none;
    }
  }
`;

export const Screen = styled.div`
  border-radius: 30px;
  border-style: solid;
  border-color: #000000;
  background-color: #000000;
  border-width: 1px;
  width: 46.888rem;
  height: 25.43rem;
  position: absolute;
  left: 5.313rem;
  top: 16.688rem;
  object-fit: cover;

  @media (max-width: 768px) {
    border-radius: 30px;
    border-style: solid;
    border-color: #000000;
    background-color: #000000;
    border-width: 1px;
    width: 25.888rem;
    height: 35.43rem;
    position: absolute;
    left: 16.813rem;
    top: 3.688rem;
    object-fit: cover;    
  }
`;


export const TvEffects = styled.div`
  border-radius: 30px;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 46.888rem;
  height: 25.43rem;
  position: absolute;
  left: 5.313rem;
  top: 16.688rem;
  object-fit: cover;
  transition: all 0.3s ease-in-out;



  &.on {
    background-color: rgb(0, 217, 255);
    animation: tvOn 1s ease-in-out forwards;
  }

  &.off {
    background-color: #ffffff;
    animation: tvOff 1s ease-in-out forwards;
  }


  @media (max-width: 768px) {
    width: 25.888rem;
    height: 35.5rem;
    left: 16.813rem;
    top: 3.788rem;
  }

  @keyframes tvOff {
    0% {
      transform: scaleY(1);
      opacity: 1;
    }
    50% {
      transform: scaleY(0.1);
      opacity: 0.8;
    }
    100% {
      transform: scaleY(0);
      opacity: 0;
    }
  }

  @keyframes tvOn {
    0% {
      transform: scaleY(0);
      opacity: 0;
    }
    50% {
      transform: scaleY(0.1);
      opacity: 0.8;
    }
    100% {
      transform: scaleY(1);
      opacity: 1;
    }
  }
`;


export const Power = styled.div`
    position: absolute;
    left: 0px;
    top: 40.625rem;
    object-fit: cover;
    cursor: pointer;

    @media (max-width: 768px) {
      position: absolute;
      left: 460px;
      top: 39.725rem;
      object-fit: cover;
      cursor: pointer;

    }
`;


export const EyeLeftArea = styled.div`
  width: 8.006rem;
  position: static;

  .eyelidLeft {
    background: #ffffff;
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 8.006rem;
    height: 15.468rem;
    position: absolute;
    left: 11.938rem;
    top: 3.75rem;
    transform-origin: 0 0;
    transform: rotate(-13.789deg) scale(0.987, 1.013);
  }

  .irisLeft {
    background: rgba(79, 168, 232, 0.84);
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 5.886rem;
    height: 11.543rem;
    position: absolute;
    left: 13.625rem;
    top: 6.577rem;
    transform-origin: 0 0;
    transform: rotate(-13.789deg) scale(0.987, 1.013);

    animation: move-eyes-left  4s ease-in-out infinite;
    animation-delay: 4s;
  }

  @media (max-width: 768px) {
  .eyelidLeft {
    background: #ffffff;
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 6.006rem;
    height: 10.468rem;
    position: absolute;
    left: 18.938rem;
    top: 0.1rem;
    transform-origin: 0 0;
    transform: rotate(-13.789deg) scale(0.987, 1.013);
 }
   .irisLeft {
    background: rgba(79, 168, 232, 0.84);
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 4.886rem;
    height: 8.543rem;
    position: absolute;
    left: 19.9rem;
    top: 1.5rem;
    transform-origin: 0 0;
    transform: rotate(-13.789deg) scale(0.987, 1.013);
  }
}


@keyframes move-eyes-left {
  0% {
    left: 215px;
    top: 105px;
   }
   15% {
     left: 225px;
     top: 95px; 
   }
   30% {
     left: 230px;
     top: 110px; 
   }
   50% {
     left: 220px;
     top: 115px;
   }
   70% {
     left: 210px;
     top: 110px; 
   }
   85% {
     left: 205px;
     top: 100px; 
   }
   100% {
     left: 215px;
     top: 105px;
   }
 }
`;


export const EyeRightArea = styled.div`
  width: 8.006rem;
  position: static;

  .eyelidRight {
    background: #ffffff;
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 8.006rem;
    height: 15.468rem;
    position: absolute;
    left: 37.704rem;
    top: 1.881rem;
    transform-origin: 0 0;
    transform: rotate(15deg) scale(1, 1);
  }
  .irisRight{
    background: rgba(79, 168, 232, 0.84);
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 5.886rem;
    height: 11.543rem;
    position: absolute;
    left: 37.849rem;
    top: 5.327rem;
    transform-origin: 0 0;
    transform: rotate(15deg) scale(1, 1);

    animation: move-eyes-right 4s ease-in-out infinite;
    animation-delay: 4s;




 @keyframes move-eyes-right {
   0% {
     left: 605px;
     top: 85px; 
   }
   15% {
     left: 615px;
     top: 75px;
   }
   30% {
     left: 620px;
     top: 90px;
   }
   50% {
     left: 610px;
     top: 95px;
   }
   70% {
     left: 600px;
     top: 90px;
   }
   85% {
     left: 595px;
     top: 80px;
   }
   100% {
     left: 605px;
     top: 85px;
   }
 }

  }

  @media (max-width: 768px) {
    .eyelidRight {
    background: #ffffff;
    border-radius: 50%;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    width: 6.006rem;
    height: 10.468rem;
    position: absolute;
    left: 35.704rem;
    top: -0.9rem;
    transform-origin: 0 0;
    transform: rotate(15deg) scale(1, 1);
  }
  .irisRight{
    background: rgba(79, 168, 232, 0.84);
    border-radius: 50%;
    border-style: solid;
    border-color:rgb(22, 21, 21);
    border-width: 1px;
    width: 4.886rem;
    height: 8.543rem;
    position: absolute;
    left: 35.804rem;
    top: 0.8rem;
    transform-origin: 0 0;
    transform: rotate(15deg) scale(1, 1);

    animation: move-eyes-right 4s ease-in-out infinite;
    animation-delay: 4s;
  }
  }

  
`;


export const BallLeftTop = styled.div`
  background: linear-gradient(to left, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0.84)),
    linear-gradient(to left, rgba(192, 0, 0, 0.84), rgba(192, 0, 0, 0.84));
  border-radius: 50%;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 2.019rem;
  height: 1.971rem;
  position: absolute;
  left: -0.625rem;
  top: 12.813rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const BallLeftBottom = styled.div`
  background: linear-gradient(to left, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0.84)),
    linear-gradient(to left, rgba(192, 0, 0, 0.84), rgba(192, 0, 0, 0.84));
  border-radius: 50%;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 2.019rem;
  height: 1.971rem;
  position: absolute;
  left: -0.625rem;
  top: 21.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const BallRightTop = styled.div`
  background: linear-gradient(to left, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0.84)),
    linear-gradient(to left, rgba(192, 0, 0, 0.84), rgba(192, 0, 0, 0.84));
  border-radius: 50%;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 2.019rem;
  height: 1.971rem;
  position: absolute;
  left: 55.625rem;
  top: 12.813rem;

  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const BallRightBottom = styled.div`
  background: linear-gradient(to left, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0.84)),
    linear-gradient(to left, rgba(192, 0, 0, 0.84), rgba(192, 0, 0, 0.84));
  border-radius: 50%;
  border-style: solid;
  border-color: #000000;
  border-width: 1px;
  width: 2.019rem;
  height: 1.971rem;
  position: absolute;
  left: 55.625rem;
  top: 21.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`;


export const ChangeColor = styled.div`
  position: absolute;

`;
  



//   .audio-wave {
//   width: 5.688rem;
//   height: 3.125rem;
//   position: absolute;
//   left: 52.938rem;
//   top: 40.625rem;
//   object-fit: cover;
  // cursor: pointer;
// }

// .audio-play{
//   display: none;
// }






// .off {
//   background-color: #ffffff;
//   animation: tvOff 1s ease-in-out forwards;
// }

// .on {
//   background-color: rgb(0, 217, 255);
//   animation: tvOn 1s ease-in-out forwards;
// }






// @media (max-width: 768px) {

//   .rectangle-4 {
//   display: none;
// }

//   .ellipse-6 {
//   display: none;
//   background: #000000;
//   border-radius: 50%;
//   width: 23.173rem;
//   height: 20.379rem;
//   position: absolute;
//   left: 16.875rem;
//   top: 7.779rem;
// }
//   .group-1 {
//   width: auto;
//   height: 10rem;
//   position: static;
// }
//   .rectangle-2 {
//   border-radius: 30px;
//   border-style: solid;
//   border-color: #000000;
//   border-width: 1px;
//   width: 25.95rem;
//   height: 35.43rem;
//   position: absolute;
//   left: 4.8rem;
//   top: 3.688rem;
//   object-fit: cover;
// }

//   .group-4 {
//   width: 8.006rem;
//   position: static;
// }
//   .ellipse-4 {
//   background: #ffffff;
//   border-radius: 50%;
//   border-style: solid;
//   border-color: #000000;
//   border-width: 1px;
//   width: 6.006rem;
//   height: 10.468rem;
//   position: absolute;
//   left: 5.938rem;
//   top: -.5rem;
//   transform-origin: 0 0;
//   transform: rotate(-13.789deg) scale(0.987, 1.013);
// }
//   .ellipse-3 {
//   background: rgba(79, 168, 232, 0.84);
//   border-radius: 50%;
//   border-style: solid;
//   border-color: #000000;
//   border-width: 1px;
//   width: 4.886rem;
//   height: 8.543rem;
//   position: absolute;
//   left: 7rem;
//   top: 0.577rem;
//   transform-origin: 0 0;
//   transform: rotate(-13.789deg) scale(0.987, 1.013);

//   /* animation: move-eyes-left  4s ease-in-out infinite; */
//   animation-delay: 4s;
// }

//   .ellipse-42 {
//   background: #ffffff;
//   border-radius: 50%;
//   border-style: solid;
//   border-color: #000000;
//   border-width: 1px;
//   width: 6.006rem;
//   height: 10.468rem;
//   position: absolute;
//   left: 24rem;
//   top: -1.8rem;
//   transform-origin: 0 0;
//   transform: rotate(15deg) scale(1, 1);
// }
//   .ellipse-32 {
//   background: rgba(79, 168, 232, 0.84);
//   border-radius: 50%;
//   border-style: solid;
//   border-color: #000000;
//   border-width: 1px;
//   width: 4.886rem;
//   height: 8.543rem;
//   position: absolute;
//   left: 24rem;
//   top: 0.577rem;
//   transform-origin: 0 0;
//   transform: rotate(15deg) scale(1, 1);

//   /* animation: move-eyes-right 4s ease-in-out infinite; */
//   animation-delay: 4s;
// }
//   .ellipse-5,
//   .ellipse-33,
//   .ellipse-43,
//   .ellipse-52 {
//   display: none;
// }
//   .audio-wave {
//   width: 5.688rem;
//   height: 3.125rem;
//   position: absolute;
//   left: 52.938rem;
//   top: 40.625rem;
//   object-fit: cover;
//   cursor: pointer;
  
// }

// .audio-play{
//   display: none;
// }

// .sprite{
//   position: relative;
//   top: 37%;
//   left: 20%;
//   width: 26.875rem;
//   filter: brightness(0%);
//   pointer-events: none;
//   user-select: none;
// }

// }
// `;

