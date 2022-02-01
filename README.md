Split GPX track at pre-defined geopoints, set start and direction of track.

## Usage

```console
node index.js hohe-mark-route.gpx targets.txt "Hohe Mark" --reverse --start 51.827551,7.282159
```

`hohe-mark-route.gpx` is a single GPX track that you want to split. \
Supply `--reverse` if you want the direction to be reserved.a \
Supply `--start` along with a starting geo coordinate to let the route start there
(useful for round trips).

You may set environment variable `ELE_0=1` to default elevations to 0. At the moment elevation
is ignored entirely.

## Use Case

You want to go on a multi-day bike trip and for every day you want to know your route from
the place where you stayed for the night back to the route and then to your next place.

The original route is followed until a point is reached where you're closest to your next
destination. From there a straight line is drawn to that place. \
You'll therefore get a GPX track for every day of your trip.

Here's an example of the whole route and the individual days split from it.

## TODO

- include elevation dat
- show ascend, descend, distance for every segment
- web interface with visualizations

🚲

