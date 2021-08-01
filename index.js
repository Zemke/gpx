const geo = require('geolib');
const fs = require('fs');

const file = process.argv[2];
const target = { lat: parseFloat(process.argv[3]), lon: parseFloat(process.argv[4]) };
const accuracy = 100; // distance accuracy in meters

console.log('reading', file);

const stream = fs.createReadStream(file, { highWaterMark: 16 });
let lonBuffer;
let latBuffer;
let longitudes = [];
let latitudes = [];
let lonRegex = new RegExp("lon=\"(.*?)\"");
let latRegex = new RegExp("lat=\"(.*?)\"");
const interestingNumber = 6; // number of characters in regex not part of the capturing group

stream.on('data', chunk => {
  lonBuffer += chunk.toString();
  latBuffer += chunk.toString();

  const lonRes = bufferEm(lonBuffer, longitudes, lonRegex);
  lonBuffer = lonRes.buffer;
  longitudes = lonRes.bufferArr;

  const latRes = bufferEm(latBuffer, latitudes, latRegex);
  latBuffer = latRes.buffer;
  latitudes = latRes.bufferArr;

  // TODO most recent geopoint where distance didn't increase and return early
});

function bufferEm(buffer, bufferArr, regex) {
  let match = buffer.match(regex)
  while (match != null) {
    const bufferCloneSplit = buffer.slice().split('')
    bufferCloneSplit.splice(0, match.index+match[1].length+interestingNumber-1)
    buffer = bufferCloneSplit.join('')
    bufferArr.push(parseFloat(match[1]))
    match = buffer.match(regex)
  }
  return { buffer, bufferArr }
}

stream.on('end', () => {
  console.log('END')

  console.log("LON")
  console.log(longitudes)
  console.log(longitudes.length)

  console.log("LAT")
  console.log(latitudes)
  console.log(latitudes.length)

  const points = mapEm(latitudes, longitudes)
  console.log("POINTS")
  //console.log(points)
  console.log(points.length)

  console.log('target', target)
  const nearest = geo.findNearest(target, points, accuracy);
  console.log('nearest', nearest, `${nearest.lat}, ${nearest.lon}`);
});

function mapEm(latitudes, longitudes) {
  if (latitudes.length !== longitudes.length) throw Error()
  return latitudes.map((lat, idx) => ({ lat, lon: longitudes[idx] }));
}
stream.on('error', console.error);

