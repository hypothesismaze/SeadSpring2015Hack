/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Hack.TDARSupplier = function(){
    
    var searchURL = 'http://core.tdar.org/search/rss?';
    var parameters = 
            '_tdar.searchType=advanced&groups[0].operator=AND'
            + '&groups[0].latitudeLongitudeBoxes[0].maximumLongitude=22.763671875' 
            + '&groups[0].latitudeLongitudeBoxes[0].minimumLatitude=56.84897198026978' 
            + '&groups[0].latitudeLongitudeBoxes[0].minimumLongitude=-76.728515625' 
            + '&groups[0].latitudeLongitudeBoxes[0].maximumLatitude=70.14036427207172' 
            + '&sortField=RELEVANCE' + 
            + '&=Search';
    
    this.getDataFor = function(time, callback){
        $.ajax({
            url: searchURL + encodeURIComponent(parameters),
            dataType: 'xml',
            type: 'GET',
            beforeSend: setHeader,
            success: function(rssData){
                console.log('yay');
                callback(parseRSS(rssData));
            },
            error: function(err){
                console.log('NOOO');
                console.log(err);}
        });
    };
    
    var setHeader = function(xhr){
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    };
    
    var parseRSS = function(responseData){
        console.log(responseData);
    };
};
