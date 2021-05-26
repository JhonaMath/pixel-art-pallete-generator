import React from 'react';
import { Color } from '../pallete/Pallete';
import "./PixelPerfect.css";
import Loader from '../loader/Loader';


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


function PixelPerfect(props: PixelPerfectProps) {
  const size = props.size + "px";

  const { imageData, loading } = props;

  const colorList = fromDataImageToColorsArr(imageData);


  const content = colorList.map((c: any, index) => { return <div key={index} style={{ width: size, height: size, background: convertColorToHex(c) }} /> });


  return (!loading ?
    <div className={"PixelPerfect-container"} style={{
      gridTemplateColumns: `repeat(${imageData.width}, ${size})`,
      gridTemplateRows: `repeat(${imageData.width}, ${size})`
    }}>
      {content}
    </div > :

    <div className={"PixelPerfect-loader-container"}> <Loader /></div>
  );
}

export default PixelPerfect;
