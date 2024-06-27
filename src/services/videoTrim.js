var video = document.getElementsByClassName('video')[0],
  playbackBar = document.getElementsByClassName('playback')[0],
  playbackRect = null,
  seekableBar = document.getElementsByClassName('seekable')[0],
  seekableRect = null,
  seekRatio = null,
  progressBar = document.getElementsByClassName('progress')[0],
  startGrabber = document.getElementsByClassName('start')[0],
  endGrabber = document.getElementsByClassName('end')[0],
  frontTrimmedRatio = 0,
  endTrimmedRatio = 1;


var player = {
  video: document.getElementsByClassName('video')[0],
  start: 0,
  end: null,
  controls: {
    play: document.getElementsByClassName('play-control')[0],
    seekToStart: document.getElementsByClassName('seek-start')[0],
    seekToEnd: document.getElementsByClassName('seek-end')[0],
    reset: document.getElementsByClassName('reset-control')[0]
  }
};

var playVideo = function () {
  if (player.video.paused) {
    player.video.play();
    player.controls.play.classList.remove('fa-play');
    player.controls.play.classList.add('fa-pause');
    console.log('play video');
  } else {
    pauseVideo();
  }
  if (player.video.currentTime >= player.end) {
    player.video.currentTime = player.start;
    player.controls.play.classList.remove('fa-play');
    player.controls.play.classList.add('fa-pause');
    console.log('start from beginning');
  }
};

var pauseVideo = function () {
  player.video.pause();
  player.controls.play.classList.remove('fa-pause');
  player.controls.play.classList.add('fa-play');
  console.log('pause video');
  video.classList.remove('paused');
};

var resetVideo = function () {
  player.start = 0;
  player.end = player.video.duration;
  player.video.currentTime = 0;
  startGrabber.style.left = '0';
  endGrabber.style.left = '100%';
  seekableBar.style.left = '0';
  seekableBar.style.right = '0';
  endGrabber.style.left = '100%';
  startGrabber.style.left = '0';
  frontTrimmedRatio = 0;
  endTrimmedRatio = 0;
  progressBar.style.right = 0;
  progressBar.style.left = 0;
  console.log('reset video');
};

var seekVideo = function (seekRatio) {
  video.currentTime = video.duration * seekRatio;
};

var updateProgressBar = function () {
  progressBar.style.width = (seekRatio - frontTrimmedRatio) * 100 + '%';
}

var updateProgressBarWidth = function () {
  progressBar.style.left = frontTrimmedRatio * 100 + '%';
  progressBar.style.right = (1 - endTrimmedRatio) * 100 + '%';
}

var updateSeekableStart = function () {
  player.start = player.video.duration * frontTrimmedRatio;
  seekableBar.style.left = frontTrimmedRatio * 100 + '%';
  startGrabber.style.left = frontTrimmedRatio * 100 + '%';
  updateProgressBar();
  console.log('front trimmed: ' + frontTrimmedRatio);
};

var updateSeekableEnd = function (event) {
  player.end = player.video.duration * endTrimmedRatio;
  seekableBar.style.right = (1 - endTrimmedRatio) * 100 + '%';
  endGrabber.style.left = endTrimmedRatio * 100 + '%';

  console.log('end seek ratio: ' + endTrimmedRatio);
};

var playheadMove = function (event) {
  var seekAmount = (event.clientX - playbackRect.left) / playbackRect.width;
  seekVideo(seekAmount);
  window.addEventListener('mouseup', playheadDrop);
  console.log(seekAmount);
}

var playheadDrop = function () {
  window.removeEventListener('mousemove', playheadMove);
  window.removeEventListener('mouseup', playheadDrop);
};

var startGrabberMove = function (event) {
  var ratio = (event.clientX - playbackRect.left) / playbackRect.width;
  if (ratio <= 0) {
    frontTrimmedRatio = 0;
  } else if (ratio >= endTrimmedRatio) {
    frontTrimmedRatio = endTrimmedRatio;
  } else {
    frontTrimmedRatio = ratio;
  }
  updateSeekableStart();
  updateProgressBarWidth();
  seekVideo(frontTrimmedRatio);
}

var startGrabberDrop = function () {
  window.removeEventListener('mousemove', startGrabberMove);
  window.removeEventListener('mouseup', startGrabberDrop);
  console.log('start grabber dropped');
};

var endGrabberMove = function (event) {
  var ratio = (event.clientX - playbackRect.left) / playbackRect.width;
  if (ratio >= 1) {
    endTrimmedRatio = 1;
  } else if (ratio <= frontTrimmedRatio) {
    endTrimmedRatio = frontTrimmedRatio;
  } else {
    endTrimmedRatio = ratio;
  }
  seekVideo(endTrimmedRatio);
  updateSeekableEnd();
}

var endGrabberDrop = function () {
  window.removeEventListener('mousemove', endGrabberMove);
  window.removeEventListener('mouseup', endGrabberDrop);
};

seekableBar.addEventListener('mousedown', function (event) {
  pauseVideo();
  playbackRect = playbackBar.getBoundingClientRect();
  var seekAmount = (event.clientX - playbackRect.left) / playbackRect.width;
  seekVideo(seekAmount);
  window.addEventListener('mousemove', playheadMove);
  console.log('seekable bar mousedown');
});

seekableBar.addEventListener('click', function (event) {
  pauseVideo();
  playbackRect = playbackBar.getBoundingClientRect();
  var seekAmount = (event.clientX - playbackRect.left) / playbackRect.width;
  seekVideo(seekAmount);
  console.log('seek clicked');
  window.removeEventListener('mousemove', playheadMove);
});

startGrabber.addEventListener('mousedown', function (event) {
  playbackRect = playbackBar.getBoundingClientRect();
  console.log('start grabber clicked');
  window.addEventListener('mousemove', startGrabberMove);
  window.addEventListener('mouseup', startGrabberDrop);
});

endGrabber.addEventListener('mousedown', function (event) {
  playbackRect = playbackBar.getBoundingClientRect();
  window.addEventListener('mousemove', endGrabberMove);
  window.addEventListener('mouseup', endGrabberDrop);  
});

video.addEventListener('click', playVideo);

video.addEventListener('loadeddata', function () {
  player.end = player.video.duration;
});

video.addEventListener('timeupdate', function () {
  seekRatio = video.currentTime / video.duration;
  updateProgressBar();
  if (player.video.currentTime >= player.end) {
    pauseVideo();
  }
})

player.controls.play.addEventListener('click', playVideo);

player.controls.seekToStart.addEventListener('click', function () {
  seekVideo(player.start / player.video.duration)
});

player.controls.seekToEnd.addEventListener('click', function () {
  seekVideo(player.end / player.video.duration)
});

player.controls.reset.addEventListener('click', resetVideo);

window.addEventListener("keypress", function (event) {
  if (event.charCode === 32) {
    playVideo();
    console.log('space pressed');
  }
});