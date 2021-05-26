window.onload = function () {
  //   console.log('여기');

  var faceDetect = document.getElementById('faceDetect');
  var subtitleExtract = document.getElementById('subtitleExtract');
  var libMagnify = document.getElementById('libMagnify');
  var participantAlarm = document.getElementById('participantAlarm');

  var faceDetectResult = $(faceDetect).prop('checked');
  var subtitleExtractResult = $(subtitleExtract).prop('checked');
  var libMagnifyResult = $(libMagnify).prop('checked');
  var participantAlarmResult = $(participantAlarm).prop('checked');

  //   console.log(faceDetectResult);
  //   console.log(subtitleExtractResult);
  //   console.log(libMagnifyResult);
  //   console.log(participantAlarmResult);

  //   var testTitle = document.getElementById('testTitle');
  //   testTitle.addEventListener('click', function () {
  //     testConsole();
  //   });

  //   const testConsole = () => {
  //     faceDetectResult = $(faceDetect).prop('checked');
  //     subtitleExtractResult = $(subtitleExtract).prop('checked');
  //     libMagnifyResult = $(libMagnify).prop('checked');
  //     participantAlarmResult = $(participantAlarm).prop('checked');

  //     console.log(faceDetectResult);
  //     console.log(subtitleExtractResult);
  //     console.log(libMagnifyResult);
  //     console.log(participantAlarmResult);
  //   };
};
