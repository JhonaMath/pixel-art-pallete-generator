import { Color, ColorHSL } from "../pallete/Pallete";
import { ColorPos } from "../App";
import { saveAs } from 'file-saver';

export function generateRandomColor(): Color {
    const color: Color = { r: 0, b: 0, g: 0, a: 0 };

    color.r = Math.floor(Math.random() * 255);
    color.g = Math.floor(Math.random() * 255);
    color.b = Math.floor(Math.random() * 255);
    color.a = Math.floor(Math.random() * 255);


    return color;

}

export function generateRandomColorHSL(): ColorHSL {
    const color: ColorHSL = { h: 0, s: 0, l: 0, a: 0 };

    color.h = Math.floor(Math.random() * 360);
    color.s = Math.floor(Math.random() * 100);
    color.l = Math.floor(Math.random() * 100);
    color.a = Math.floor(Math.random() * 255);


    return color;

}

export function getImageData(imageObj: any, canvas: any) {

    const context = (canvas as any).getContext('2d');

    canvas.style.width = imageObj.width + "px";
    canvas.style.height = imageObj.height + "px";

    canvas.width = imageObj.width;
    canvas.height = imageObj.height;

    context.drawImage(imageObj, 0, 0);

    return context.getImageData(0, 0, canvas.width, canvas.height);
}

export function getPalleteFromImageData(dataImage: any): Color[] {

    const auxList: Color[] = [];

    const numPixels = dataImage.width * dataImage.height;

    let lastSum = -1;

    for (let i = 0; (i) < numPixels; i++) {

        const color = {
            r: dataImage.data[i * 4],
            g: dataImage.data[i * 4 + 1],
            b: dataImage.data[i * 4 + 2],
            a: dataImage.data[i * 4 + 3],
        }

        const sumRGBA = color.a + color.b + color.g + color.r;
        if (lastSum !== sumRGBA && sumRGBA > 0) {

            const existInList = auxList.find((v) => color.r === v.r && color.b === v.b && color.g === v.g && color.a === v.a);

            lastSum = sumRGBA;
            if (!existInList) auxList.push(color);

        }

    }

    return auxList;
}

export function getPalleteWithPosFromImageData(dataImage: any): ColorPos[] {

    let percent = 0;
    const mapOfColorPos = new Map<number, ColorPos>();
    const auxList: Color[] = [];

    const numPixels = dataImage.width * dataImage.height;

    let lastSum = -1;

    const valueToIncrementPer = Math.floor(numPixels / 100);


    for (let i = 0; (i) < numPixels; i++) {

        const color = {
            r: dataImage.data[i * 4],
            g: dataImage.data[i * 4 + 1],
            b: dataImage.data[i * 4 + 2],
            a: dataImage.data[i * 4 + 3],
        }

        const sumRGBA = color.a + color.b * 256 + color.g * 256 * 256 + color.r * 256 * 256 * 256;
        if (sumRGBA > 0) {
            const value = mapOfColorPos.get(sumRGBA);

            if (value !== undefined) {
                //Puede que necesite un set
                value.positions.push(i);
            } else {
                mapOfColorPos.set(sumRGBA, { color: color, positions: [i] });
                auxList.push(color);
            }
        }
    }

    const result = auxList.map((c) => {
        const sum = c.a + c.b * 256 + c.g * 256 * 256 + c.r * 256 * 256 * 256;

        return mapOfColorPos.get(sum)!;
    });

    return result;
}

export function changeColorFromImageData(oldColor: Color, newColor: Color, dataImage: any) {

    const numPixels = dataImage.width * dataImage.height;

    for (let i = 0; (i) < numPixels; i++) {
        const c1 = dataImage.data[i * 4] === oldColor.r;
        const c2 = dataImage.data[i * 4 + 1] === oldColor.g;
        const c3 = dataImage.data[i * 4 + 2] === oldColor.b;
        const c4 = dataImage.data[i * 4 + 3] === oldColor.a;

        if (c1 && c2 && c3 && c4) {
            dataImage.data[i * 4] = newColor.r;
            dataImage.data[i * 4 + 1] = newColor.g;
            dataImage.data[i * 4 + 2] = newColor.b;
            dataImage.data[i * 4 + 3] = newColor.a;
        }
    }

    return dataImage;
}

export function changeColorPosFromImageData(oldColor: ColorPos, newColor: Color, dataImage: any) {

    const numPixels = dataImage.width * dataImage.height;

    for (let i = 0; i < oldColor.positions.length; i++) {
        const pos = oldColor.positions[i];

        dataImage.data[pos * 4] = newColor.r;
        dataImage.data[pos * 4 + 1] = newColor.g;
        dataImage.data[pos * 4 + 2] = newColor.b;
        dataImage.data[pos * 4 + 3] = newColor.a;

    }

    // for (let i = 0; (i) < numPixels; i++) {
    //     const c1 = dataImage.data[i * 4] === oldColor.r;
    //     const c2 = dataImage.data[i * 4 + 1] === oldColor.g;
    //     const c3 = dataImage.data[i * 4 + 2] === oldColor.b;
    //     const c4 = dataImage.data[i * 4 + 3] === oldColor.a;

    //     if (c1 && c2 && c3 && c4) {
    //         dataImage.data[i * 4] = newColor.r;
    //         dataImage.data[i * 4 + 1] = newColor.g;
    //         dataImage.data[i * 4 + 2] = newColor.b;
    //         dataImage.data[i * 4 + 3] = newColor.a;
    //     }
    // }

    return dataImage;
}


export function convertImageDataToImage(imageData: any, canvasIn?: any) {

    let canvas: any = document.createElement("CANVAS");

    if (canvasIn) canvas = canvasIn;
    else canvas = document.createElement("CANVAS");

    const context = (canvas as any).getContext('2d');

    canvas.style.width = imageData.width + "px";
    canvas.style.height = imageData.height + "px";

    var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = imageData.width * scale;
    canvas.height = imageData.height * scale;

    // Normalize coordinate system to use css pixels.
    context.scale(scale, scale);

    context.putImageData(imageData, 0, 0);

    var image = new Image();
    image.id = "pic";
    image.src = canvas.toDataURL();

    return image;
}

export async function readImage(file: any, callBack: any) {
    // Check if the file is an image.
    if (file.type && !file.type.startsWith('image/')) {
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        callBack(event.target!.result);
    });
    reader.readAsDataURL(file);
}

export function writeImageData(imageData: any, name: string) {

    var canvas = document.createElement("CANVAS");
    const image = convertImageDataToImage(imageData, canvas);

    saveAs(image.src, name);

}

export function convertColorToHex(color: Color) {

    const r = color.r.toString(16).padStart(2, "0");
    const g = color.g.toString(16).padStart(2, "0");
    const b = color.b.toString(16).padStart(2, "0");
    const a = color.a.toString(16).padStart(2, "0");


    return `#${r}${g}${b}${a}`;
}

export function fromHSLToRGB(hslColor: ColorHSL): Color {
    const hslRgb = require('hsl-rgb');

    const rgb = hslRgb(hslColor.h, hslColor.s / 100, hslColor.l / 100);

    return { r: rgb[0], g: rgb[1], b: rgb[2], a: hslColor.a };

}

export function fromRGBToHSL(rgbColor: Color): ColorHSL {
    const rgbToHsl = require('rgb-to-hsl');

    const hsl = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);

    hsl[1] = (parseFloat(hsl[1].replace("%", "")));
    hsl[2] = (parseFloat(hsl[2].replace("%", "")));

    return { h: hsl[0], s: hsl[1], l: hsl[2], a: rgbColor.a };

}