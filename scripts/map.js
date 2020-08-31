$(window).on('load', function() {
  var documentSettings = {};
  var completePoints = false;
  var AddColorGroup = false;
  var AddSidesGroup = false;
  var PointLayers = {}; 
  var overLayers = [];
  var markersLayer = new L.featureGroup();	//layer contain searched elements

  function determineLayers(points) {
    var ColorlayerNames = {};
    var SideslayerNames = {};
    	
    for (var i in points) {
	  var point = points[i];	
      var ColorName = point.GroupColor;
	  ColorlayerNames[ColorName] = {Name: ColorName, Icon :'<i class="fa fa-file" style="color: '+ point.Color + '">&nbsp;&nbsp;'};
      
	  var SideName = point.GroupSides;
	  SideslayerNames[SideName] = {Name: SideName, Icon :'<img src="icons/' + point.Sides + '.png" class="markers-legend-icon">&nbsp;&nbsp;'};
    } 

    if (Object.keys(ColorlayerNames).length > 1 ) {
		AddColorGroup = true;
		overLayers.push({group: '<b>Colors</b>', layers:[]});
		for (var i in ColorlayerNames) {
		  var layerName = ColorlayerNames[i].Name;
		  var LayerObj = L.layerGroup();
		  PointLayers[layerName] = LayerObj;		  
		  LayerObj.addTo(map);
		  overLayers[0].layers.push({name:layerName ,icon:ColorlayerNames[i].Icon , layer:LayerObj});
		}
	}


	if (Object.keys(SideslayerNames).length > 1 ) {
		AddSidesGroup = true;
		overLayers.push({group: '<b>Sides</b>', layers:[]});
		for (var i in SideslayerNames) {
		  var layerName = SideslayerNames[i].Name;
		  var LayerObj = L.layerGroup();
		  PointLayers[layerName] = LayerObj ;		  
		  LayerObj.addTo(map);
		  overLayers[1].layers.push({name:layerName ,icon:SideslayerNames[i].Icon , layer:LayerObj});
		}
	}		
  }

  // assign point to layers
  function mapPoints(points) {
    for (var i in points) {
      var point = points[i];	  
      if (point.Latitude !== '' && point.Longitude !== '' && point['Name'] !== '') {
        var marker = new L.RegularPolygonMarker([point.Latitude, point.Longitude],
						   {numberOfSides: point['Sides'] === '0' || point['Sides'] === '' ? 50 : point['Sides'] , 
							weight: 2,
							color: point['Color'], 
							fillOpacity: 0.5, 
							imageCircleUrl: point['Marker Icon'], 
							radius: point['Radius']==="" ? 10 : point['Radius'],
							title : point['Name'],
						   }) ;       
        
        marker.bindTooltip(point['Name'],{ permanent: false , direction: 'auto'});
        marker.bindPopup("<b>" + point['Name'] + '</b><br>' + point['Description']);
        if(AddColorGroup===true) {marker.addTo(PointLayers[point.GroupColor]);};
		if(AddSidesGroup===true) {marker.addTo(PointLayers[point.GroupSides]);};
		L.marker([point.Latitude, point.Longitude], {title: point['Name'].substring(0,12)}).addTo(markersLayer);
      }
    }
   
    completePoints = true;
  }


  /**
   * Here all data processing from the spreadsheet happens
   */
  function onMapDataLoad() {
    var options = mapData.sheets(constants.optionsSheetName).elements;
    createDocumentSettings(options);
    document.title = getSetting('_mapTitle');
    // Add point markers to the map
    var points = mapData.sheets(constants.pointsSheetName);
    if (points && points.elements.length > 0) {
      determineLayers(points.elements);
      mapPoints(points.elements);
    } else {
      completePoints = true;
    }
	
 /*	
	var baseMaps = {
           'OSM' : L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: '© OpenStreetMap contributors'}),
	   'OSM Bw' : L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{attribution: '© OpenStreetMap contributors'}),
	   'OSM Topo' : L.tileLayer('//{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {attribution: '© OpenStreetMap contributors. OpenTopoMap.org'}),
           'Stamen' : L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {attribution: 'Map tiles by Stamen Design', subdomains: 'abcd',	minZoom: 0,	maxZoom: 20,ext: 'png'}).addTo(map), 
    }
*/
	// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: '© OpenStreetMap contributors'}).addTo(map);
	L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {attribution: 'Map tiles by Stamen Design', subdomains: 'abcd', minZoom: 0, maxZoom: 20,ext: 'png'}).addTo(map); 
  
	var panelLayers = new L.Control.PanelLayers(null, overLayers, { title: '<h3>Legend</h3>',});
	map.addControl(panelLayers);

    map.setView(markersLayer.getBounds().getCenter(), map.getBoundsZoom(markersLayer.getBounds()));

    addTitle();       

	// test search
	var controlSearch = new L.Control.Search({
		position:'topleft',		
		layer: markersLayer,
		initial: true,
		zoom: 14,
		marker: false
	});
	map.addControl(controlSearch);
	map.removeLayer(markersLayer); // sinon les markers "fictifs" deviennent visibles
	
	// test list markers
	var list = 	 new L.Control.ListMarkers({layer: markersLayer,itemIcon: null , maxItems: 8, maxZoom: 16});
	map.addControl(list);
	
	// test GeoJson
	//alert(getSetting('_geojson1'));
	$.ajax({		
	url: getSetting('_geojson1'),
	dataType: "json",
	success: function(geojson) {
		var layer = L.geoJSON(geojson);
			layer.setStyle({fillColor: 'orange', color: 'red' });
			//Ajout de popup sur chaque objet
			layer.bindPopup(function(layer) {
				return "un commentaire sur la forme : " + layer.feature.properties.nom;
			});		
				//Ajout de la couche sur la carte
				layer.addTo(map);
			},		
			//echec
			error: function() {
				// alert("Erreur lors du téléchargement !");
			}      
		});
	
	
	
	

    // When all processing is done, hide the loader and make the map visible
    showMap();
    
    function showMap() {
      if (completePoints ) {
		$('#map').css('visibility', 'visible');
      } else {
        setTimeout(showMap, 50);
      }
    }
  }

  /**
   * Adds title and subtitle from the spreadsheet to the map
   */
  function addTitle() {
    var dispTitle = getSetting('_mapTitleDisplay');

    if (dispTitle !== 'off') {
      var title = '<h3 class="pointer">' + getSetting('_mapTitle') + '</h3>';
      var subtitle = '<h5>' + getSetting('_mapSubtitle') + '</h5>';

      if (dispTitle == 'topleft') {
        $('div.leaflet-top').prepend('<div class="map-title leaflet-bar leaflet-control leaflet-control-custom">' + title + subtitle + '</div>');
      } else if (dispTitle == 'topcenter') {
        $('#map').append('<div class="div-center"></div>');
        $('.div-center').append('<div class="map-title leaflet-bar leaflet-control leaflet-control-custom">' + title + subtitle + '</div>');
      }

      $('.map-title h3').click(function() { location.reload(); });
    }
  }



  /**
   * Returns the value of a setting s
   * getSetting(s) is equivalent to documentSettings[constants.s]
   */
  function getSetting(s) {
    return documentSettings[constants[s]];
  }


  /**
   * Returns the value of setting named s from constants.js
   * or def if setting is either not set or does not exist
   * Both arguments are strings
   * e.g. trySetting('_authorName', 'No Author')
   */
  function trySetting(s, def) {
    s = getSetting(s);
    if (!s || s.trim() === '') { return def; }
    return s;
  }



  /**
   * Triggers the load of the spreadsheet and map creation
   */
             var parse = function(res) {
            return Papa.parse(Papa.unparse(res[0].values), {header: true} ).data;
          }

          var apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/'
          var spreadsheetId = googleDocURL.indexOf('/d/') > 0
            ? googleDocURL.split('/d/')[1].split('/')[0]
            : googleDocURL

          $.getJSON(
            apiUrl + spreadsheetId + '?key=' + googleApiKey
          ).then(function(data) {
              var sheets = data.sheets.map(function(o) { return o.properties.title })

              if (sheets.length === 0 || !sheets.includes('Options')) {
                'Could not load data from the Google Sheet'
              }

              // read 2 sheets: Options and Points
              $.when(
                $.getJSON(apiUrl + spreadsheetId + '/values/Options?key=' + googleApiKey),
                $.getJSON(apiUrl + spreadsheetId + '/values/Points?key=' + googleApiKey),
           
              ).done(function(options, points) {
				onMapDataLoad(
                      parse(options),
                      parse(points)
            
                    )

              })
              
            }
          )

	
	
	
	

  /**
   * Reformulates documentSettings as a dictionary, e.g.
   * {"webpageTitle": "Leaflet Boilerplate", "infoPopupText": "Stuff"}
   */
  function createDocumentSettings(settings) {
    for (var i in settings) {
      var setting = settings[i];
      documentSettings[setting.Setting] = setting.Customize;
    }
  }

  
  

});
