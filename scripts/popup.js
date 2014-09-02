
function startMonitoring() {
  chrome.runtime.sendMessage({flag : "start"}, function(response){});
  window.close();
}

function stopMonitoring() {
  chrome.runtime.sendMessage({flag : "stop"}, function(response){});
  window.close();
}

function openPage() {
  chrome.tabs.create({url: "http://graduate.buct.edu.cn:8080/pyxx/login.aspx"});
}

// Sets up handlers for the various interactive parts of the popup, both the
// three global button and the three per-notification buttons.
function setUpHandlers() {
  // Handlers for the main buttons.
  $('#monitor_page').click(startMonitoring);
  $('.stop_monitoring').click(stopMonitoring);
  $('.open_page').click(openPage);
}