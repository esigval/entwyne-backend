# Replace with your MongoDB connection string
$SRC_CONNECTION_STRING="mongodb+srv://devops:GAmkO*4SxgyFhBo8@cluster0.afrmpli.mongodb.net"

# Replace with your new server's MongoDB connection string
$DEST_CONNECTION_STRING="mongodb://devdb:PxaZ4^*^MR7rFe**@twynemedia.cluster-cauzbj835jsz.us-east-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=F:\\MemoryCollectionApp\\global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"

# Replace with the names of the collections you want to transfer
$COLLECTIONS=@("twynes", "storylines", "prompts")

# Specify the path to your MongoDB tools
$MONGO_TOOLS_PATH="F:\MemoryCollectionApp\tools\mongodb-database-tools-windows-x86_64-100.9.4\bin"

# Dump the collections from the source database
foreach ($collection in $COLLECTIONS)
{
  & "$MONGO_TOOLS_PATH\mongodump.exe" --uri=$SRC_CONNECTION_STRING --db=twynemedia --collection=$collection --out=".\mongodump"
}

# Restore the collections to the destination database
& "$MONGO_TOOLS_PATH\mongorestore.exe" --uri=$DEST_CONNECTION_STRING ".\mongodump\twynemedia"

# Clean up the dump files
Remove-Item -Recurse -Force ".\mongodump"

