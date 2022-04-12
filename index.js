// Import stylesheets
import './style.css';

const container = document.querySelector('.color-picker');
const canvas = document.createElement('canvas');
const circle = document.createElement('div');
const txt = document.createElement('div');
container.appendChild(canvas);
container.appendChild(circle);
container.appendChild(txt);

container.style.position = 'relative';
txt.style.cssText = `font-size: 0.9em; text-align: center;`;
circle.style.cssText = `border: 2px solid; border-radius: 50%; width: 12px; height: 12px; position: absolute; top:0; left: 0; pointer-events: none; box-sizing: border-box;`;

txt.innerHTML = '&nbsp;';
const [width, height] = [container.offsetWidth, container.offsetHeight];
[canvas.width, canvas.height] = [width, height];

drawColors(canvas);
canvas.addEventListener('click', (e) =>
  handleSpectrumClick(e, canvas, circle, txt)
);

// Get random color in spectrum
const RGBArray = createRGBArray();

let frames;
function startFrames() {
  frames = setInterval(function () {
    const randomSpectrumValue = randomNumber(60000);
    const randomRGBValue = RGBArray[randomSpectrumValue];
    const rgb = randomRGBValue.rgb;
    pickColor(
      randomRGBValue.xy.x,
      randomRGBValue.xy.y,
      [rgb.r, rgb.g, rgb.b],
      canvas,
      circle,
      txt
    );
  }, 100);
}

const stop = document.querySelector('#stop');
const start = document.querySelector('#start');
stop.addEventListener('click', (e) => clearInterval(frames));

start.addEventListener('click', (e) => startFrames());

function randomNumber(limit) {
  return Math.floor(Math.random() * limit);
  //
}

function handleSpectrumClick(event, canvas, circle, txt) {
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.
  const context = canvas.getContext('2d');
  const imgData = context.getImageData(x, y, 1, 1);
  console.log(`x = ${x} y = ${y}`);
  const [r, g, b] = imgData.data;
  pickColor(x, y, [r, g, b], canvas, circle, txt);
}

// functions like looping querySelectorAll is something that should just be available always
// document.querySelectorAll('.consitent-circle').each(function(el) {
//   el.removeNode();
// })

function pickColor(x, y, rgb, canvas, circle, txt) {
  const [r, g, b] = rgb;
  const [h, s, l] = rgb2hsl(r, g, b);
  const txtColor = l < 0.5 ? '#FFF' : '#000';

  const consitentCircle = document.createElement('div');
  consitentCircle.classList.add('consistent-circle');
  consitentCircle.style.cssText = `background-color: ${txtColor}; border-radius: 50%; width: 3px; height: 3px; position: absolute; top:${y}px; left: ${x}px; pointer-events: none; box-sizing: border-box;`;
  container.appendChild(consitentCircle);

  circle.style.top = y - 6 + 'px';
  circle.style.left = x - 6 + 'px';
  circle.style.borderColor = txtColor;

  txt.innerText = Object.values(toCss(r, g, b, h, s, l))
    .toString()
    .replace(/\)\,/g, ') ');
  txt.style.backgroundColor = toCss(r, g, b, h, s, l).hex;
  txt.style.color = txtColor;
  canvas.dispatchEvent(
    new CustomEvent('color-selected', {
      bubbles: true,
      detail: { r, g, b, h, s, l },
    })
  );
}

function arrayEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

// create array of RGBs in canvas first.

function createRGBArray() {
  // gfx.canvas.willReadFrequently.enable = true;
  const context = canvas.getContext('2d');
  const width = 300;
  const height = 200;
  let matched;

  // Now I need to loop through the height and width AKA X and Y axis.
  // Y should be first
  // X should be second

  let RGBArray = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let imgData = context.getImageData(x, y, 1, 1);
      let [r, g, b] = imgData.data;
      let RGBcolor1 = {
        xy: {
          x: x,
          y: y,
        },
        rgb: {
          r: r,
          g: g,
          b: b,
        },
      };
      RGBArray.push(RGBcolor1);
    }
  }

  return RGBArray;
}

// function findColor(randomRGB) {
//   // gfx.canvas.willReadFrequently.enable = true;
//   const context = canvas.getContext('2d');
//   const width = 300;
//   const height = 200;
//   let matched

//   // Now I need to loop through the height and width AKA X and Y axis.
//   // Y should be first
//   // X should be second

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const imgData = context.getImageData(x, y, 1, 1);
//       const [r, g, b] = imgData.data;
//       const RGBcolor1 = {r: r, g: g, b: b};

//       console.log('findColor 1', RGBcolor1);
//       console.log('findColor 2', randomRGB);
//       break;

//       matched = arrayEqual(RGBcolor1, randomRGB);
//       console.log(matched)
//       if (matched) {
//         console.log([x, y]);
//         return [x, y];
//       }
//     }
//   }

//   // now what I need to do is check if the rgb of the passed color (the random color in this case) matched the color in the pixel.

// }

function drawColors(canvas) {
  const context = canvas.getContext('2d');
  const { width, height } = canvas;

  //Colors - horizontal gradient
  const gradientH = context.createLinearGradient(0, 0, width, 0);
  gradientH.addColorStop(0, 'rgb(255, 0, 0)'); // red
  gradientH.addColorStop(1 / 6, 'rgb(255, 255, 0)'); // yellow
  gradientH.addColorStop(2 / 6, 'rgb(0, 255, 0)'); // green
  gradientH.addColorStop(3 / 6, 'rgb(0, 255, 255)');
  gradientH.addColorStop(4 / 6, 'rgb(0, 0, 255)'); // blue
  gradientH.addColorStop(5 / 6, 'rgb(255, 0, 255)');
  gradientH.addColorStop(1, 'rgb(255, 0, 0)'); // red
  context.fillStyle = gradientH;
  context.fillRect(0, 0, width, height);

  //Shades - vertical gradient
  const gradientV = context.createLinearGradient(0, 0, 0, height);
  gradientV.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradientV.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  gradientV.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
  context.fillStyle = gradientV;
  context.fillRect(0, 0, width, height);
}

function rgb2hsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function toCss(r, g, b, h, s, l) {
  const int2hex = (num) =>
    (Math.round(num) < 16 ? '0' : '') + Math.round(num).toString(16);

  return {
    rgb: `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`,
    hsl: `hsl(${Math.round(360 * h)},${Math.round(100 * s)}%,${Math.round(
      100 * l
    )}%)`,
    hex: `#${int2hex(r)}${int2hex(g)}${int2hex(b)}`,
  };
}

// Don't need

// const thePosition = arrayObjectIndexOf(RGBArray, randomRGB, "rgb"); // 1
// console.log('thePosition',thePosition);

// function arrayObjectIndexOf(myArray, searchTerm, property) {
//   console.log('searchTerm', searchTerm);
//   for(var i = 0, len = myArray.length; i < len; i++) {
//     if (functioncompareRGB(myArray[i][property], searchTerm)) {
//       console.log(myArray[i])
//       console.log(searchTerm)
//       return i;
//     }
//     // break;
//   }console.log('i', i)
//   return -1;
// }

// function functioncompareRGB(obj1, obj2) {
//   return obj1.r === obj2.r && obj1.g === obj2.g && obj1.b === obj2.b;
// }

// function randomRGBGenerator() {
//   return {
//       r: randomNumber(255),
//       g: randomNumber(255),
//       b: randomNumber(255)
//   };
// }
