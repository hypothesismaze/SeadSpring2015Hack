/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Hack.FileDataSupplier = function () {

    this.getDataFor = function(time, callback) {
        callback(new Hack.Repository(
            'File', 
            searchForContainer(time), 
            undefined,
            'www.google.com'));
    };
    
    var searchForContainer = function(time){
        var results = [];
        File_Repository.forEach(function(geoJSON){
            if( time >= geoJSON.properties["startDate"] && 
               time <= geoJSON.properties["stopDate"] ){
               results.push(geoJSON);
            }
        });
        return results;
    };
    
    //-2035059.44	9627396.59

    var File_Repository = [
        {
            "type": "Feature", 
            "geometry": {
                "type": "Point", 
                "coordinates": [-2034000.44, 9625000.59]
            },
            "properties": {
                "name": "site 1", 
                "startDate": 1000, 
                "stopDate": 1200
            }
        },
        {
            "type": "Feature", 
            "geometry": {
                "type": "Point", 
                "coordinates": [-2020435, 9628000]
            }, 
            "properties": {
                "name": "site 2", 
                "startDate": 1066, 
                "stopDate": 1145,
                "url": 'www.google.com'
            }
        },
        {
            "type": "Feature", 
            "geometry": {
                "type": "Point", 
                "coordinates": [-2020200, 9628231]
            }, 
            "properties": {
                "name": "site 3", 
                "startDate": 900, 
                "stopDate": 1201,
                "url": 'www.yahoo.com'
            }
        }
    ];
};
