import { App, faceRelocateVoice, speech } from '../app';
import { Translator } from '../Utils/Translator';
import { Settings } from '../Utils/Settings';
import config from '../../../config.json';
import { Cookie } from '../Utils/Cookie';
import { Alert } from './Alert';

declare var Vue: any;

export class CreateRoom {
  app: App;
  createRoomVueObject: any;
  setNameVueObject: any;
  waitroomVueObject: any;

  readonly microphoneCookie: string = 'microphoneOn';
  readonly cameraCookie: string = 'cameraOn';

  constructor(app: App) {
    this.app = app;
    this.initialElements();
  }

  initialElements() {
    let cla = this;
    let localStream;

    this.createRoomVueObject = new Vue({
      el: '#create-room',
      data: {
        showDialog: false,
        showInner: true,
        showWaitroom: false,
        roomNameLabel: Translator.get('roomname'),
        roomName: '',
        title: Settings.getValueOrDefault(config, 'meta.title'),
        imprint: Settings.getValueOrDefault(config, 'privacy.imprint'),
        gdpr: Settings.getValueOrDefault(config, 'privacy.gdpr'),
        hangouted: false,
        screenOn: false,
        optionOn: false,
        screenSharingNotAllowed:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ),
        hasNewMessage: false,
      },
      methods: {
        createRoom: function () {
          if (this.roomName !== '') {
            cla.app.room = this.roomName;
            location.hash = this.roomName;
            this.showDialog = false;
            cla.openDialog(this.yourName ? false : true);
            cla.waitroomVueObject.showWaitroom = true;
            cla.waitroomVueObject.setVideo();
            cla.app.devices.gotDevices(true);
          }
        },
        setRandomName: function () {
          this.roomName = cla.randomName(20);
        },
      },
    });

    this.setNameVueObject = new Vue({
      el: '#waitroom-setname',
      data: {
        open: false,
        showSetName: false,
        name: '',
      },
      methods: {
        changeUserinfo: function () {
          cla.app.userinfo.setUserInfo(this.name);
        },
        close: function () {
          if (!this.name) return;

          cla.waitroomVueObject.userName = this.name;
          cla.closeDialog();
        },
      },
    });

