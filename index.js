const geo = require('geolib');
const fs = require('fs');

const file = process.argv[2];

console.log('reading', file);

const stream = fs.createReadStream(file, { highWaterMark: 16 });
let lonBuffer;
let latBuffer;
let lonBufferArr = [];
let latBufferArr = [];
let lonRegex = new RegExp("lon=\"(.*?)\"");
let latRegex = new RegExp("lat=\"(.*?)\"");
const interestingNumber = 6; // number of characters in regex not part of the capturing group

stream.on('data', chunk => {
  lonBuffer += chunk.toString();
  latBuffer += chunk.toString();

  const lonRes = bufferEm(lonBuffer, lonBufferArr, lonRegex);
  lonBuffer = lonRes.buffer;
  lonBufferArr = lonRes.bufferArr;

  const latRes = bufferEm(latBuffer, latBufferArr, latRegex);
  latBuffer = latRes.buffer;
  latBufferArr = latRes.bufferArr;
});

function bufferEm(buffer, bufferArr, regex) {
  let match = buffer.match(regex)
  while (match != null) {
    const bufferCloneSplit = buffer.slice().split('')
    bufferCloneSplit.splice(0, match.index+match[1].length+interestingNumber-1)
    buffer = bufferCloneSplit.join('')
    bufferArr.push(match[1])
    match = buffer.match(regex)
  }
  return { buffer, bufferArr }
}

stream.on('end', () => {
  console.log('END')

  console.log("LON")
  console.log(lonBufferArr)
  console.log(lonBufferArr.length)

  console.log("LAT")
  console.log(lonBufferArr)
  console.log(lonBufferArr.length)
});

stream.on('error', console.error);

