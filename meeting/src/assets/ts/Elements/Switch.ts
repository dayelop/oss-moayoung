import { App } from '../app';

declare var Vue: any;

export class Switch {
  app: App;
  switchVueObject: any;

  faceDetect: HTMLElement;
  faceDetectOn: boolean = false;
  subtitleExtract: HTMLElement;
  subtitleExtractOn: boolean = false;
  libMagnify: HTMLElement;
  libMagnifyOn: boolean = false;
  participantAlarm: HTMLElement;
  participantAlarmOn: boolean = false;

  constructor(app: App) {
    this.app = app;
    this.initialElements();
  }

  initialElements() {
    let cla = this;
    const app = this.app;

    this.switchVueObject = new Vue({
      data: {
        faceDetect: document.getElementById('faceDetect'),
        subtitleExtract: document.getElementById('subtitleExtract'),
        libMagnify: document.getElementById('libMagnify'),
        participantAlarm: document.getElementById('participantAlarm'),
      },
      methods: {
        toggleFaceDetect: function () {
          $(document.getElementById('faceDetect')).prop(
            'checked',
            !$(document.getElementById('faceDetect')).prop('checked')
          );
        },
        toggleSubtitleExtract: function () {
          $(document.getElementById('subtitleExtract')).prop(
            'checked',
            !$(document.getElementById('subtitleExtract')).prop('checked')
          );
        },
        toggleLibMagnify: function () {
          $(document.getElementById('libMagnify')).prop(
            'checked',
            !$(document.getElementById('libMagnify')).prop('checked')
          );
        },
        toggleParticipantAlarm: function () {
          $(document.getElementById('participantAlarm')).prop(
            'checked',
            !$(document.getElementById('participantAlarm')).prop('checked')
          );
        },
      },
    });
  }
}
