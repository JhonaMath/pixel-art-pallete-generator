
import { FixedSizeList } from 'react-window';
import { ColorPos } from '../App';
import PalleteTile from './paleteTile/PalleteTile';

import "./Pallete.css";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
  a: number;
}

interface PalleteProps {
  colorList: ColorPos[];
  selectedIndex: number;
  setSelectedIndex: any;

  blockedIndexes: number[];
  setBlockedIndexes: any;

}

function convertColorToHex(color: Color) {

  const r = color.r.toString(16).padStart(2, "0");
  const g = color.g.toString(16).padStart(2, "0");
  const b = color.b.toString(16).padStart(2, "0");
  const a = color.a.toString(16).padStart(2, "0");


  return `#${r}${g}${b}${a}`;
}

function handleBlockIndex(index: number, blockedIndexes: number[], setBlockedList: any) {
  const aux = blockedIndexes.filter(() => true);
  aux.push(index);


  setBlockedList(aux);
}


function handleUnBlockIndex(index: number, blockedIndexes: number[], setBlockedList: any) {
  const aux = blockedIndexes.filter(() => true);

  const findIndex = aux.findIndex((v) => v === index);
  aux.splice(findIndex, 1);


  setBlockedList(aux);
}

function Pallete(props: PalleteProps) {
  let content: any = null;

  const { colorList, selectedIndex, setSelectedIndex, blockedIndexes, setBlockedIndexes } = props;

  const Row = ({ index, style }: any) => (

    < div style={style} > {content[index]}</div>
  );

  content = colorList.map((c, i) => (<PalleteTile
    key={i}
    color={convertColorToHex(c.color)}
    selected={selectedIndex === i}
    blocked={blockedIndexes.includes(i)}
    onClick={() => setSelectedIndex(i)}
    onBlockClick={() => { handleBlockIndex(i, blockedIndexes, setBlockedIndexes) }}
    onUnblockClick={() => { handleUnBlockIndex(i, blockedIndexes, setBlockedIndexes) }}
  />));

  return (
    <div className={"Pallete-wrapper"}>
      <div className={"Pallete-title"}>Pallete</div>
      <FixedSizeList
        className="Pallete-container"
        height={300}
        width={200}
        itemSize={54}
        itemCount={content.length} >
        {Row}
      </FixedSizeList>
    </div >
  );
}

export default Pallete;
