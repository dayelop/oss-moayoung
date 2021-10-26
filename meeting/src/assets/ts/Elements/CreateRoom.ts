import { App } from '../app';
import { Translator } from '../Utils/Translator';
import { Settings } from '../Utils/Settings';
import config from '../../../config.json';
import { Cookie } from '../Utils/Cookie';
import { Alert } from './Alert';
import { TTS } from '../Utils/Sounds';

declare var Vue: any;
function Mobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
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
            if (!Mobile()) {
              TTS.playSound(
                `단축키 음성 안내를 듣고 싶다면 컨트롤 i를 눌러주세요.`,
                ''
              );
            }
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

          dragElement(document.getElementById('mydiv'));
          function dragElement(elmnt) {
            var pos1 = 0,
              pos2 = 0,
              pos3 = 0,
              pos4 = 0;
            if (document.getElementById(elmnt.id + 'header')) {
              /* if present, the header is where you move the DIV from:*/
              document.getElementById(elmnt.id + 'header').onmousedown =
                dragMouseDown;
            } else {
              /* otherwise, move the DIV from anywhere inside the DIV:*/
              elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
              e = e || window.event;
              e.preventDefault();
              // calculate the new cursor position:
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              // set the element's new position:
              elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
              elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
            }

            function closeDragElement() {
              /* stop moving when mouse button is released:*/
              document.onmouseup = null;
              document.onmousemove = null;
            }
          }
          var lips_area = document.getElementById('lips-area');
          if (
            $(document.getElementById('libMagnify')).prop('checked') == true
          ) {
            lips_area.style.display = 'inline';
          } else {
            lips_area.style.display = 'none';
          }
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

          cla.app.waitroomCameraOn = this.cameraOn;
        },
        toggleOptions: function () {
          $('#waitroom').toggleClass('openWaitroomOption');
        },
        toggleFaceDetection: function () {
          $(document.getElementById('faceDetect')).prop(
            'checked',
            !$(document.getElementById('faceDetect')).prop('checked')
          );

          cla.app.featureOnOffVueObject.isFaceDetect();
        },
        toggleParticipantAlarm: function () {
          $(document.getElementById('participantAlarm')).prop(
            'checked',
            !$(document.getElementById('participantAlarm')).prop('checked')
          );
        },
        changeUserName: function () {
          cla.app.userinfo.setUserInfo(this.userName);
        },
      },
    });
  }

  showCreateRoom(show: boolean = true) {
    if (this.waitroomVueObject.isHost) {
      this.createRoomVueObject.showDialog = show;
    } else {
      setTimeout(() => {
        if (!Mobile()) {
          TTS.playSound(
            `단축키 음성 안내를 듣고 싶다면 컨트롤 i를 눌러주세요.`,
            ''
          );
        }
      }, 2500);
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
    } else {
      cla.waitroomVueObject.userName = Cookie.getCookie('name');
    }
  }

  closeDialog() {
    this.setNameVueObject.open = false;
  }
}
