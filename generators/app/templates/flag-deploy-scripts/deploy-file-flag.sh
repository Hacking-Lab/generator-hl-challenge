#!/command/with-contentenv bash
# Use this script to copy the goldnugget file to the correct place.
# You can find it under /goldnugget/<%= uuid %>.gn

echo "put your commands to deploy the file based flag here"
echo "the /goldnugget/*.gn contains the flag"

GN_FILE=$(ls /goldnugget/*.gn)
source $GN_FILE

echo "extend this script and move $GOLDNUGGET to the destination you want"

# for example
# echo $GOLDNGGET > /flag.txt
# chmod 644 /flag.txt