    this.waitroomVueObject = new Vue({
      el: '#waitroom',
      data: {
        userName: '',
        showWaitroom: false,
        isHost: true,
        microphoneOn:
          Cookie.getCookie(cla.microphoneCookie) == 'false' ? false : true,
        cameraOn: Cookie.getCookie(cla.cameraCookie) == 'false' ? false : true,
        hangouted: false,
        video: document.getElementById('waitroomVideo') as HTMLMediaElement,
        isInWaitroom: true,
      },
      methods: {
        enterRoom: function () {
          if (!this.userName) return;

          if (this.isHost && this.roomName !== '') {
            cla.app.openConnection(true);
            cla.app.invite.resetLink();
            this.showDialog = false;
            this.showWaitroom = false;
          } else if (!this.isHost) {
            cla.app.room = decodeURIComponent(location.hash.substring(1));
            cla.app.openConnection();
            this.showWaitroom = false;
          }
          this.stopVideo();
          this.isInWaitroom = false;
        },
        setVideo: function () {
          if (!this.cameraOn) {
            return;
          }

          setTimeout(() => {
            const mediaStreamConstraints = {
              video: true,
            };

            const localVideo = document.getElementById(
              'waitroomVideo'
            ) as HTMLMediaElement;

            function gotLocalMediaStream(mediaStream) {
              localStream = mediaStream;
              localVideo.srcObject = mediaStream;
            }

            function handleLocalMediaStreamError(error) {
              console.log('navigator.getUserMedia error: ', error);
            }

            navigator.mediaDevices
              .getUserMedia(mediaStreamConstraints)
              .then(gotLocalMediaStream)
              .catch(handleLocalMediaStreamError);
          }, 500);
        },
        stopVideo: function () {
          if (localStream == null) {
            return;
          }
          this.video.pause();
          this.video.src = '';
          localStream.getTracks()[0].stop();
        },
        toogleMicrophone: function () {
          if (cla.app.localStream !== undefined) {
            this.microphoneOn = !this.microphoneOn;
            Cookie.setCookie(cla.microphoneCookie, this.microphoneOn);
            cla.app.controls.controlsVueObject.microphoneOn = this.microphoneOn;
            cla.toogleStreamMicrophone(false);
            cla.app.sendMessageToAllPartners(cla.app.userinfo.getUserInfo());
          } else {
            new Alert(Translator.get('cannotstartmicrophone'));
          }
        },
        onResults: function (results) {
          if (
            $(document.getElementById('waitroomFaceDetectionChkbox')).prop(
              'checked'
            ) == true &&
            results.multiFaceLandmarks[0]
          ) {
            if (cla.app.faceDetectionState == 1) {
              console.log('Start Face Detection');
              faceRelocateVoice();
            }

            if (results.multiFaceLandmarks[0][10].y <= 0.1) {
              console.log('Face Out Direction: Up');
              if (cla.app.faceDetectionState !== -1) {
                if (cla.app.faceDetectionState !== 1)
                  window.speechSynthesis.cancel();
                cla.app.faceDetectionState = -1;
                faceRelocateVoice();
              } else cla.app.faceDetectionStateCount++;
            } else if (results.multiFaceLandmarks[0][10].y >= 0.6) {
              console.log('Face Out Direction: Down');
              if (cla.app.faceDetectionState !== -2) {
                if (cla.app.faceDetectionState !== 1)
                  window.speechSynthesis.cancel();
                cla.app.faceDetectionState = -2;
                faceRelocateVoice();
              } else cla.app.faceDetectionStateCount++;
            } else if (results.multiFaceLandmarks[0][234].x <= 0.1) {
              console.log('Face Out Direction: Right');
              if (cla.app.faceDetectionState !== -3) {
                if (cla.app.faceDetectionState !== 1)
                  window.speechSynthesis.cancel();
                cla.app.faceDetectionState = -3;
                faceRelocateVoice();
              } else cla.app.faceDetectionStateCount++;
            } else if (results.multiFaceLandmarks[0][454].x >= 0.9) {
              console.log('Face Out Direction: Left');
              if (cla.app.faceDetectionState !== -4) {
                if (cla.app.faceDetectionState !== 1)
                  window.speechSynthesis.cancel();
                cla.app.faceDetectionState = -4;
                faceRelocateVoice();
              } else cla.app.faceDetectionStateCount++;
            } else if (
              results.multiFaceLandmarks[0][10].y > 0.1 &&
              results.multiFaceLandmarks[0][10].y < 0.6 &&
              results.multiFaceLandmarks[0][234].x > 0.1 &&
              results.multiFaceLandmarks[0][234].x < 0.9
            ) {
              console.log('Face in Normal Range');
              if (cla.app.faceDetectionState !== 0) {
                if (cla.app.faceDetectionState !== 1)
                  window.speechSynthesis.cancel();
                cla.app.faceDetectionState = 0;
                faceRelocateVoice();
              }
            }
          } else if (
            $(document.getElementById('waitroomFaceDetectionChkbox')).prop(
              'checked'
            ) !== true
          ) {
            cla.app.faceDetectionState = 1;
            cla.app.faceDetectionStateCount = 0;
          }
          if (cla.app.faceDetectionStateCount == 25) {
            speech('아직 정상 범위에 들어오지 않았습니다');
            faceRelocateVoice();
          }
        },
        toogleCamera: function () {
          if (
            !cla.app.microphoneOnlyNotChangeable &&
            cla.app.localStream !== undefined
          ) {
            this.cameraOn = !this.cameraOn;
            cla.app.microphoneOnly = !this.cameraOn;
            Cookie.setCookie(cla.cameraCookie, this.cameraOn);
            cla.app.controls.controlsVueObject.cameraOn = this.cameraOn;
            if (!this.cameraOn) {
              this.stopVideo();
            } else {
              this.setVideo();
            }
            cla.toogleStreamCamera();
            cla.app.sendMessageToAllPartners(cla.app.userinfo.getUserInfo());
          } else {
            new Alert(Translator.get('cannotstartcamera'));
          }

          const videoElement = document.getElementById(
            'waitroomVideo'
          ) as HTMLVideoElement;

          cla.app.faceDetectionState = 1;
          cla.app.faceDetectionStateCount = 0;

          cla.app.waitroomFaceMesh.onResults(this.onResults);

          if (
            this.cameraOn &&
            $(document.getElementById('waitroomFaceDetectionChkbox')).prop(
              'checked'
            ) == true
          ) {
            cla.app.interval = setInterval(async () => {
              await cla.app.waitroomFaceMesh.send({ image: videoElement });
            }, 200);
          } else {
            clearInterval(cla.app.interval);
            cla.app.interval = null;
          }
        },
        toggleOptions: function () {
          $('#waitroom').toggleClass('openWaitroomOption');
        },
        toggleFaceDetection: function () {
          const videoElement = document.getElementById(
            'waitroomVideo'
          ) as HTMLVideoElement;

          cla.app.faceDetectionState = 1;
          cla.app.faceDetectionStateCount = 0;

          cla.app.waitroomFaceMesh.onResults(this.onResults);

          if (
            this.cameraOn &&
            $(document.getElementById('waitroomFaceDetectionChkbox')).prop(
              'checked'
            ) == true
          ) {
            cla.app.interval = setInterval(async () => {
              await cla.app.waitroomFaceMesh.send({ image: videoElement });
            }, 200);
          } else {
            clearInterval(cla.app.interval);
            cla.app.interval = null;
          }
        },
        toggleSubtitleExtract: function () {
          $(document.getElementById('subtitleExtract')).prop(
            'checked',
            !$(document.getElementById('subtitleExtract')).prop('checked')
          );
        },
        toggleLipMagnify: function () {
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

  showCreateRoom(show: boolean = true) {
    if (this.waitroomVueObject.isHost) {
      this.createRoomVueObject.showDialog = show;
    } else {
      this.waitroomVueObject.showWaitroom = true;
      this.waitroomVueObject.setVideo();
      this.app.devices.gotDevices(true);
    }
  }

  randomName(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  toogleStreamMicrophone(changeCamera: boolean = true) {
    if (this.app.localStream == undefined) {
      this.createRoomVueObject.microphoneOn = false;
    } else {
      this.app.localStream.getAudioTracks()[0].enabled =
        this.createRoomVueObject.microphoneOn;
      if (changeCamera && this.createRoomVueObject.microphoneOn) {
        this.app.initialCamera();
      }
    }
    this.setMutedIcon();
  }

  toogleStreamCamera(changeCamera: boolean = true) {
    if (
      this.app.microphoneOnlyNotChangeable ||
      this.app.localStream == undefined
    ) {
      this.createRoomVueObject.cameraOn = false;
    } else {
      if (this.app.localStream.getVideoTracks()[0] != undefined) {
        this.app.localStream.getVideoTracks()[0].enabled =
          this.createRoomVueObject.cameraOn;
      }
      if (changeCamera) {
        this.app.initialCamera();
      }
    }
    this.setCameraOffIcon();
  }

  setMutedIcon() {
    this.app.yourVideoElement.videoVueObject.muted =
      !this.createRoomVueObject.microphoneOn;
    this.app.partnerListElement.partnerListElementVueObject.muted =
      !this.createRoomVueObject.microphoneOn;
  }

  setCameraOffIcon() {
    this.app.yourVideoElement.videoVueObject.cameraOff =
      !this.createRoomVueObject.cameraOn;
    this.app.partnerListElement.partnerListElementVueObject.cameraOff =
      !this.createRoomVueObject.cameraOn;
  }

  openDialog(noName: boolean) {
    var cla = this;
    this.setNameVueObject.showSetName = noName;

    if (noName) {
      setTimeout(function () {
        cla.setNameVueObject.open = true;
        $('#waitroom-setname .setname input').focus();
      }, 100);
    }
  }

  closeDialog() {
    this.setNameVueObject.open = false;
  }
}
