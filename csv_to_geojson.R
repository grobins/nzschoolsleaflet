#Write geojson
#====

#Load libraries
library(rgdal)
require(dplyr)

#dataMap is a dataframe with coordinates on cols 11 (LATITUDE) and 12 (LONGITUDE)
#Transfor coordinates to numeric

schools <- data.table::fread('c:/sources/schoolmap/data/directory-school-current.csv', header=T, sep=',')
schools.min <- schools[, c('Name', 'Longitude', 'Latitude', 'Decile', 'Total School Roll', 'European/ Pakeha', 'Maori', 'Pasifika', 'Asian', 'MELAA', 'Other', 'International Students'), with=F]
schools.min <- as.data.frame(schools.min)
schools.min <- schools.min %>% filter(!is.na(Longitude) | !is.na(Latitude))
schools.min <- schools.min %>% filter(Longitude > 170)
schools.sp <- SpatialPointsDataFrame(schools.min[,c(2, 3)],schools.min[,-c(2, 3)])
str(schools.sp) # Now is class SpatialPointsDataFrame


#Write as geojson
writeOGR(schools.sp, 'c:/sources/schoolmap/data/schools.geojson','dataMap', driver='GeoJSON')

