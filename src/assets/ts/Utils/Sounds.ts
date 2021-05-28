import '../../sounds/messagealert.mp3';
import '../../sounds/reload.mp3';
import '../../sounds/newpartner.mp3';
import '../../sounds/hangout.mp3';
import { App } from '../app';
import { Settings } from '../Utils/Settings';
import config from '../../../config.json';

var voices = [];

function setVoiceList() {
  voices = window.speechSynthesis.getVoices();
}

setVoiceList();

if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = setVoiceList;
}

function speech(txt) {
  if (!window.speechSynthesis) {
    alert(
      '음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요.'
    );
    return;
  }

  var lang = 'ko-KR';
  var utterThis = new SpeechSynthesisUtterance(txt);

  utterThis.onend = function () {
    console.log('end');
  };
  utterThis.onerror = function (event) {
    console.log('error', event);
  };

  var voiceFound = false;

  for (var i = 0; i < voices.length; i++) {
    if (
      voices[i].lang.indexOf(lang) >= 0 ||
      voices[i].lang.indexOf(lang.replace('-', '_')) >= 0
    ) {
      utterThis.voice = voices[i];
      voiceFound = true;
    }
  }

  // if (!voiceFound) {
  //   alert('Voice not found!');
  //   return;
  // }

  utterThis.lang = lang;
  utterThis.pitch = 1;
  utterThis.rate = 1.25; //속도

  window.speechSynthesis.speak(utterThis);
}

export class Sounds {
  static readonly messagealertsound: string = 'messagealert';
  static readonly reloadsound: string = 'reload';

  static playSound(
    name: string,
    app: App,
    loop: boolean = false
  ): HTMLAudioElement {
    if (
      // this.allowedToPlaySound() &&
      app.configuration.configurationVueObject.soundEffectsOn
    ) {
      var audi = new Audio('assets/' + name + '.mp3');
      // @ts-ignore
      if (typeof audi.sinkId !== 'undefined') {
        // @ts-ignore
        audi.setSinkId(app.devices.devicesVueObject.sound);
      }
      audi.loop = loop;
      audi.play();
      return audi;
    }
    return null;
  }

  static preloadSounds() {
    // if (this.allowedToPlaySound()) {
    this.preloadSound(this.messagealertsound);
    this.preloadSound(this.reloadsound);
    // }
  }

  // static allowedToPlaySound(): boolean {
  //   return Settings.getValueOrDefault(config, 'features.soundEffects', false);
  // }

  static preloadSound(name: string) {
    var audio = new Audio('assets/' + name + '.mp3');
    audio.preload = 'auto';
  }
}

export class TTS {
  static readonly newpartnersound: string = '입장';
  static readonly hangoutsound: string = '퇴장';

  static playSound(name: string, partnerName: string): HTMLAudioElement {
    speech(partnerName + name);

    return null;
  }
}
