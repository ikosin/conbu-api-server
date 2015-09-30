(function(){
  var config = {
    container: document.getElementById('top-view')
  };
  var heatmapInstance = h337.create(config);
  var _dataPoint = {
    radius: 150,
//    opacity: 1,
    maxOpacity: .9,
    minOpacity: .3,
    blur: 1,
    gradient: {
      '.3': 'blue',
      '.5': 'red',
      '.85': 'white'
    }
  };

  var track_a = [{
      place: "AP-017",
      points: [{x: 700, y: 1320}],
      max: 1000 * 1.0 / 12
    },{
      place: "AP-018",
      points: [{x: 850, y: 1320}]
    },{
      place: "AP-105",
      points: [{x: 570, y: 1440}]
    },{
      place: "AP-107",
      points: [{x: 750, y: 1440}]
    },{
      place: "AP-111",
      points: [{x: 950, y: 1430}]
    },{
      place: "AP-108",
      points: [{x: 700, y: 1520}]
    },{
      place: "AP-110",
      points: [{x: 880, y: 1520}]
    },{
      place: "AP-106",
      points: [{x: 570, y: 1600}]
    },{
      place: "AP-109",
      points: [{x: 750, y: 1600}]
    },{
      place: "AP-112",
      points: [{x: 950, y: 1600}]
    },{
      place: "AP-019",
      points: [{x: 700, y: 1700}]
    },{
      place: "AP-020",
      points: [{x: 850, y: 1700}]
    }];
  var track_b = [{
      place: "AP-010",
      points: [{x: 1090, y: 1130}],
      max: 100 * 1.0 / 3
    },{
      place: "AP-103",
      points: [{x: 1150, y: 1090}]
    },{
      place: "AP-009",
      points: [{x: 1210, y: 1130}]
    }];
  var track_c = [{
      place: "AP-014",
      points: [{x: 1150, y: 2000}],
      max: 122 * 1.0 / 3
    },{
      place: "AP-104",
      points: [{x: 1250, y: 1960}]
    },{
      place: "AP-021",
      points: [{x: 1080, y: 1930}]
    }];
  var track_d = [{
      place: "AP-001",
      points: [{x: 630, y: 350}],
      max: 288 * 1.0 / 4
    },{
      place: "AP-101",
      points: [{x: 800, y: 440}],
    },{
      place: "AP-002",
      points: [{x: 900, y: 350}]
    },{
      place: "AP-023",
      points: [{x: 630, y: 440}]
    }];
  var track_e = [{
      place: "AP-003",
      points: [{x: 630, y: 620}],
      max: 288 * 1.0 / 4
    },{
      place: "AP-102",
      points: [{x: 790, y: 620}]
    },{
      place: "AP-004",
      points: [{x: 900, y: 520}]
    },{
      place: "AP-022",
      points: [{x: 760, y: 520}]
    }];
  var reception_6f = [{
      place: "AP-005",
      points: [{x: 990, y: 390}],
      max: 80 / 2
    },{
      place: "AP-006",
      points: [{x: 990, y: 550}]
    }];
  var reception_7f = [{
      place: "AP-007",
      points: [{x: 1220, y: 1430}],
      max: 80 / 2
    },{
      place: "AP-008",
      points: [{x: 1220, y: 1620}]
    }];
  var lobby_1 = [{
      place: "AP-012",
      points: [{x: 610, y: 1170}],
      max: 80 / 2
    },{
      place: "AP-011",
      points: [{x: 920, y: 1170}]
    }];
  var lobby_2 = [{
      place: "AP-016",
      points: [{x: 610, y: 1890}],
      max: 80 / 2
    },{
      place: "AP-015",
      points: [{x: 920, y: 1890}]
    }];

  var timeline, checkpoints, timer;

  function getDataPoints(strTime, track) {
    var dataPoints = [];
    track.forEach(function(ap) {
      var associations = getAssociations(strTime, ap.place) * (1000 / track[0].max);
      ap.points.forEach(function(point) {
        var clonedDataPoint = (JSON.parse(JSON.stringify(_dataPoint)));
        clonedDataPoint.x = point.x;
        clonedDataPoint.y = point.y;
        clonedDataPoint.value = associations;
        dataPoints.push(clonedDataPoint);
      });
    });
    return dataPoints;
  }

  function getAssociations(strTime, place) {
    var url = "data/associations.json";
    if (timeline === undefined) {
      timeline = JSON.parse(ajax(url, 'GET'));
    }
    if (timeline[strTime] !== undefined && timeline[strTime][place] !== undefined) {
      return timeline[strTime][place]["associations"];
    } else {
      return 0;
    }
  }

  function ajax(url, method) {
    var httpRequest, result;
    if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 6 and older
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
//    httprequest.open('get', "http://api.conbu.net/v1/associations/" + place + "/both", false);
//    httpRequest.open('GET', "http://dev-api.conbu.net/v1/associations/" + place + "/both", false);
    httpRequest.open(method, url, false);
    httpRequest.send();
    if (httpRequest.status === 200) {
      result = httpRequest.responseText;
    } else {
      console.log("api error");
    }
    return result
  }

  function updateTime(strTime) {
    document.getElementById("time").innerHTML = strTime;
  }

  function draw() {
    strTime = checkpoints.shift();

    var dataPoints = [];
    dataPoints = dataPoints.concat(getDataPoints(strTime, track_a));
    dataPoints = dataPoints.concat(getDataPoints(strTime, track_b));
    dataPoints = dataPoints.concat(getDataPoints(strTime, track_c));
    dataPoints = dataPoints.concat(getDataPoints(strTime, track_d));
    dataPoints = dataPoints.concat(getDataPoints(strTime, track_e));
    dataPoints = dataPoints.concat(getDataPoints(strTime, reception_6f));
    dataPoints = dataPoints.concat(getDataPoints(strTime, reception_7f));
    dataPoints = dataPoints.concat(getDataPoints(strTime, lobby_1));
    dataPoints = dataPoints.concat(getDataPoints(strTime, lobby_2));
    var data = {
      max: 1000,
      min: 0,
      data: dataPoints
    };
    heatmapInstance.setData(data);

    updateTime(strTime);

    if (checkpoints.length == 0) {
      clearTimeout(timer)
    } else {
      timer = setTimeout(draw, 500);
    }
  }

  window.onload = function() {
    checkpoints = JSON.parse(ajax("data/checkpoints.json", 'GET'));
    draw();
  };
})();
