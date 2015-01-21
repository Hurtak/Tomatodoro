var Timer = (function() {
  'use strict';

  var intervalIndex;
  var timerInterval;

  var intervals = [];

  var timer;
  // how often are we running precise timer to check if second of real time elapsed
  var timerPrecision = 100; // ms

  var init = function() {
    // initialize intervals array
    updateIntervals();

    // load save progress
    intervalIndex = Services.Storage.get('intervalIndex') || 0;
    timerInterval = Services.Storage.get('timerInterval') || Config.workInterval;

    // when user changes number of intervals in settings
    if (intervalIndex > intervals.length - 1) {
      if (intervalIndex % 2 === 0) {
        intervalIndex = intervals.length - 2;
      } else {
        intervalIndex = intervals.length - 1;
      }
    }

    // initialize progress images
    for (var i = 0; i < Config.repeat; i++) {
      Views.Progress.createImage('unfinished');
    }

    for (var index = 0; index <= intervalIndex; index++) {
      updateTimerViews(index, true);
    }

    if (intervalIndex === 0 && timerInterval < Config.workInterval) {
      Views.Progress.setImageType('work', 0);
      Views.Progress.setDescription('work');
    }

    if (intervalIndex === 0 && timerInterval === Config.workInterval) {
      Services.Title.resetTitle();
    } else {
      Services.Title.setTitle(secondsToTime(timerInterval));
    }

    // binding
    Views.Controls.getStartButton().addEventListener('click', startTimer);
    Views.Controls.getSkipButton().addEventListener('click', skipInterval);
    Views.Controls.getResetButton().addEventListener('click', resetTimer);

  };

  var updateIntervals = function() {
    intervals = [];

    for (var i = 0; i < Config.repeat; i++) {
      intervals.push(Config.workInterval);
      intervals.push(Config.breakInterval);
    }

    // replace last break with long break
    intervals.pop();
    intervals.push(Config.longbreakInterval);
  };

  var secondsToTime = function(seconds) {
    var addLeadingZero = function(number) {
      if (number < 10) {
        number = '0' + number;
      }

      return number;
    };

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return addLeadingZero(minutes) + ':' + addLeadingZero(seconds);
  };

  var timerTick = function() {
    timerInterval--;

    if (timerInterval <= 0) {
      nextInterval();
    }

    var time = secondsToTime(timerInterval);

    Views.Timer.setTime(time);

    Services.Title.setTitle(time, timer);
    Services.Storage.set('timerInterval', timerInterval);
  };

  var nextInterval = function(skipped) {
    skipped = skipped || false;

    intervalIndex++;
    if (intervalIndex > intervals.length - 1) {
      intervalIndex = 0;
      resetTimer();
    }

    timerInterval = intervals[intervalIndex];

    updateTimerViews(intervalIndex, skipped);

    Services.Storage.set('intervalIndex', intervalIndex);

    if (skipped) {
      if (timer) {
        // resets timeout countdown
        pauseTimer();
        runTimer();
      }

      Services.Title.setTitle(secondsToTime(timerInterval), timer);
      Services.Storage.set('intervalIndex', intervalIndex);
      Services.Storage.set('timerInterval', timerInterval);
    }
  };

  var updateTimerViews = function(index, skipped) {
    var imageIndex = Math.floor(index / 2);

    Views.Timer.setTime(secondsToTime(timerInterval));

    // intervals[ work, break, work, break, ... , long break ]
    if (index === intervals.length - 1) {
      // last interval

      Services.Favicon.setFavicon('longbreak');
      if (!skipped && Config.notifications) {
        Services.Notification.newNotification(Config.longbreakInterval / 60 + ' minute long break', 'longbreak');
          Services.Audio.play();
      }

      Views.Progress.setDescription('long break');
      Views.Progress.setImageType('longbreak', imageIndex);

    } else if (index === 0) {
      // first interval: 0

      Services.Favicon.setFavicon('work');
      if (!skipped) {
        if (Config.notifications) {
          // TODO: think of better notification text
          Services.Notification.newNotification('Done', 'work');
        }
        if (Config.audio) {
          Services.Audio.play();
        }
      }

    } else if (index % 2 === 0) {
      // even interval: 2, 4, 6

      Services.Favicon.setFavicon('work');
      if (!skipped) {
        if (Config.notifications) {
          Services.Notification.newNotification(Config.workInterval / 60 + ' minute work', 'work');
        }
        if (Config.audio) {
          Services.Audio.play();
        }
      }

      Views.Progress.setDescription('work');
      Views.Progress.setImageType('work', imageIndex);
      Views.Progress.setImageType('finished', imageIndex - 1);

    } else if (index % 2 === 1) {
      // odd interval: 1, 3, 6..

      Services.Favicon.setFavicon('break');
      if (!skipped) {
        if (Config.notifications) {
          Services.Notification.newNotification(Config.breakInterval / 60 + ' minute break', 'break');
        }
        if (Config.audio) {
          Services.Audio.play();
        }
      }

      Views.Progress.setDescription('break');
      Views.Progress.setImageType('break', imageIndex);

    }

  };

  var skipInterval = function() {
    nextInterval(true);
  };

  var startTimer = function() {
    if (!timer) {
      runTimer();
    } else {
      pauseTimer();
    }

    Services.Title.setTitle(secondsToTime(timerInterval), timer);
    Views.Controls.toogleStartButtonCaption();

    if (intervalIndex === 0) {
      Views.Progress.setImageType('work', 0);
      Views.Progress.setDescription('work');
    }
  };

  var runTimer = function() {
    var elapsedTime = 0;
    var before = new Date();

    timer = setInterval(function() {
      elapsedTime += new Date().getTime() - before.getTime();

      if(elapsedTime >= 1000) {
          timerTick();
          elapsedTime -= 1000;
      }

      before = new Date();
    }, timerPrecision);

  };

  var pauseTimer = function() {
    timer = clearInterval(timer);
  };

  var resetTimer = function() {
    pauseTimer();

    intervalIndex = 0;
    timerInterval = Config.workInterval;

    var time = secondsToTime(timerInterval);

    Views.Timer.setTime(time);
    Views.Controls.resetStartButton();

    Services.Title.resetTitle();
    Services.Favicon.setFavicon('work');
    Services.Storage.set('intervalIndex', intervalIndex);
    Services.Storage.set('timerInterval', timerInterval);

    Views.Progress.resetProgress();
  };

  return {
    init: init,
    updateIntervals: updateIntervals,
    startTimer: startTimer,
    pauseTimer: pauseTimer,
    skipInterval: skipInterval,
    resetTimer: resetTimer
  };

}());
