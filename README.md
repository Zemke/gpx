# Split GPX file into multiple GPX files along checkpoints

This script allows you to take one large GPX file and pass it any number of geo points
at which the GPX file is split resulting in multiple GPX files.

## Usage

Assuming you have a GPX file `all.gpx` containing the whole Weser-Radweg and
a `targets.txt` containing a list of geo points where for instance your campgrounds are.

Example `targets.txt` where each line is the latitude/longitude geo point of where
to split the GPX file.

```txt
51.64477103651391 9.446645230506876
52.109372247820104 9.348323173566138
52.510299 9.079769
53.114239 8.833046
53.731154 8.528058
```

Run this command passing first the whole GPX file and the file with line-separated geo points:

```console
node index.js ~Desktop/weser/all.gpx targets.txt Weser
```

In a directory `stages` six GPX files have been written representing each segment. \
The use case could be that each of this segment represents a day from campground to campground
on your multi-day bicycle road trip.

🚲

