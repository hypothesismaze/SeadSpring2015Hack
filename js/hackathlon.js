
var Hack = function(mapTarget){
    
   var mapManager = new Hack.MapPosition(
        new ol.Map({
            target: mapTarget,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'sat'})
                })
            ]
        })      
   );
   
   var datasuppliers = [];
      
   this.init = function(){
       
       mapManager.setView(new ol.View({
          //center: ol.proj.transform([64.253,-20.402], 'EPSG:4326', 'EPSG:3857'),
          center: [-2035059.44, 9627396.59],
          zoom: 4
        }));
        
        datasuppliers.push(new Hack.GoogleSpreadSheetSupplier());
        datasuppliers.push(new Hack.FileDataSupplier());
   };
   
   this.search = function(time){
        datasuppliers.forEach(function(supplier){
            supplier.getDataFor(time, searchResultPresenter);
        });
   };
   
   var searchResultPresenter = function(searchResult){
       mapManager.setPositionsOnMap(searchResult);
   };
};

Hack.Repository = function(repositoryName, geoJSonFeatures, projection, url){
    
    var getDefaultDefinition = function(projection){
        return {
          'type': 'name',
          'properties': {
            'name': projection
          }
        };
    };
    
    this.repositoryName = repositoryName;
    this.geometries = geoJSonFeatures;
    this.featureDefinition = projection === undefined ? getDefaultDefinition('EPSG:3857') : getDefaultDefinition(projection);
    this.repositoryURL = url;
};

Hack.MapPosition = function(map){
  
    var curMap = map;
    var curPositionLayer = {};
    var mapPopup = new Hack.Popup();
    curMap.addOverlay(mapPopup.popupOverlay);
    
    var selectInteraction = new ol.interaction.Select();
    map.addInteraction(selectInteraction);
    selectInteraction.on('select', function(event){
        selectInteraction.getFeatures().forEach(function(feature){
           mapPopup.open(feature);
        });
    });
    
    this.setView = function(view){
        curMap.setView(view);
    };
    
    this.setPositionsOnMap = function(searchResults){
       
       if($.isEmptyObject(searchResults) || $.isEmptyObject(searchResults.geometries)){
           deleteLayerIfExists(searchResults.repositoryName);
           return;
       }
       
       var vectorFromResults = new ol.source.GeoJSON({
           'object': {
            'type': 'FeatureCollection',
            'crs': searchResults.featureDefinition,
            'features': searchResults.geometries
            }
        });
        
        var resultLayer = new ol.layer.Vector({
           source: vectorFromResults
        });
        
        deleteLayerIfExists(searchResults.repositoryName, resultLayer);
        curMap.addLayer(resultLayer);
    };
    
    var deleteLayerIfExists = function(repositoryName, layer){
        if(!$.isEmptyObject(curPositionLayer[repositoryName])){
           curMap.removeLayer(curPositionLayer[repositoryName]);
           if(layer === undefined){
               delete curPositionLayer[repositoryName];
           }
        }
        if(layer !== undefined){
            curPositionLayer[repositoryName] = layer;
        }
    };
};

Hack.Popup = function(){

   var self = this;
   var dialogContent = '<div id="dialog" style="background-color: yellow"><div id="feature_data"></div>' + 
            '<div class="navbar"><a id="close" href="#">Close</a></div></div>';
    
    var FEATURE_TEMPLATE_URL = "<div>" + 
            'Name: <a href="{{URL}}">{{NAME}}</a>' + 
            '</div>';
    
    var popup = $($.parseHTML(dialogContent));
    popup.find('#close').on('click', function(event){
        event.preventDefault();
        self.popupOverlay.setPosition(undefined);
        return false;
    });
    popup.appendTo('body');

    this.popupOverlay = new ol.Overlay({
       element: popup 
    });
    
    this.open = function(feature){
        var html = applyTemplate(feature.getProperties());
        popup.find('#feature_data').html(html);
        this.popupOverlay.setPosition(getPosition(feature));
    };
    
    var applyTemplate = function(properties){
        var html = FEATURE_TEMPLATE_URL
                .replace(/{{NAME}}/, properties["name"])
                .replace(/{{URL}}/, properties["url"] || '#');
        return html;
    };
    
    var getPosition = function(feature){
        var extent = feature.getGeometry().getExtent();
        return [extent[0], extent[1]];
    };
};