const geo = require('geolib');
const fs = require('fs');
const template = require('./template');

const file = process.argv[2];
const name = process.argv[4]
const filename = name.toLowerCase().replaceAll(/[^a-z0-9-_]/ig, '_');
const targets = fs.readFileSync(process.argv[3], 'utf8')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => {
      const [ lat, lon ] = l.split(' ')
      return { lat, lon };
    });

const accuracy = 1; // distance accuracy in meters

console.log('reading', file);
console.log('targets', targets);

const argReverse = process.argv.includes('--reverse');

const argStartIdx = process.argv.findIndex(a => a === '--start');
const argStart = argStartIdx === -1
    ? null : process.argv[argStartIdx+1].split(",");

const stream = fs.createReadStream(file, { highWaterMark: 16 });
let lonBuffer;
let latBuffer;
let longitudes = []; // TODO remember elevation
let latitudes = []; // TODO remember elevation
let lonRegex = new RegExp("(?:\\s|^)lon=\"(.*?)\"");
let latRegex = new RegExp("(?:\\s|^)lat=\"(.*?)\"");
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

  if (argReverse) {
    longitudes.reverse();
    latitudes.reverse();
    console.log('reversed');
  }

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

  if (argStart != null) {
    const [startLat, startLon] = argStart;
    const startNearest = geo.findNearest(
        {lat: startLat, lon: startLon}, points, accuracy);
    console.log(`start set to ${startLat},${startLon}`
        + ` nearest is ${startNearest}`);
    const startIdx = points.findIndex(
        p => p.lat === startNearest.lat && p.lon === startNearest.lon);
    points.unshift(...points.splice(startIdx));
  }

  fs.mkdirSync('./stages')

  let stage = 1;
  let pointIdx = 0;
  for (let targetIdx = 0; targetIdx <= targets.length; targetIdx++) {
    const target = targetIdx < targets.length
      ? targets[targetIdx]
      : points[points.length-1];
    console.log('target', target, `${target.lat}, ${target.lon}`)

    const nearest = geo.findNearest(target, points.slice(pointIdx+1), accuracy);
    console.log('nearest', nearest, `${nearest.lat}, ${nearest.lon}`);


    const writeStream = fs.createWriteStream(`./stages/${filename}_${stage}.gpx`);
    writeStream.write(template.start(name, stage), 'utf8')
    if (targetIdx !== 0) {
      writeStream.write(template.point(targets[targetIdx-1]));
    }
    for (; pointIdx < points.length; pointIdx++) {
      const geopoint = points[pointIdx];
      writeStream.write(template.point(geopoint), 'utf8')
      if (geopoint.lat === nearest.lat && geopoint.lon === nearest.lon) {
        break;
      }
    }
    writeStream.write(template.point(target));
    writeStream.write(template.end(), 'utf8')
    writeStream.end()
    stage++
  }
});

function mapEm(latitudes, longitudes) {
  if (latitudes.length !== longitudes.length) throw Error()
  return latitudes.map((lat, idx) => ({ lat, lon: longitudes[idx] }));
}

stream.on('error', console.error);

