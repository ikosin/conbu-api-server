(function(){
  var config = {
    container: document.getElementById('top-view')
  };
  var heatmapInstance = h337.create(config);
  var _dataPoint = {
    radius: 130,
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

  var track_1 = [{
      place: "AP-101",
      points: [{x: 940, y: 450}],
      max: 500 * 1.2 / 6
    },{
      place: "AP-102",
      points: [{x: 880, y: 300}]
    },{
      place: "AP-103",
      points: [{x: 930, y: 130}]
    },{
      place: "AP-104",
      points: [{x: 770, y: 290}]
    },{
      place: "AP-105",
      points: [{x: 770, y: 120}]
    },{
      place: "AP-106",
      points: [{x: 770, y: 450}]
    }];
  var track_2 = [{
      place: "AP-009",
      points: [{x: 980, y: 950}],
      max: 400 * 1.2 / 7
    },{
      place: "AP-010",
      points: [{x: 880, y: 770}]
    },{
      place: "AP-011",
      points: [{x: 580, y: 1000}]
    },{
      place: "AP-012",
      points: [{x: 510, y: 910}]
    },{
      place: "AP-013",
      points: [{x: 450, y: 790}]
    },{
      place: "AP-109",
      points: [{x: 770, y: 1000}]
    },{
      place: "AP-110",
      points: [{x: 660, y: 770}]
    }];
  var track_3 = [{
      place: "AP-020",
      points: [{x: 310, y: 1700}],
      max: 220 * 1.3 / 3
    },{
      place: "AP-022",
      points: [{x: 310, y: 1490}]
    },{
      place: "AP-111",
      points: [{x: 490, y: 1700}]
    }];
  var track_4 = [{
      place: "AP-021",
      points: [{x: 740, y: 1700}],
      max: 220 * 1.3 / 3
    },{
      place: "AP-023",
      points: [{x: 740, y: 1490}],
    },{
      place: "AP-112",
      points: [{x: 570, y: 1490}]
    }];
  var foodcoat = [{
      place: "AP-004",
      points: [{x: 120, y: 450}],
      max: 90 / 3
    },{
      place: "AP-006",
      points: [{x: 120, y: 120}]
    },{
      place: "AP-108",
      points: [{x: 120, y: 280}]
    }];
  var sponsor = [{
      place: "AP-001",
      points: [{x: 530, y: 110}],
      max: 45 / 3
    },{
      place: "AP-003",
      points: [{x: 280, y: 450}]
    },{
      place: "AP-005",
      points: [{x: 320, y: 110}]
    }];
  var track_1_entrance = [{
      place: "AP-107",
      points: [{x: 550, y: 300}],
      max: 50 / 1
    }];
  var reception = [{
      place: "AP-002",
      points: [{x: 460, y: 400}],
      max: 30 / 1
    }];
  var lobby_2f = [{
      place: "AP-014",
      points: [{x: 350, y: 910}],
      max: 40 / 2
    },{
      place: "AP-015",
      points: [{x: 190, y: 900}]
    }];
  var lobby_4f = [{
      place: "AP-024",
      points: [{x: 330, y: 1310}],
      max: 45 / 3
    },{
      place: "AP-025",
      points: [{x: 460, y: 1230}]
    },{
      place: "AP-026",
      points: [{x: 530, y: 1330}]
    }];

  function getDataPoints(track) {
    var dataPoints = [];
    track.forEach(function(ap) {
      var associations = getAssociations(ap.place) * (1000 / track[0].max);
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

  function getAssociations(place) {
    var httpRequest;
    var associations;
    if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 6 and older
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    httpRequest.open('GET', "http://api.conbu.net/v1/associations/" + place + "/both", false);
    httpRequest.send();
    if (httpRequest.status === 200) {
      associations = JSON.parse(httpRequest.responseText).associations;
    } else {
      console.log("api error");
    }
    return associations;
  }

  function updateTime() {
    var date = new Date();
    var clock = date.getFullYear() + "-"
        + ("0" + (date.getMonth() + 1)).slice(-2) + "-"
        + ("0" + date.getDate()).slice(-2) + " "
        + ("0" + date.getHours()).slice(-2) + ":"
        + ("0" + date.getMinutes()).slice(-2) + ":"
        + ("0" + date.getSeconds()).slice(-2);
    document.getElementById("time").innerHTML = clock;
  }

  function start() {

    var dataPoints = [];
    dataPoints = dataPoints.concat(getDataPoints(track_1));
    dataPoints = dataPoints.concat(getDataPoints(track_2));
    dataPoints = dataPoints.concat(getDataPoints(track_3));
    dataPoints = dataPoints.concat(getDataPoints(track_4));
    dataPoints = dataPoints.concat(getDataPoints(foodcoat));
    dataPoints = dataPoints.concat(getDataPoints(sponsor));
    dataPoints = dataPoints.concat(getDataPoints(track_1_entrance));
    dataPoints = dataPoints.concat(getDataPoints(reception));
    dataPoints = dataPoints.concat(getDataPoints(lobby_2f));
    dataPoints = dataPoints.concat(getDataPoints(lobby_4f));
    var data = {
      max: 1000,
      min: 0,
      data: dataPoints
    };
    heatmapInstance.setData(data);

    updateTime();

    setTimeout(start, 10000);
  }

  window.onload = function() {
    start();
  };
})();
