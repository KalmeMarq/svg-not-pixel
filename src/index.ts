export {};

let method = 0;

(document.getElementById('method') as HTMLSelectElement).addEventListener('change', (ev) => {
  method = (ev.target as HTMLSelectElement).selectedIndex;
});

function convertToSvg(img: HTMLImageElement, filename: string) {
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d') as CanvasRenderingContext2D;
  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, img.width, img.height);

  const pixels: { x: number; y: number; color: string }[] = [];
  const pixels2: Record<string, string> = {};

  for (let i = 0; i < imgData.data.length; i += 4) {
    const r = imgData.data[i];
    const g = imgData.data[i + 1];
    const b = imgData.data[i + 2];
    const a = imgData.data[i + 3];

    if (a > 0) {
      pixels.push({
        x: (i / 4) % img.width,
        y: Math.floor(i / 4 / img.width),
        color: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a < 255 ? r.toString(16).padStart(2, '0') : ''}`
      });

      pixels2[`${(i / 4) % img.width},${Math.floor(i / 4 / img.width)}`] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a < 255 ? r.toString(16).padStart(2, '0') : ''}`;
    }
  }

  const blocks: { x: number; y: number; color: string; width: number; height: number }[] = [];
  const blocks2: { x: number; y: number; color: string; width: number; height: number }[] = [];

  const lineAlgorithm = () => {
    for (let i = 0; i < pixels.length; i++) {
      let width = 1;
      let x = pixels[i].x;
      let y = pixels[i].y;
      let color = pixels[i].color;

      let ix = x;

      while (pixels[i + 1] !== undefined && pixels[i + 1].color === color && pixels[i + 1].x === ix + 1) {
        ++width;
        ++ix;
        ++i;
      }

      blocks.push({ x, y, color, width, height: 1 });
    }

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      let blk: { x: number; y: number; color: string; width: number; height: number }[] = [];

      for (let j = 0; j < blocks.length; j++) {
        if (i !== j && blocks[j].x === block.x && blocks[j].width === block.width && block.color === blocks[j].color && blocks[j].y > block.y) {
          blk.push(blocks[j]);
        }
      }

      blk.sort((a, b) => a.y - b.y);

      let blks: { x: number; y: number; color: string; width: number; height: number }[] = [];

      for (let j = 0; j < blk.length; j++) {
        if (blk[j - 1]) {
          if (blks.length > 0) {
            if (blks[blks.length - 1].y + 1 === blk[j].y) {
              blks.push(blk[j]);
            }
          } else {
            blks.push(blk[j]);
          }
        } else if (block.y + 1 === blk[j].y) {
          blks.push(blk[j]);
        }
      }

      let minY = blks.length > 0 ? (block.y > blks[0].y ? blks[0].y : block.y) : block.y;

      const has = blocks2.findIndex((b) => {
        const blockMinY = minY;
        const blockMaxY = minY + blks.length;

        const bMinY = b.y;
        const bMaxY = b.y + b.height;

        return b.x === block.x && b.width === block.width && bMinY <= blockMinY && bMaxY > blockMaxY;
      });

      if (has < 0) {
        blocks2.push({
          x: block.x,
          y: minY,
          width: block.width,
          height: blks.length + 1,
          color: block.color
        });
      }
    }
  };

  lineAlgorithm();

  console.log(blocks);
  console.log(blocks2);

  const doTheThing = (useTest = false) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', `0 -0.5 ${img.width} ${img.height}`);
    svg.setAttribute('shape-rendering', 'crispEdges');

    const paths: Record<string, string> = {};

    if (useTest) {
      for (const pixel of blocks2) {
        if (pixel.height > 1) {
          if (!paths['f' + pixel.color]) {
            paths['f' + pixel.color] = '';
          }

          paths['f' + pixel.color] += `M${pixel.x} ${pixel.y - 0.5}h${pixel.width}v${pixel.height}H${pixel.x}`;
        } else {
          if (!paths['s' + pixel.color]) {
            paths['s' + pixel.color] = '';
          }

          paths['s' + pixel.color] += `M${pixel.x} ${pixel.y}h${pixel.width}`;
        }
      }
    } else {
      for (const pixel of blocks) {
        if (!paths[pixel.color]) {
          paths[pixel.color] = '';
        }

        paths[pixel.color] += `M${pixel.x} ${pixel.y}h${pixel.width}`;
      }
    }

    for (const [color, pathData] of Object.entries(paths)) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData.trim());

      if (useTest) {
        if (color[0] === 's') {
          path.setAttribute('stroke', color.slice(1));
        } else if (color[0] === 'f') {
          path.setAttribute('fill', color.slice(1));
        }
      } else {
        path.setAttribute('stroke', color);
      }

      svg.appendChild(path);
    }

    return svg;
  };

  function fileSize(str: string) {
    var size = encodeURI(str).split(/%..|./).length - 1;
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return Number((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

  if (method === 0) {
    const thing1 = doTheThing(false);
    const thing2 = doTheThing(true);

    const thing1Txt = thing1.outerHTML.replaceAll('></path>', '/>');
    const thing2Txt = thing2.outerHTML.replaceAll('></path>', '/>');

    console.log(thing1Txt);
    console.log(thing2Txt);

    const item = document.createElement('a');
    item.setAttribute('href', `data:Application/octet-stream,${encodeURIComponent(thing1.outerHTML.replaceAll('></path>', '/>'))}`);
    item.setAttribute('download', `${filename}.svg`);

    const m = new Image();
    m.className = 'down';
    m.src = 'download.png';

    const info = document.createElement('div');
    info.className = 'info';

    if (thing1Txt.length > thing2Txt.length) {
      info.innerHTML = `<p>${filename}.svg</p><p>${fileSize(thing2Txt)}</p>`;
      item.appendChild(thing2);
    } else {
      info.innerHTML = `<p>${filename}.svg</p><p>${fileSize(thing1Txt)}</p>`;
      item.appendChild(thing1);
    }

    item.appendChild(m);
    item.appendChild(info);
    document.getElementById('svgs')?.appendChild(item);
  } else if (method === 1) {
    const thing1 = doTheThing(false);

    const item = document.createElement('a');
    item.setAttribute('href', `data:Application/octet-stream,${encodeURIComponent(thing1.outerHTML.replaceAll('></path>', '/>'))}`);
    item.setAttribute('download', `${filename}.svg`);

    const m = new Image();
    m.className = 'down';
    m.src = 'download.png';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<p>${filename}.svg</p><p>${fileSize(thing1.outerHTML.replaceAll('></path>', '/>'))}</p>`;

    item.appendChild(thing1);
    item.appendChild(m);
    item.appendChild(info);

    document.getElementById('svgs')?.appendChild(item);
  } else {
    const thing1 = doTheThing(true);

    const item = document.createElement('a');
    item.setAttribute('href', `data:Application/octet-stream,${encodeURIComponent(thing1.outerHTML.replaceAll('></path>', '/>'))}`);
    item.setAttribute('download', `${filename}.svg`);

    const m = new Image();
    m.className = 'down';
    m.src = 'download.png';

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<p>${filename}.svg</p><p>${fileSize(thing1.outerHTML.replaceAll('></path>', '/>'))}</p>`;

    item.appendChild(thing1);
    item.appendChild(m);
    item.appendChild(info);

    document.getElementById('svgs')?.appendChild(item);
  }
}

document.getElementById('pixel-png')?.addEventListener('change', (ev: Event) => {
  const files = (ev.target as HTMLInputElement).files;

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const img = new Image();
          img.src = e.target.result as string;

          img.onload = () => {
            convertToSvg(img, files[0].name.replace(/\.png/g, ''));
          };
        }
      };
      reader.readAsDataURL(files[i]);
    }
  }
});

