/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Hack.GoogleSpreadSheetSupplier = function(){
    
    proj4.defs("EPSG:3057","+proj=lcc +lat_1=64.25 +lat_2=65.75 +lat_0=65 +lon_0=-19 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    
    var sourceUrl = "https://docs.google.com/spreadsheets/d/1wUSqIQKih1GK3QsiSzCu4g7ZMkgsqV_fNTN5rOg0xgs/pubhtml?gid=0&single=true";
    var query = "select E, F, G, H, I where H <= {{TIME}} and I >= {{TIME}}";
    
    var CallbackHandler = function(externalCallback){
        var __external = externalCallback;
        var formattedData = [];
        this.dataHandler = function(data){
           formattedData = reformat(data);
        };
        
        this.fireChange = function(options){
            __external(
                    new Hack.Repository(
                        'google spread sheet', 
                        formattedData, 
                        undefined, 
                        'www.google.com/thingy')
                    );
        };
    };
    
    this.getDataFor = function(time, callback){
        getData(time, callback);
    };
    
    var getData = function(time, resultCallBack){
        var callBackHandler = new CallbackHandler(resultCallBack);
        $('body').sheetrock({
            url: sourceUrl,
            sql: formatSQL(time),
            dataHandler: callBackHandler.dataHandler,
            userCallback: callBackHandler.fireChange
        });
    };
    
    var formatSQL = function(time){
        return query.replace(/{{TIME}}/g, time);
    };
    
    var reformat = function(data){
        var geoJSON = [];
        data.table.rows.forEach(function(row){
            geoJSON.push(createJSON(row, data));
        });
        return geoJSON;
    };
    
    var createJSON = function(row){
        return {
            "type": 'Feature',
            "geometry": {
                "type": "Point",
                "coordinates": ol.proj.transform([row.c[1].v, row.c[2].v],'EPSG:3057', 'EPSG:3857')
            },
            "properties": {
                "name": row.c[0].v,
                "startDate": row.c[3].v,
                "stopDate": row.c[4].v
            }
        };
    };
};