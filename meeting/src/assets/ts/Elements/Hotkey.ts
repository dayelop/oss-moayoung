import { App } from '../app';
import { Switch } from './Switch';
import { CreateRoom } from './CreateRoom';
import { TTS } from '../Utils/Sounds';

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
      var flag = false;

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

          app.switch_.switchVueObject.toggleFaceDetect();
          app.featureOnOffVueObject.isFaceDetect();

          return false;
        }

        if (e.which == 66 && isCtrl == true) {
          //su[b]title
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
            return false;
          }

          app.switch_.switchVueObject.toggleSubtitleExtract();
          return false;
        }

        if (e.which == 76 && isCtrl == true) {
          //[l]ip
          if (cla.app.createRoom.waitroomVueObject.isInWaitroom) {
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

        if (e.which == 73 && isCtrl == true) {
          //descr[i]be
          if (flag) {
            window.speechSynthesis.cancel();
            flag = false;
            return false;
          }

          if (!flag) {
            flag = true;
            TTS.playSound(
              `단축키를 안내드리겠습니다.
          단축키 안내 음성을 정지하시려면 컨트롤 I를 다시 눌러주세요.
          마이크를 끄고 키시려면 컨트롤 M
          카메라를 끄고 키시려면 컨트롤 C
          화면을 공유하시려면 컨트롤 S
          옵션창을 여시려면 컨트롤 O
          통화방을 입장하거나 퇴장하고 싶으시면 컨트롤 E
          얼굴 벗어남 감지기능을 끄고 키시려면 컨트롤 F
          자막 추출 기능을 끄고 키시려면 컨트롤 B
          발화자의 입을 확대하는 기능을 끄고 키시려면 컨트롤 L
          참여자 음성 알림 기능을 끄고 키시려면 컨트롤 A를 눌러주세요
          이 음성을 다시 듣고 싶다면 컨트롤 I을 다시 눌러주세요 `,
              ''
            );
          }
        }
      };
    });
  }
}
