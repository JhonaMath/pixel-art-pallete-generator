import React, { useState, useRef, useEffect } from 'react';
import LockIcon from '@material-ui/icons/Lock';
// import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import "./PalleteTile.css";

interface PalleteTileProps {
  color: string;
  selected: boolean;
  blocked: boolean;

  onBlockClick: () => void;
  onUnblockClick: () => void;
  onClick: () => void;
}


function PalleteTile(props: PalleteTileProps) {

  let content = null;

  const { color, selected, blocked, onBlockClick, onUnblockClick } = props;


  return (
    <div className={"PalleteTile-wrapper"} style={{ display: "flex" }}>
      {blocked ? <div className={"PalleteTile-lockicon-container"} onClick={() => onUnblockClick()}><LockIcon /></div> : <div className={"PalleteTile-lockopenicon-container"} onClick={onBlockClick}><LockOutlinedIcon /></div>}
      <div className="PalleteTile-container" style={{ background: color, border: selected ? "2px solid white" : "2px solid " + color }} onClick={() => props.onClick()}></div>
      {color}
    </div>


  );
}

export default PalleteTile;
