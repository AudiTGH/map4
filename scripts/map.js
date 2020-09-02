$(window).on('load', function () {
    var documentSettings = {};
    var completePoints = false;
    var AddColorGroup = false;
    var AddSidesGroup = false;
    var PointLayers = {};
    var overLayers = [];
    var markersLayer = new L.featureGroup(); //layer containing searched elements

    function determineLayers(points) {
        var ColorlayerNames = {};
        var SideslayerNames = {};

        for (var i in points) {
            var point = points[i];
            var ColorName = point.GroupColor;
            ColorlayerNames[ColorName] = {
                Name: ColorName,
                Icon: '<i class="fa fa-file" style="color: ' + point.Color + '">&nbsp;&nbsp;'
            };

            var SideName = point.GroupSides;
            SideslayerNames[SideName] = {
                Name: SideName,
                Icon: '<img src="icons/' + point.Sides + '.png" class="markers-legend-icon">&nbsp;&nbsp;'
            };
        }

        var ColorLegend = getSetting('_ColorLegend');
        if (Object.keys(ColorlayerNames).length > 1) {
            AddColorGroup = true;
            overLayers.push({
                group: '<b>' + ColorLegend + '</b>',
                layers: []
            });
            for (var i in ColorlayerNames) {
                var layerName = ColorlayerNames[i].Name;
                var LayerObj = L.layerGroup();
                PointLayers[layerName] = LayerObj;
                LayerObj.addTo(map);
                overLayers[0].layers.push({
                    name: layerName,
                    icon: ColorlayerNames[i].Icon,
                    layer: LayerObj
                });
            }
        }

        var FormLegend = getSetting('_FormLegend');
        if (Object.keys(SideslayerNames).length > 1) {
            AddSidesGroup = true;
            overLayers.push({
                group: '<b>' + FormLegend + '</b>',
                layers: []
            });
            for (var i in SideslayerNames) {
                var layerName = SideslayerNames[i].Name;
                var LayerObj = L.layerGroup();
                PointLayers[layerName] = LayerObj;
                LayerObj.addTo(map);
                overLayers[1].layers.push({
                    name: layerName,
                    icon: SideslayerNames[i].Icon,
                    layer: LayerObj
                });
            }
        }
    }

    // assign point to layers
    function mapPoints(points) {
        for (var i in points) {
            var point = points[i];
            if (point.Latitude !== '' && point.Longitude !== '' && point['Name'] !== '') {
                var marker = new L.RegularPolygonMarker([point.Latitude, point.Longitude], {
                    numberOfSides: point['Sides'] === '0' || point['Sides'] === '' ? 50 : point['Sides'],
                    weight: 2,
                    color: point['Color'],
                    fillOpacity: 0.5,
                    imageCircleUrl: point['Marker Icon'],
                    radius: point['Radius'] === "" ? 10 : point['Radius'],
                    title: point['Name'],
                });

                marker.bindTooltip(point['Name'], {
                    permanent: false,
                    direction: 'auto'
                });
                marker.bindPopup("<b>" + point['Name'] + '</b><br>' + point['Description']);
                if (AddColorGroup === true) {
                    marker.addTo(PointLayers[point.GroupColor]);
                };
                if (AddSidesGroup === true) {
                    marker.addTo(PointLayers[point.GroupSides]);
                };
                L.marker([point.Latitude, point.Longitude], {
                    title: point['Name'].substring(0, 12)
                }).addTo(markersLayer);
            }
        }

        completePoints = true;
    }

    // Processing of data from the spreadsheet
    function onMapDataLoad(options, points) {
        createDocumentSettings(options);
        document.title = getSetting('_mapTitle');
        // Add point markers to the map
        if (points && points.length > 0) {
            determineLayers(points);
            mapPoints(points);
        } else {
            completePoints = true;
        }

        L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {attribution: 'Map tiles by Stamen Design | Inspired by handsondataviz.org', subdomains: 'abcd', minZoom: 0, maxZoom: 20, ext: 'png'}).addTo(map);
	    
        var panelLayers = new L.Control.PanelLayers(null, overLayers, { title: '<h3>Legend</h3>', });
	    
        map.addControl(panelLayers);

        map.setView(markersLayer.getBounds().getCenter(), map.getBoundsZoom(markersLayer.getBounds()));

        addTitle();

        // Test : Add search
        var controlSearch = new L.Control.Search({ position: 'topleft', layer: markersLayer, initial: true, zoom: 14, marker: false });
        map.addControl(controlSearch);
        map.removeLayer(markersLayer); // sinon les markers "fictifs" deviennent visibles

        // test : Add list markers
        var list = new L.Control.ListMarkers({ layer: markersLayer, itemIcon: null, maxItems: 8, maxZoom: 16 });
        map.addControl(list);

        // When all processing is done, make the map visible
        showMap();

        function showMap() {
            if (completePoints) {$('#map').css('visibility', 'visible');} 
	    else {setTimeout(showMap, 50);}
        }
	    
    }

    // functions ...

    // Adds title and subtitle from the spreadsheet to the map
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

            $('.map-title h3').click(function () {
                location.reload();
            });
        }
    }

    // Returns the value of a setting s
    function getSetting(s) {return documentSettings[constants[s]]; }

    // Returns the value of a setting s or the default value
    function trySetting(s, def) {
        s = getSetting(s);
        if (!s || s.trim() === '') { return def;}
        return s;
    }

	
    //  load of the spreadsheet and map creation

    var parse = function (res) {
        return Papa.parse(Papa.unparse(res[0].values), {
            header: true
        }).data;
    }

    $.getJSON(apiUrl + spreadsheetId + '?key=' + googleApiKey).then(function (data) {
		var sheets = data.sheets.map(function (o) {return o.properties.title})
		if (sheets.length === 0 || !sheets.includes('Options')) {'Could not load data from the Google Sheet'}
        // read 2 sheets: Options and Points
        $.when(
			$.getJSON(apiUrl + spreadsheetId + '/values/Options?key=' + googleApiKey), 
			$.getJSON(apiUrl + spreadsheetId + '/values/Points?key=' + googleApiKey)
		).done(function (options, points) { onMapDataLoad(parse(options), parse(points))})
    });

    // Reformulates documentSettings as a dictionary, e.g.
    function createDocumentSettings(settings) {
        for (var i in settings) {
            var setting = settings[i];
            documentSettings[setting.Setting] = setting.Customize;
        }
    }

});
