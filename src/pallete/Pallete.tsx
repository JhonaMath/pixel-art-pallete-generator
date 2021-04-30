import React, { useState, useRef, useEffect } from 'react';
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
  colorList: Color[];
  selectedIndex: number;
  setSelectedIndex: any;

  blockedIndexes: number[];
  setBlockedIndexes: any;

}

function convertColorToHex(color: Color) {

  const number = color.r * 16 * 16 + color.g * 16 + color.b;

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

  const findIndex = aux.findIndex((v) => v == index);
  aux.splice(findIndex, 1);


  setBlockedList(aux);
}


function Pallete(props: PalleteProps) {
  let content = null;

  const { colorList, selectedIndex, setSelectedIndex, blockedIndexes, setBlockedIndexes } = props;


  content = colorList.map((c, i) => (<PalleteTile
    color={convertColorToHex(c)}
    selected={selectedIndex == i}
    blocked={blockedIndexes.includes(i)}
    onClick={() => setSelectedIndex(i)}
    onBlockClick={() => { handleBlockIndex(i, blockedIndexes, setBlockedIndexes) }}
    onUnblockClick={() => { handleUnBlockIndex(i, blockedIndexes, setBlockedIndexes) }}
  />));

  return (
    <div className={"Pallete-wrapper"}>
      <div className={"Pallete-title"}>Pallete</div>
      <div className={"Pallete-container"}>{content}</div>
    </div>
  );
}

export default Pallete;
