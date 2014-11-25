var CONST = {};
CONST.verticalMargin = 50;
CONST.verticalStartOffsetX = 50;
CONST.verticalEndOffsetX = 400;

CONST.horizontalMargin = 150;
CONST.horizontalStartOffsetY = 50;
CONST.horizontalEndOffsetY = 400;

var paper;
var initDrawLine = function (srcImgObjArray, destImgObjArray) {

  var canvas = document.getElementById('canvas');
  // 캔버스 초기
  if (canvas.childNodes[0]) {
    console.log("remove old child");
    canvas.removeChild(canvas.childNodes[0]);  
  }
  console.log("TYPE : " + type);

  paper = Raphael('canvas', 1000, 600);

  var srcImgs = {}, destImgs = {};
  if (type === 'horizontal') {
    // 가로 줄
    for (i = 0, j = srcImgObjArray.length; i < j; i++) {
      var imgId = srcImgObjArray[i].id;
      if (i == 0) {
        srcImgs[imgId] = paper.image(srcImgObjArray[i].url, CONST.verticalStartOffsetX, CONST.verticalMargin, srcImgObjArray[i].width, srcImgObjArray[i].height);  
      } else {
        var offsetTop = (CONST.verticalMargin * (i + 1)) + (srcImgObjArray[i].height * i);
        console.log(imgId + '\'s src top : ' + offsetTop);
        srcImgs[imgId] = paper.image(srcImgObjArray[i].url, CONST.verticalStartOffsetX, offsetTop, srcImgObjArray[i].width, srcImgObjArray[i].height);  
     
      }
      srcImgs[imgId][0].id = imgId;
    }

    for (i = 0, j = destImgObjArray.length; i < j; i++) {
      var imgId = destImgObjArray[i].id;
      if (i == 0) { 
        destImgs[imgId] = paper.image(destImgObjArray[i].url, CONST.verticalEndOffsetX, CONST.verticalMargin, destImgObjArray[i].width, destImgObjArray[i].height)  
      } else {
        var offsetTop = (CONST.verticalMargin * (i + 1)) + (destImgObjArray[i].height * i);
        console.log(imgId + '\'s dest top : ' + offsetTop);
        destImgs[imgId] = paper.image(destImgObjArray[i].url, CONST.verticalEndOffsetX, offsetTop, destImgObjArray[i].width, destImgObjArray[i].height);           
      }
      destImgs[imgId][0].id = imgId;
    }

  } else if (type === 'vertical') {
    for (i = 0, j = srcImgObjArray.length; i < j; i++) {
      var imgId = srcImgObjArray[i].id;
      if (i == 0) {
        srcImgs[imgId] = paper.image(srcImgObjArray[i].url, CONST.horizontalMargin, CONST.horizontalStartOffsetY, srcImgObjArray[i].width, srcImgObjArray[i].height);  
      } else {
        
        var offsetLeft = (CONST.horizontalMargin * (i + 1)) + (srcImgObjArray[i].width * i);
        console.log(imgId + '\'s src left : ' + offsetLeft);
        srcImgs[imgId] = paper.image(srcImgObjArray[i].url, offsetLeft, CONST.horizontalStartOffsetY, srcImgObjArray[i].width, srcImgObjArray[i].height);  
      }
      srcImgs[imgId][0].id = imgId;
    }

    for (i = 0, j = destImgObjArray.length; i < j; i++) {
      var imgId = destImgObjArray[i].id;
      if (i == 0) {
        destImgs[imgId] = paper.image(destImgObjArray[i].url, CONST.horizontalMargin, CONST.horizontalEndOffsetY, destImgObjArray[i].width, destImgObjArray[i].height)  
        
      } else {
        var offsetLeft = (CONST.horizontalMargin * (i + 1)) + (destImgObjArray[i].width * i);
        console.log(imgId + '\'s src left : ' + offsetLeft); 
        destImgs[imgId] = paper.image(destImgObjArray[i].url, offsetLeft, CONST.horizontalEndOffsetY, destImgObjArray[i].width, destImgObjArray[i].height);
      }
      destImgs[imgId][0].id = imgId;
    }
  }

  initDrawLineEvent(srcImgs, destImgs);
}

function initDrawLineEvent(srcImgs, destImgs) {
  for (var objId in srcImgs) {
    (function (img, objId) {
      img[0].onmousedown = function() {
        if (pointObj.endItem) {
          pointObj.startItem = img;
          drawLine(pointObj);
          pointObj = {};
        } else {
          img.transform("s1.2");
          pointObj.startItem = img;  
        }
      };
      img[0].onmouseover = function() {
        img.attr('opacity', 0.5);
      };
      img[0].onmouseout = function() {
        img.attr('opacity', 1,0);
      };

    })(srcImgs[objId], objId);
  }

  for (var objId in destImgs) {
    (function (img, objId) {

      img[0].onmousedown = function() {
        if (pointObj.startItem) {
          pointObj.endItem = img;
          drawLine(pointObj);
          pointObj = {};
        } else {
          img.transform("s1.2");
          pointObj.endItem = img;
        }
      };

      img[0].onmouseover = function() {
        img.attr('opacity', 0.5);
      };
      img[0].onmouseout = function() {ddddddd
        img.attr('opacity', 1,0);
      };
    })(destImgs[objId], objId);
  }
}

// 선을 그림
function drawLine(obj) {
  if (obj) {

    // 이전에 저장한 선이 있다면 삭제
    if (userAnswer[obj.startItem[0].id] && obj.endItem[0].id !== userAnswer[obj.startItem[0].id]) {
      var l = lineObj[obj.startItem[0].id];
      l.remove();
      userAnswer[obj.startItem[0].id] = '';

    }

    // 선긋기
    // path에 시작점과 끝점을 선
    // raphael obj의 값을 접근할 때에는 baseVal.value로 값을 가져와야 함.
    var startX, startY, endX, endY;
    if (type === 'horizontal') {
      startX = obj.startItem[0].x.baseVal.value + obj.startItem[0].width.baseVal.value + 10;
      startY = obj.startItem[0].y.baseVal.value + (obj.startItem[0].height.baseVal.value / 2);
      endX = obj.endItem[0].x.baseVal.value - 10;
      endY = obj.endItem[0].y.baseVal.value + (obj.endItem[0].height.baseVal.value / 2);  
    } else if (type === 'vertical') {
      startX = obj.startItem[0].x.baseVal.value + (obj.startItem[0].width.baseVal.value / 2);
      startY = obj.startItem[0].y.baseVal.value + obj.startItem[0].height.baseVal.value + 10;
      endX = obj.endItem[0].x.baseVal.value + (obj.endItem[0].width.baseVal.value / 2);
      endY = obj.endItem[0].y.baseVal.value - 10;
    }
    

    var path = "M" + startX + "," + startY + "L" + endX + "," + endY;
    console.log("path : " + path);
    var line = paper.path([path]);

    // 사용자 answer 저장
    lastAnswerSourceId = obj.startItem[0].id;
    userAnswer[lastAnswerSourceId] = obj.endItem[0].id;
    restoreItemState(obj);
    lineObj[lastAnswerSourceId] = line;
    console.log('User Answer : ' + JSON.stringify(userAnswer));

    // 초기화
    pointObj = {};
  }
}

function restoreItemState(obj) {
  // transform 초기화
  if (obj.startItem) obj.startItem.transform("");
  if (obj.endItem) obj.endItem.transform("");
}