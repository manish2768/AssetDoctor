const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a valid solid dark-teal (#0f172a) PNG image with a embedded shield graphic marker
function generatePNG(width, height) {
  // Color: #0f172a (r: 15, g: 23, b: 42, a: 255)
  // Teal Shield Center: #10b981 (r: 16, g: 185, b: 129, a: 255)
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if pixel is inside central shield logo area
      const isShieldArea = (Math.abs(dx) < radius * 0.7 && Math.abs(dy) < radius * 0.7) && 
                           (y < cy + radius * 0.6) && (Math.abs(dx) * 1.2 + (y - cy) < radius * 0.9);

      const isEmeraldCross = (Math.abs(dx) < radius * 0.18 && Math.abs(dy) < radius * 0.45) ||
                             (Math.abs(dx) < radius * 0.45 && Math.abs(dy) < radius * 0.18);

      if (isEmeraldCross) {
        // Emerald Green #10b981
        rawData[pxOffset] = 16;
        rawData[pxOffset + 1] = 185;
        rawData[pxOffset + 2] = 129;
        rawData[pxOffset + 3] = 255;
      } else if (isShieldArea || dist < radius) {
        // Dark Cyan Accent #06b6d4
        rawData[pxOffset] = 6;
        rawData[pxOffset + 1] = 182;
        rawData[pxOffset + 2] = 212;
        rawData[pxOffset + 3] = 255;
      } else {
        // Dark Slate Theme Background #0f172a
        rawData[pxOffset] = 15;
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type 6 (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
  buf.writeInt32BE(crc, 8 + len);
  return buf;
}

// CRC32 implementation
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      let bit = (byte ^ crc) & 1;
      crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
      byte >>>= 1;
    }
  }
  return (crc ^ -1);
}

const pubDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pubDir, 'icon-192.png'), generatePNG(192, 192));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), generatePNG(512, 512));

console.log('Successfully generated public/icon-192.png and public/icon-512.png!');
