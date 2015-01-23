(function() {
  var processMonitor = {
    // Initialize
    init: function() {
      this.listen();
    },

    // Create a notification
    notify: function(id, msg, icon) {
      chrome.notifications.create('AcquiaCloudNotification' + id, {
        'iconUrl': icon,
        'type': 'basic',
        'title': 'Acquia Cloud Notifier',
        'message': msg
      }, function(notificationId) {
        // Clear the notification after 3 seconds.
        setTimeout(function() {
          chrome.notifications.clear(notificationId, function(wasCleared) {});
        }, 7000);
      });
    },

    // Listen for messages from the Acquia tab.
    listen: function() {
      var PM = this;

      chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name == "AcquiaNotifier");

        port.onMessage.addListener(function(msg) {
          switch (msg.status) {
            case 'waiting':
            case 'started':
              icon = 'https://insight.acquia.com/sites/all/themes/acquia_d7_insight/images/spinner.png';
              break;

            case 'done':
              icon = 'https://insight.acquia.com/sites/all/themes/acquia_d7_insight/images/message-status.png';
              break;

            case 'failed':
              icon = 'https://insight.acquia.com/sites/all/themes/acquia_d7_insight/images/message-error.png';
              break;

            default:
              icon = 'https://insight.acquia.com/sites/all/themes/acquia_d7_insight/images/message-info.png';
              break;
          }

          PM.notify(msg.id, msg.content, icon);
        });
      });
    }
  };

  // Initialize the process monitor.
  processMonitor.init();
})();
