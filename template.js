function start(name, stage) {
  const s = stage != null ? ` ${stage}` : '';
  return `<?xml version='1.0' encoding='UTF-8'?>
<gpx version="1.1" creator="https://zemke.io" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${name}${s}</name>
    <author>
      <link href="https://gpx.zemke.io">
        <text>Florian Zemke</text>
        <type>text/html</type>
      </link>
    </author>
  </metadata>
  <trk>
    <name>${name}${s}</name>
    <trkseg>
`
}

function point(geopoint, time) {
  elevation = geopoint.ele== null && process.env.ELE_0 === '1' ? 0 : geopoint.ele;
  const indent = "      ";
  let str = indent + "";
  str += `<trkpt lat="${geopoint.lat}" lon="${geopoint.lon}">\n`
  if (elevation != null) str += `${indent}   <ele>${elevation}</ele>\n`
  if (time != null) str += `${indent}   <time>${time}</time>\n`
  str += `${indent}</trkpt>\n`
  return str;
}

function end() {
  return `   </trkseg>
  </trk>
</gpx>
  `
}

module.exports = { start, point, end };

