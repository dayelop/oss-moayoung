annyang.start({ autoRestart: true, continuous: true });

var recognition = annyang.getSpeechRecognizer();
var final_transcript = '';
var final = '';

recognition.interimResults = true;

recognition.onresult = function (event) {
  final_transcript = '';

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
      annyang.trigger(final_transcript);
    }
  }

  if (final_transcript) {
    final += `[${name}] ${final_transcript.trim()}\n`;
    final.replace(/\n/g, '<br/>');

    $(function () {
      $('.subtitles').text(final);
    });
  }
};
