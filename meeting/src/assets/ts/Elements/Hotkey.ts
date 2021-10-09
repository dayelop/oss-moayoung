import { App } from '../app';
import { Switch } from './Switch';
import { CreateRoom } from './CreateRoom';

declare var Vue: any;

export class Hotkey {
  app: App;
  hotkeyVueObject: any;

  constructor(app: App) {
    this.app = app;
    this.initialElements();
    this.testMethod();
  }

  initialElements() {
    let cla = this;
    const app = this.app;

    this.hotkeyVueObject = new Vue({
      el: '#hotkey',
      method: {},
    });
  }

  testMethod() {
    var cla = this;
    const app = this.app;
    $(window).on('load', function () {
      var isCtrl = false;

      document.onkeyup = function (e) {
        if (e.which == 17) isCtrl = false;
      };

      document.onkeydown = function (e) {
        if (e.which == 17) isCtrl = true;

        if (e.which == 77 && isCtrl == true) {
          //[m]ic
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            cla.app.createRoom.waitroomVueObject.toogleMicrophone();
            return false;
          }

          app.controls.controlsVueObject.toogleMicrophone();
          return false;
        }

        if (e.which == 67 && isCtrl == true) {
          //[c]am
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            cla.app.createRoom.waitroomVueObject.toogleCamera();
            return false;
          }

          app.controls.controlsVueObject.toogleCamera();
          return false;
        }

        if (e.which == 83 && isCtrl == true) {
          //[s]hare
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            return false;
          }

          app.controls.controlsVueObject.toogleScreen();
          return false;
        }

        if (e.which == 79 && isCtrl == true) {
          //[o]ption
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            cla.app.createRoom.waitroomVueObject.toggleOptions();
            return false;
          }

          app.controls.controlsVueObject.toogleOption();
          return false;
        }

        if (e.which == 69 && isCtrl == true) {
          //[e]nter or [e]xit
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            cla.app.createRoom.waitroomVueObject.enterRoom();
            return false;
          }

          cla.app.controls.controlsVueObject.hangOut();
          return false;
        }

        if (e.which == 70 && isCtrl == true) {
          //[f]ace
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            $(document.getElementById('waitroomFaceDetectionChkbox')).prop(
              'checked',
              !$(document.getElementById('waitroomFaceDetectionChkbox')).prop(
                'checked'
              )
            );
            cla.app.createRoom.waitroomVueObject.toggleFaceDetection();
            return false;
          }

          console.log('face');
          app.switch_.switchVueObject.toggleFaceDetect();
          return false;
        }

        if (e.which == 66 && isCtrl == true) {
          //su[b]title
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            $(document.getElementById('waitroomSubtitleExtractChkbox')).prop(
              'checked',
              !$(document.getElementById('waitroomSubtitleExtractChkbox')).prop(
                'checked'
              )
            );
            cla.app.createRoom.waitroomVueObject.toggleSubtitleExtract();
            return false;
          }

          app.switch_.switchVueObject.toggleSubtitleExtract();
          return false;
        }

        if (e.which == 76 && isCtrl == true) {
          //[l]ip
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            $(document.getElementById('waitroomLipMagnifyChkbox')).prop(
              'checked',
              !$(document.getElementById('waitroomLipMagnifyChkbox')).prop(
                'checked'
              )
            );

            cla.app.createRoom.waitroomVueObject.toggleLipMagnify();
            return false;
          }

          app.switch_.switchVueObject.toggleLibMagnify();
          return false;
        }

        if (e.which == 65 && isCtrl == true) {
          //[a]larm
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            $(document.getElementById('waitroomParticipantAlarmChkbox')).prop(
              'checked',
              !$(
                document.getElementById('waitroomParticipantAlarmChkbox')
              ).prop('checked')
            );
            cla.app.createRoom.waitroomVueObject.toggleParticipantAlarm();
            return false;
          }

          app.switch_.switchVueObject.toggleParticipantAlarm();
          return false;
        }
      };
    });
  }
}
