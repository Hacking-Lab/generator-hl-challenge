#!/command/with-contentenv bash
# Use this script to write / replace the goldnugget to the correct place.
# The goldnugget is available as $GOLDNUGGET.

FLAG=$(echo $GOLDNUGGET )
# sed initial_FLAG to FLAG in flag.c
sed -i "s/initial_flag/$FLAG/g" /src/flag.c

#add flag to flag.txt

echo $FLAG > /src/flag.txt

# Compiling binary from source ( replace the binary with the one from the challenge - /src/binary.c)
cd /src
exec gcc /src/binary.c /src/flag.c -o /web/binary -lseccomp 

#Make tar and Copy the compile binary to the /opt/www/server folder