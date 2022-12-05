#!/usr/bin/with-contenv bash
# Use this script to write / replace the goldnugget to the correct place.
# The goldnugget is available as $GOLDNUGGET.

FLAG=$(echo $GOLDNUGGET )

#add flag to flag.txt

echo $FLAG > /src/flag.txt

