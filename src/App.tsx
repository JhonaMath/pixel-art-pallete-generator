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
import { getImageData, getPalleteFromImageData, changeColorFromImageData, convertImageDataToImage, readImage, convertColorToHex, writeImageData, generateRandomColorHSL, fromHSLToRGB } from './helpers/CanvasHelper';
import { fromRGBToHSL } from './helpers/CanvasHelper';


function useListOfColors(initialListOfColors = []): { listOfColors: Color[], setlistOfColors: any } {
  const [listOfColors, setlistOfColors] = useState(initialListOfColors)
  return { listOfColors, setlistOfColors }
}

function useOriginalImgData(initialListOfColors = []): { dynamicImgData: any, setDynamicImgData: any } {
  const [dynamicImgData, setDynamicImgData] = useState(initialListOfColors);
  return { dynamicImgData, setDynamicImgData }
}

function useImage(initialListOfColors = []): { image: any, setImage: any } {
  const [image, setImage] = useState(initialListOfColors);
  return { image, setImage }
}

function RandomizeListOfColors(listOfColors: any, imageData: any, listOfBlockedIndex: number[], setlistOfColors: any, randomOptions: any) {
  const { allSameH, h, s, l, a } = randomOptions;

  const auxList: Color[] = [];

  const uniqueHslColor = generateRandomColorHSL();

  listOfColors.forEach((c: Color, index: number) => {
    if (!listOfBlockedIndex.includes(index)) {

      const colorHSL = fromRGBToHSL(c);

      const newHslColor = generateRandomColorHSL();

      if (allSameH && h) newHslColor.h = uniqueHslColor.h;
      else if (!allSameH && !h) newHslColor.h = colorHSL.h;

      if (!s) newHslColor.s = colorHSL.s;

      if (!l) newHslColor.l = colorHSL.l;

      if (!a) newHslColor.a = colorHSL.a;


      const newColor = fromHSLToRGB(newHslColor);

      changeColorFromImageData(c, newColor, imageData);

      auxList.push(newColor);
    } else {
      auxList.push(c);
    }
  });

  setlistOfColors(auxList);

}

function handleChangeColorPicker(selectedIndex: any, newColor: any, listOfColors: any, imageData: any, setlistOfColors: any, setImageData: any) {
  const auxList: Color[] = [];

  listOfColors.forEach((c: Color, index: any) => {
    if (index === selectedIndex) {
      const newColorAux = newColor.rgb;

      newColorAux.a = Math.floor(newColorAux.a * 255);

      changeColorFromImageData(c, newColorAux, imageData);

      auxList.push(newColorAux);
    } else {
      auxList.push(c);
    }

  });

  setlistOfColors(auxList);

}

async function callBackChangeImage(imageSrc: any, setImage: any, setDynamicImgData: any, setlistOfColors: any, setLoading: any) {

  const canvas: any = document.getElementById('canvas');


  const imageObj = new Image();
  imageObj.src = imageSrc;

  imageObj.onload = function () {

    const dataImage = getImageData(imageObj, canvas);

    if (dataImage.width * dataImage.height > 40000) {
      alert("This image is too long.");
      return;
    }

    const pallete = getPalleteFromImageData(dataImage);

    setImage(imageObj);
    setDynamicImgData(dataImage);
    setlistOfColors(pallete);
    setLoading(false);
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
    <TagA href={"https://github.com/JhonaMath/pixel-art-pallete-generator"} toolTipText={"Code!"}>
      <GitHubIcon fontSize="large" />
    </TagA>
    <TagA href={"https://o-lobster.itch.io/simple-dungeon-crawler-16x16-pixel-pack"} toolTipText={"Asset"}>
      <VideogameAssetIcon fontSize="large" />
    </TagA>
    <TagA href={"mailto:jhonathan.barreiro@gmail.com"} toolTipText={"Contact! :)"}>
      <MailIcon fontSize="large" />
    </TagA>
  </div>)
}

