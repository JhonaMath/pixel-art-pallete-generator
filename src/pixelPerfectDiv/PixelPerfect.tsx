import "./PixelPerfect.css";
import Loader from '../loader/Loader';
import { convertImageDataToImage } from '../helpers/CanvasHelper';


interface PixelPerfectProps {
  imageData: { data: any, height: number, width: number };
  size: number;
  loading: boolean;
  percent?: number;
}

function PixelPerfect(props: PixelPerfectProps) {
  const { imageData, loading, percent } = props;

  if (!imageData || loading) return <div className={"PixelPerfect-loader-container"}> <Loader percent={props.percent} /></div>;


  let imageSrc;

  imageSrc = (convertImageDataToImage(imageData, undefined) as any).src

  const content = <img width={props.size * imageData.width} className={"PixelPerfect-container-img"} style={{ imageRendering: "pixelated" }} src={imageSrc} alt={"Generated"} />

  return (!loading ?
    <div className={"PixelPerfect-container"}>
      {content}
    </div > :
    <div className={"PixelPerfect-loader-container"}> <Loader percent={percent} /></div>
  );
}

export default PixelPerfect;
