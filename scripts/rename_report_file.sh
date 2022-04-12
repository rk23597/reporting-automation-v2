cd temp
rm -rf ./CSVData.zip
fileName=$(ls);
gzip -d $fileName
fileName=$(ls);
mv $fileName latest.csv