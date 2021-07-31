const geo = require('geolib');
const fs = require('fs');

const file = process.argv[2];

console.log('reading', file);

const stream = fs.createReadStream(file, { highWaterMark: 16 });
let buffer;
const lonBuffer = [];
const lonRegex = new RegExp("lon=\"(.*?)\"");
const latRegex = new RegExp("lat=\"(.*?)\"");
const interestingNumber = 6; // number of characters in regex not part of the capturing group

stream.on('data', chunk => {
  buffer += chunk.toString();
  let match = buffer.match(lonRegex)
  while (match != null) {
    const bufferCloneSplit = buffer.slice().split('')
    console.log('buffer before', buffer)
    console.log('sub', bufferCloneSplit.join('').substr(0, match.index+match[1].length+interestingNumber))

    bufferCloneSplit.splice(0, match.index+match[1].length+interestingNumber-1)
    buffer = bufferCloneSplit.join('')
    console.log('buffer after', buffer)
    lonBuffer.push(match[1])
    match = buffer.match(lonRegex)
  }
});

stream.on('end', () => {
  console.log('END')
  console.log(lonBuffer)
  console.log(lonBuffer.length)
});

stream.on('error', console.error);

