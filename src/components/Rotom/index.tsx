import {
  BallLeftBottom,
  BallLeftTop,
  BallRightBottom,
  BallRightTop,
  ChangeColor,
  CircleBetweenEyes,
  Container,
  Content,
  EyeLeftArea,
  EyeRightArea,
  Power,
  RotomDex,
  Screen,
  ScreenDexArea,
  SidePanel,
  TvEffects
} from "./style";
import AudioSVG from "../../assets/Audio Wave.svg";
import PowerSVG from "../../assets/power.svg";
import { useState } from "react";

export function Rotom({ sprite, audio }: { sprite: string; audio: string }) {
  const [power, setPower] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ff0000d6')

  function handlePowerToggle() {
    setPower(!power);
  };

  function handleAudioPlay() {
    const audioElement = document.querySelector<HTMLAudioElement>(".audio-play");
    if (audioElement) {
      audioElement.play();
    }
  };

  function handleChangeColorRotom(className: string) {
    console.log(className)
    setBackgroundColor(className);

  }

  return (
    <Container className={power ? "on" : "off"}>
      <Content>
        <RotomDex background={backgroundColor}></RotomDex>
        <CircleBetweenEyes></CircleBetweenEyes>
        <ScreenDexArea>
          <Screen></Screen>
          <TvEffects className={power ? "on" : "off"} />
          <img className="sprite" src={sprite} draggable="false" alt="Rotom Sprite" />
        </ScreenDexArea>

        <Power>
          <img className="play" src={PowerSVG} alt="Power Toggle Icon" onClick={handlePowerToggle} />
        </Power>

        <SidePanel>
          <div className="rectangle-5"></div>
        </SidePanel>


        <EyeLeftArea>
          <div className="eyelidLeft"></div>
          <div className="irisLeft"></div>
        </EyeLeftArea>
        <EyeRightArea>
          <div className="eyelidRight"></div>
          <div className="irisRight"></div>
        </EyeRightArea>


        <BallLeftTop />
        <BallLeftBottom />
        <BallRightTop />
        <BallRightBottom />
        {/* <div className="audio-wave">
          <img className="play" src={AudioSVG} alt="Audio Play Icon" onClick={handleAudioPlay} />
          <audio className="audio-play" src={audio} preload="metadata"></audio>
        </div>
       */}

        <ChangeColor>
          <div className="#ffff" onClick={e => handleChangeColorRotom(e.currentTarget.className)}>

          </div>
          <div className="#ffff" onClick={e => handleChangeColorRotom(e.currentTarget.className)}>
            aqui
          </div>
        </ChangeColor>
      </Content>
    </Container>
  );
}
