import React from 'react';
import { Color } from '../pallete/Pallete';
import "./PixelPerfect.css";
import Loader from '../loader/Loader';
import { convertImageDataToImage } from '../helpers/CanvasHelper';


interface DataImage {
  data: any; height: number; width: number
}

function fromDataImageToColorsArr(dataImage: DataImage) {

  const auxList = [];

  const numPixels = dataImage.width * dataImage.height;

  for (let i = 0; (i) < numPixels; i++) {
    const color = {
      r: dataImage.data[i * 4],
      g: dataImage.data[i * 4 + 1],
      b: dataImage.data[i * 4 + 2],
      a: dataImage.data[i * 4 + 3],
    }

    auxList.push(color);

  }

  return auxList;

}

function convertColorToHex(color: Color) {

  const r = color.r.toString(16).padStart(2, "0");
  const g = color.g.toString(16).padStart(2, "0");
  const b = color.b.toString(16).padStart(2, "0");
  const a = color.a.toString(16).padStart(2, "0");


  return `#${r}${g}${b}${a}`;
}

interface PixelPerfectProps {
  imageData: { data: any, height: number, width: number };
  size: number;
  loading: boolean;
  percent?: number;
}

let cacheImageData: any = undefined;
let imageSrcCache: any = undefined;

function PixelPerfect(props: PixelPerfectProps) {
  const size = props.size + "px";

  const { imageData, loading, percent } = props;

  if (!imageData || loading) return <div className={"PixelPerfect-loader-container"}> <Loader percent={props.percent} /></div>;


  let imageSrc;

  imageSrc = (convertImageDataToImage(imageData, undefined) as any).src

  const content = <img width={props.size * imageData.width} className={"PixelPerfect-container-img"} style={{ imageRendering: "pixelated" }} src={imageSrc} />

  return (!loading ?
    <div className={"PixelPerfect-container"}>
      {content}
    </div > :
    // <div className={"PixelPerfect-loader-container"}> <Loader percent={props.percent} /></div>
    // :
    <div className={"PixelPerfect-loader-container"}> <Loader percent={percent} /></div>
  );
}

export default PixelPerfect;