/* 
[
    {
        "x": 0,
        "y": 1,
        "width": 5,
        "height": 1,
        "color": "#ffffff"
    },
    {
        "x": 0,
        "y": 2,
        "width": 1,
        "height": 13,
        "color": "#ffffff"
    },
    {
        "x": 4,
        "y": 2,
        "width": 1,
        "height": 1,
        "color": "#ffffff"
    },
    {
        "x": 0,
        "y": 3,
        "width": 19,
        "height": 1,
        "color": "#ffffff"
    },
    {
        "x": 0,
        "y": 4,
        "width": 1,
        "height": 13,
        "color": "#ffffff"
    },
    {
        "x": 18,
        "y": 4,
        "width": 1,
        "height": 13,
        "color": "#ffffff"
    },
    {
        "x": 0,
        "y": 17,
        "width": 19,
        "height": 1,
        "color": "#ffffff"
    }
]
*/

// const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
// svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
// svg.setAttribute('viewBox', `0 0 19 19`);
// svg.setAttribute('shape-rendering', 'crispEdges');

// const pathS = document.createElementNS('http://www.w3.org/2000/svg', 'path');

// pathS.setAttribute('d', 'M0 1h5M4 2h1M0 3h19M0 17h19');
// pathS.setAttribute('stroke', '#FFFFFF');

// const pathF = document.createElementNS('http://www.w3.org/2000/svg', 'path');

// pathF.setAttribute('d', 'M0 2h1v13H0M0 4h1v13H0M18 4h1v13H18');
// pathF.setAttribute('fill', '#FFFFFF');

// svg.appendChild(pathS);
// svg.appendChild(pathF);

// document.getElementById('svgs')?.appendChild(svg);
