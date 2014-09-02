var lectureAlarm = "lectureAlarm";
var displayAlarm = "displayAlarm";
var periodTime = 2; // period time in minute

//chrome.notifications.create("newLecture", {type: "basic", title: "test"}, function(id){});

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg.flag) {
      if (msg.flag == "start") {
        startMonitoring();
      } else if (msg.flag == "stop") {
        stopMonitoring();
      }
    }
  }
);
 // You must use addListener each time the event page loads
chrome.alarms.onAlarm.addListener(doMonitor);

function alarmHandler(alarm) {
  if (alarm.name == lectureAlarm) {
    doMonitor();
  } else {
    
  }
}

function showNotification(title, message, delay) {
  var notification =  webkitNotifications.createNotification(
      null, title, message);
  notification.show();
  var timeout = delay || 50000;
  setTimeout(notification.cancel, timeout);
}

function startMonitoring() {
  getSourceUrl();
}

function stopMonitoring() {
  chrome.alarms.clear(lectureAlarm);
  showNotification("结束", "已经停止监控");
}

// 通过分析左边栏菜单获取源url地址
function getSourceUrl() {
  var leftMenu = "http://graduate.buct.edu.cn:8080/pyxx/leftmenu.aspx";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", leftMenu, true);
  xhr.onreadystatechange = function() {
    // 4数据已接收完毕，200一切正常
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var parser = new DOMParser();
        var xmlMenu = parser.parseFromString(xhr.responseText, 'text/html');
        var sourceUrl = $('a:contains(学术报告（活动）报名)', xmlMenu).attr('href');
        if (typeof sourceUrl !== "undefined") {
          // set方法的回调函数可省略
          chrome.storage.local.set({lectureUrl : sourceUrl}, function() {
            //var tID = setInterval(doMonitor, 30000);
            //chrome.storage.local.set({timerID : tID});
            //showNotification("ks", "after setURL" + sourceUrl);
            var alarmInfo = {
              // Time at which the alarm should fire, 
              // in milliseconds past the epoch (e.g. Date.now() + n)
              // when : 1000, 
            
              // Length of time in minutes after which the onAlarm event should fire
              // The initial time must be specified by either when or delayInMinutes (but not both)
              delayInMinutes : 1,
            
              // The onAlarm event should fire every periodInMinutes minutes 
              // after the initial event specified by when or delayInMinutes. 
              // If not set, the alarm will only fire once
              // at least 1 minute
              periodInMinutes : periodTime
            };
            chrome.alarms.create(lectureAlarm, alarmInfo);
            showNotification("启动", "已经开始监控");
          });
        }
      } else {
        chrome.browserAction.setBadgeText({text : "!"});
        showNotification("错误", "无法获取信息，请登录后重试");
      }// status 
    } // readyState
  };  // function
  xhr.send(null);
}

function doMonitor() {
  // get后必须有回调函数
  var url = chrome.storage.local.get("lectureUrl", function(items) {
    var url = items.lectureUrl;
    if (url) {
      checkLectureList(url);
    }
  });
}

// 获取当前报告列表以及源地址，并存储
function checkLectureList(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var parser = new DOMParser();
      var xmlLecture = parser.parseFromString(xhr.responseText, 'text/html');
      // 获取所有讲座列表
      var list = $('#dgData0 tr', xmlLecture);
      var lectureArray = [];
      for (var i = 1; i < list.length; i++) {
        // 获取讲座名
        var lectureName = $('td:eq(1)', list[i]).text();
        lectureArray.push(lectureName);
      }
      chrome.storage.local.get("lectureArray", function(items) {
        if (typeof items.lectureArray === "undefined") {
          chrome.storage.local.set({"lectureArray" : lectureArray});
        } else {
          compareList(lectureArray, items.lectureArray);
        }  
      });
    } // readyState
  };
  xhr.send(null);
}

function compareList(newList, oldList) {
  var i, j;
  for (i = 0; i < newList.length; i++) {
    for (j = 0; j < oldList.length; j++) {
      if (newList[i] === oldList[j]) break;  
    }
    if (i != newList.length - 1 && j == oldList.length - 1) {
    //if (j == oldList.length - 1) {
      //var msg = {
        //type: "basic",
        //title: "发现新的讲座",
        //message: newList[i]
      //}
      //chrome.notifications.create("newLecture", opt, function(notificationId) {});
      showNotification("新的讲座", newList[i]);
      //if (chrome.browserAction.getBadgeText)
      chrome.browserAction.setBadgeText({text : "new"});
    }
  }
  chrome.storage.local.set({lectureArray : newList});
}


//chrome.notifications.create("newLecture", {type: "basic", title: "test"}, function(id){});