function App() {

  const [windowSize, setWindowSize] = useState(0);


  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadName, setDownloadName] = useState("");
  const [blockedIndexes, setBlockedIndexes] = useState([]);
  const [loadingPercent] = useState();
  const [randomOptions, setRandomOptions] = useState({ h: true, s: true, l: true, a: false, allSameH: true });

  const { setImage } = useImage();

  const [pixelSize, setPixelSize] = useState(25);

  const [loadingMessage, setLoadingMessage] = useState(false);

  const { listOfColors, setlistOfColors } = useListOfColors();

  const { dynamicImgData, setDynamicImgData } = useOriginalImgData();

  const initialCanvasSize = 150;

  const RandomizeSection = (props: any) => {
    return (<div className={"App-randomize-container"}  >
      <div style={{ fontSize: "20px", padding: "10px" }}>Randomize</div>
      <div className={"App-randomize-checkboxes-container"}>
        <CheckBoxLabeled title={"same hue"} checked={randomOptions.allSameH} onClick={() => { setRandomOptions({ ...randomOptions, allSameH: !randomOptions.allSameH, }) }} />

        <CheckBoxLabeled title={"hue"} checked={randomOptions.h} onClick={() => { setRandomOptions({ ...randomOptions, h: !randomOptions.h, }) }} />

        <CheckBoxLabeled title={"saturation"} checked={randomOptions.s} onClick={() => { setRandomOptions({ ...randomOptions, s: !randomOptions.s, }) }} />
        <CheckBoxLabeled title={"light"} checked={randomOptions.l} onClick={() => { setRandomOptions({ ...randomOptions, l: !randomOptions.l, }) }} />

        <CheckBoxLabeled title={"alpha"} checked={randomOptions.a} onClick={() => { setRandomOptions({ ...randomOptions, a: !randomOptions.a, }) }} />
      </div>
      <div className={"App-randomize-button-container"} onClick={() => { RandomizeListOfColors(listOfColors, dynamicImgData, blockedIndexes, setlistOfColors, randomOptions) }}> <CasinoIcon /></div>
    </div>);
  }


  useEffect(() => {

    document.addEventListener("resize", () => {
      setWindowSize(window.innerWidth);
    });

    setWindowSize(window.innerWidth);

    const canvas: any = document.getElementById('canvas');

    const context = (canvas as any).getContext('2d');

    const imageObj = new Image();
    imageObj.src = dibujo;

    setImage(imageObj);

    imageObj.onload = function () {

      var scale = window.devicePixelRatio;
      const dataImage = getImageData(imageObj, canvas);

      setDynamicImgData(dataImage);

      const pallete = getPalleteFromImageData(dataImage);

      setlistOfColors(pallete);

      let newImageData = dataImage;

      const newImage = convertImageDataToImage(newImageData, canvas);

      canvas.style.width = initialCanvasSize + "px";
      canvas.style.height = initialCanvasSize + "px";

      canvas.width = initialCanvasSize * scale;
      canvas.height = initialCanvasSize * scale;

      context.scale(initialCanvasSize / dataImage.width, initialCanvasSize / dataImage.height);

      context.drawImage(newImage, 0, 0);

      const pallete2 = getPalleteFromImageData(newImageData);

      setlistOfColors(pallete2);

    }

  }, []);

  return (
    <div className="App">
      <div className="App-wrapper">
        <div id="pocho" className="App-preview-container">
          <canvas id="canvas" width="800" height="800" hidden={true}></canvas>
          <div style={{ height: "80%" }}>
            <PixelPerfect imageData={dynamicImgData} size={pixelSize} loading={loadingMessage} percent={loadingPercent} />
          </div>
          <div className={"App-preview-input-container"}>
            <Slider onChange={(v) => { setPixelSize(v) }} min={1} max={50} value={pixelSize} />
          Preview
          <input type="file" id="file" accept=".png" width={300} onChange={(e: any) => {
              if (!e?.target?.files[0]) return;

              setPixelSize(1);
              setLoadingMessage(true);
              setDownloadName(e.target.files[0].name);
              readImage(e.target.files[0], (imgSrc: any) => {
                setBlockedIndexes([]);
                callBackChangeImage(imgSrc, setImage, setDynamicImgData, setlistOfColors, setLoadingMessage)
              });
            }}></input>
            <div className={"App-download-containers"}>
              <input value={downloadName} onChange={(e) => { setDownloadName(e.target.value) }}></input>
              <button onClick={() => writeImageData(dynamicImgData, downloadName)}>Download</button>
            </div>
          </div>

        </div>
        <div className={"App-colors-containers"}>
          <div className="App-pallete-container">
            <Pallete colorList={listOfColors} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} blockedIndexes={blockedIndexes} setBlockedIndexes={setBlockedIndexes} />
            {windowSize <= 1024 && <div className="App-color-picker-container">
              {(blockedIndexes as any).includes(selectedIndex) && (<div className="App-color-picker-mask">
                <LockIcon />
              </div>)}

              <SketchPicker color={listOfColors[selectedIndex] ? convertColorToHex(listOfColors[selectedIndex]) : "#0000"} onChangeComplete={(color) => { handleChangeColorPicker(selectedIndex, color, listOfColors, dynamicImgData, setlistOfColors, setDynamicImgData) }} />

            </div>}
            <RandomizeSection />
            {windowSize <= 1024 && <ContactSection />}
          </div>
          {windowSize > 1024 && <div className="App-color-picker-container">
            {(blockedIndexes as any).includes(selectedIndex) && (<div className="App-color-picker-mask">
              <LockIcon />
            </div>)}

            <SketchPicker color={listOfColors[selectedIndex] ? convertColorToHex(listOfColors[selectedIndex]) : "#0000"} onChangeComplete={(color) => { handleChangeColorPicker(selectedIndex, color, listOfColors, dynamicImgData, setlistOfColors, setDynamicImgData) }} />
            <ContactSection />
          </div>}
        </div>
      </div>
    </div >
  );
}

//Asset Creator: https://o-lobster.itch.io/simple-dungeon-crawler-16x16-pixel-pack


export default App;
