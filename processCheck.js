(function ($) {
  var processMonitor = {
    taskTable: {},
    port:   null,
    status: {
      success:    0,
      inProgress: 1,
      failure:    -1
    },

    /**
     * Initialize
     */
    init: function () {
      this.taskTable = $("table.ah-task-table");
      this.extConnect();
      this.watchProcesses();
    },

    /**
     * Connect to the extension page.
     */
    extConnect: function () {
      this.port = chrome.runtime.connect({name: "AcquiaNotifier"});
    },

    /**
     * Prepare a notification to be sent to the extension.
     */
    notify: function(element) {
      var PM = this;
      var status = element.attr('data-state');
      var process = element.find('.task-description').text();
      var msg;

      msg = "PROCESS " + status.toUpperCase() + "\n" + process;

      PM.sendMessage(msg, status, element.attr('id'));
    },

    /**
     * Send a message to the extension.
     */
    sendMessage: function (msg, status, id) {
      if (!this.port) {
        return;
      }

      this.port.postMessage({
        content: msg,
        status:  status,
        id: id
      });
    },

    /**
     * Monitor the processlist and report changes.
     */
    watchProcesses: function () {
      var PM = this;
      var active = {};

      // First, mark any non-working processes so we don't send notifications
      // for them.
      $("tr[data-state][notify!='0']", PM.taskTable).each(function() {
        var $row = $(this);
        var state = $row.attr('data-state');

        if (state === 'done' || state === 'failed') {
          $row.attr('notify', 0);
        }
      });

      // Keep an eye on the process list and notify on changes.
      var timer = setInterval(function () {
        // Itterate through all active processes
        $("tr[data-state][notify!='0']", PM.taskTable).each(function() {
          var $row = $(this);
          var id = $row.attr('id');
          var state = $row.attr('data-state');

          // Newly started process.
          if (typeof active[id] === undefined) {
            PM.notify($row);
            active[id] = state;
          }
          // Process already logged, so compare state.
          else {
            // State changed
            if (active[id] !== state) {
              PM.notify($row);
              active[id] = state;
            }

            // Remove completed tasks
            if (state === 'done' || state === 'failed') {
              delete active[id];
            }
          }

          // Mark row as notified for this state.
          $row.attr('notify', 0);
        });
      }, 1000);
    }
  };

  // Initialize the process monitor.
  processMonitor.init();
})(jQuery);
