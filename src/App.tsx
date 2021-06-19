import _ from 'lodash';
import { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from 'rc-slider';
import { SketchPicker } from 'react-color';
import 'rc-slider/assets/index.css';
import Checkbox from '@material-ui/core/Checkbox';
import CasinoIcon from '@material-ui/icons/Casino';
import './App.css';
import LockIcon from '@material-ui/icons/Lock';
import GitHubIcon from '@material-ui/icons/GitHub';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import MailIcon from '@material-ui/icons/Mail';


import dibujo from './logo.png';
import Pallete, { Color } from './pallete/Pallete';
import PixelPerfect from './pixelPerfectDiv/PixelPerfect';
import { getImageData, getPalleteFromImageData, changeColorFromImageData, convertImageDataToImage, readImage, convertColorToHex, writeImageData, generateRandomColorHSL, fromHSLToRGB, getPalleteWithPosFromImageData, changeColorPosFromImageData } from './helpers/CanvasHelper';
import { fromRGBToHSL } from './helpers/CanvasHelper';

export interface ColorPos {
  color: Color;
  positions: number[]
}

function RandomizeListOfColors(listOfColors: any, imageData: any, listOfBlockedIndex: number[], setlistOfColors: any, randomOptions: any) {
  const { allSameH, h, s, l, a } = randomOptions;

  const auxList: ColorPos[] = [];

  const uniqueHslColor = generateRandomColorHSL();

  let newImageData = imageData;

  listOfColors.forEach((c: ColorPos, index: number) => {
    if (!listOfBlockedIndex.includes(index)) {

      const colorHSL = fromRGBToHSL(c.color);

      const newHslColor = generateRandomColorHSL();

      if (allSameH && h) newHslColor.h = uniqueHslColor.h;
      else if (!allSameH && !h) newHslColor.h = colorHSL.h;

      if (!s) newHslColor.s = colorHSL.s;

      if (!l) newHslColor.l = colorHSL.l;

      if (!a) newHslColor.a = colorHSL.a;

      const newColor = fromHSLToRGB(newHslColor);

      newImageData = changeColorPosFromImageData(c, newColor, newImageData);

      // newImageData = changeColorFromImageData(c, newColor, newImageData);

      c.color = newColor;
      auxList.push(c);
    } else {
      auxList.push(c);
    }
  });

  setlistOfColors(auxList, _.cloneDeep(newImageData));

}

function handleChangeColorPicker(selectedIndex: any, newColor: any, listOfColors: any, imageData: any, setlistOfColors: any) {

  let newImageData = imageData;

  const newColorAux = newColor.rgb;
  newColorAux.a = Math.floor(newColorAux.a * 255);

  newImageData = changeColorPosFromImageData(listOfColors[selectedIndex], newColorAux, newImageData);

  listOfColors[selectedIndex].color = newColorAux;

  setlistOfColors(listOfColors, newImageData);

}

async function callBackChangeImage(imageSrc: any, prevState: any, setState: any,) {

  const canvas: any = document.getElementById('canvas');


  const imageObj = new Image();
  imageObj.src = imageSrc;

  imageObj.onload = function () {
    const dataImage = getImageData(imageObj, canvas);

    const pallete = getPalleteFromImageData(dataImage);
    const palletePos = getPalleteWithPosFromImageData(dataImage);


    setState({ ...prevState, dynamicImgData: dataImage, listOfColors: pallete, loadingMessage: false, listOfColorsPos: palletePos })
  }

}

function CheckBoxLabeled(props: { title: string, checked: boolean, onClick: any }) {

  const CustomCheckbox = withStyles({
    root: {
      color: "#ffffff88",
      '&$checked': {
        color: "#ffffff99",
      },
    },
    checked: {},
  })((props) => <Checkbox size={"small"} color="default" {...props} />);

  return <div style={{ display: "flex", alignItems: "center" }}><CustomCheckbox {...props} /><span>{props.title}</span></div>
}



function TagA(props: any) {
  return <a href={props.href} target="_blank" rel="noreferrer" className={"Button-container"} onClick={props.onClick}>{props.children} <div className={"tooltiptext"}>{props.toolTipText}</div></a>
}

function ContactSection() {
  return (<div className={"App-contact-container "}>
    <div className={"App-contact-container-buttons "} >
      <TagA href={"https://github.com/JhonaMath/pixel-art-pallete-generator"} toolTipText={"Code!"}>
        <GitHubIcon fontSize="large" />
      </TagA>
      <TagA href={"https://o-lobster.itch.io/simple-dungeon-crawler-16x16-pixel-pack"} toolTipText={"Asset"}>
        <VideogameAssetIcon fontSize="large" />
      </TagA>
      <TagA href={"mailto:jhonathan.barreiro@gmail.com"} toolTipText={"Contact! :)"}>
        <MailIcon fontSize="large" />
      </TagA>
    </div>
    <div className={"App-contact-version"}>v 0.1.1 </div>

  </div>)
}

function App() {

  const [state, setState] = useState({
    windowSize: 0,
    selectedIndex: 0,
    downloadName: "",
    blockedIndexes: [] as number[],
    pixelSize: 25,
    loadingMessage: false,
    loadingPercent: 0,
    listOfColorsPos: [] as ColorPos[],
    dynamicImgData: undefined as any,
    randomOptions: { h: true, s: true, l: true, a: false, allSameH: true }
  });

  const { windowSize, selectedIndex, downloadName, blockedIndexes, pixelSize, loadingMessage, listOfColorsPos, dynamicImgData, randomOptions } = state;

  const initialCanvasSize = 150;

  const RandomizeSection = (props: any) => {
    return (<div className={"App-randomize-container"}  >
      <div style={{ fontSize: "20px", padding: "10px" }}>Randomize</div>
      <div className={"App-randomize-checkboxes-container"}>
        <CheckBoxLabeled title={"same hue"} checked={randomOptions.allSameH} onClick={() => { setState({ ...state, randomOptions: { ...randomOptions, allSameH: !randomOptions.allSameH, } }) }} />

        <CheckBoxLabeled title={"hue"} checked={randomOptions.h} onClick={() => { setState({ ...state, randomOptions: { ...randomOptions, h: !randomOptions.h, } }) }} />

        <CheckBoxLabeled title={"saturation"} checked={randomOptions.s} onClick={() => { setState({ ...state, randomOptions: { ...randomOptions, s: !randomOptions.s, } }) }} />
        <CheckBoxLabeled title={"light"} checked={randomOptions.l} onClick={() => { setState({ ...state, randomOptions: { ...randomOptions, l: !randomOptions.l, } }) }} />

        <CheckBoxLabeled title={"alpha"} checked={randomOptions.a} onClick={() => { setState({ ...state, randomOptions: { ...randomOptions, a: !randomOptions.a, } }) }} />
      </div>
      <div className={"App-randomize-button-container"} onClick={() => { RandomizeListOfColors(listOfColorsPos, dynamicImgData, blockedIndexes, (lc: ColorPos[]) => setState({ ...state, listOfColorsPos: lc }), randomOptions) }}> <CasinoIcon /></div>
    </div>);
  }


  useEffect(() => {

    document.addEventListener("resize", () => {
      setState({ ...state, windowSize: window.innerWidth });
    });

    setState({ ...state, windowSize: window.innerWidth });

    const canvas: any = document.getElementById('canvas');

    const context = (canvas as any).getContext('2d');

    const imageObj = new Image();
    imageObj.src = dibujo;

    imageObj.onload = function () {

      var scale = window.devicePixelRatio;
      const dataImage = getImageData(imageObj, canvas);

      let newImageData = dataImage;

      const newImage = convertImageDataToImage(newImageData, canvas);

      canvas.style.width = initialCanvasSize + "px";
      canvas.style.height = initialCanvasSize + "px";

      canvas.width = initialCanvasSize * scale;
      canvas.height = initialCanvasSize * scale;

      context.scale(initialCanvasSize / dataImage.width, initialCanvasSize / dataImage.height);

      context.drawImage(newImage, 0, 0);

      const palletePos = getPalleteWithPosFromImageData(newImageData);

      setState({ ...state, dynamicImgData: dataImage, windowSize: window.innerWidth, listOfColorsPos: palletePos });

    }

  }, []);

  return (
    <div className="App">
      <div className="App-wrapper">
        <div id="pocho" className="App-preview-container">
          <canvas id="canvas" width="800" height="800" hidden={true}></canvas>
          <div style={{ height: "80%" }}>
            <PixelPerfect imageData={dynamicImgData!} size={pixelSize} loading={loadingMessage} percent={0} />
          </div>
          <div className={"App-preview-input-container"}>
            <Slider onChange={(v) => { setState({ ...state, pixelSize: v }); }} min={1} max={50} value={pixelSize} />
          Preview
          <input type="file" id="file" accept=".png" width={300} onChange={(e: any) => {
              if (!e?.target?.files[0]) return;
              setState({ ...state, downloadName: e.target.files[0].name, loadingMessage: true, pixelSize: 1, blockedIndexes: [] });
              readImage(e.target.files[0], (imgSrc: any) => {
                callBackChangeImage(imgSrc, state, setState)
              });
            }}></input>
            <div className={"App-download-containers"}>
              <input value={downloadName} onChange={(e) => { setState({ ...state, downloadName: e.target.value }) }}></input>
              <button onClick={() => writeImageData(dynamicImgData, downloadName)}>Download</button>
            </div>
          </div>

        </div>
        <div className={"App-colors-containers"}>
          <div className="App-pallete-container">
            <Pallete colorList={listOfColorsPos} selectedIndex={selectedIndex} setSelectedIndex={(i: number) => setState({ ...state, selectedIndex: i })} blockedIndexes={blockedIndexes} setBlockedIndexes={(i: number[]) => setState({ ...state, blockedIndexes: i })} />
            {windowSize <= 1024 && <div className="App-color-picker-container">
              {(blockedIndexes as any).includes(selectedIndex) && (<div className="App-color-picker-mask">
                <LockIcon />
              </div>)}

              <SketchPicker color={listOfColorsPos[selectedIndex] ? convertColorToHex(listOfColorsPos[selectedIndex].color) : "#0000"} onChangeComplete={(color) => {
                handleChangeColorPicker(selectedIndex, color, listOfColorsPos, dynamicImgData,
                  (lc: ColorPos[], newData: any) => {
                    setState({ ...state, dynamicImgData: newData, listOfColorsPos: lc })
                  })
              }} />

            </div>}
            <RandomizeSection />
            {windowSize <= 1024 && <ContactSection />}
          </div>
          {windowSize > 1024 && <div className="App-color-picker-container">
            {(blockedIndexes as any).includes(selectedIndex) && (<div className="App-color-picker-mask">
              <LockIcon />
            </div>)}

            <SketchPicker color={listOfColorsPos[selectedIndex] ? convertColorToHex(listOfColorsPos[selectedIndex].color) : "#0000"} onChangeComplete={(color) => { handleChangeColorPicker(selectedIndex, color, listOfColorsPos, dynamicImgData, (lc: ColorPos[], newData: any) => setState({ ...state, dynamicImgData: newData, listOfColorsPos: lc })) }} />
            <ContactSection />
          </div>}
        </div>
      </div>
    </div >
  );
}

//Asset Creator: https://o-lobster.itch.io/simple-dungeon-crawler-16x16-pixel-pack


export default App;
