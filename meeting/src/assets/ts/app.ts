import '../sass/main.scss';
import '../images/chat.png';

import config from '../../config.json';

import { IExchange } from './Exchange/IExchange';
import { Firebase } from './Exchange/Firebase';
import { ICommunication } from './Communication/ICommunication';
import { WebRTC } from './Communication/WebRTC';
import { IPartner } from './Partner/IPartner';
import { IPartners } from './Partner/IPartners';
import { Partner } from './Partner/Partner';
import { Controls } from './Elements/Controls';
import { Screen } from './Elements/Screen';
import { Devices } from './Elements/Devices';
import { Textchat } from './Elements/Textchat';
import { Videogrid } from './Elements/Videogrid';
import { Video } from './Elements/Video';
import { PartnerListElement } from './Elements/PartnerListElement';
import { Userinfo } from './Elements/Userinfo';
import { Lightbox } from './Elements/Lightbox';
import { Invite } from './Elements/Invite';
import { CreateRoom } from './Elements/CreateRoom';
import { SystemInfo } from './Elements/SystemInfo';
import { Configuration } from './Elements/Configuration';
import { JQueryUtils } from './Utils/JQuery';
import { Alert } from './Elements/Alert';
import { NoInternet } from './Elements/NoInternet';
import { Welcome } from './Elements/Welcome';
import { Translator } from './Utils/Translator';
import { IceServers } from './Utils/IceServers';
import { Sounds, TTS } from './Utils/Sounds';
import { Settings } from './Utils/Settings';
import { ChatServer } from './Exchange/ChatServer';
import { HotkeyTest } from '../js/HotkeyTest';
import { Switch } from './Elements/Switch';
import '@mediapipe/face_mesh';
import '@mediapipe/drawing_utils';
import '@mediapipe/camera_utils';
import {
  FaceMesh,
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_TESSELATION,
} from '@mediapipe/face_mesh';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';

declare var Vue: any;

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
  utterThis.rate = 1.2; //속도

  window.speechSynthesis.speak(utterThis);
}

export class App {
  room: string;
  yourId: number = Math.floor(Math.random() * 1000000000);
  yourName: string;
  exchange: IExchange;
  communication: ICommunication;
  yourVideo: HTMLElement;
  listener: boolean = false;
  microphoneOnly: boolean = false;
  microphoneOnlyNotChangeable: boolean = false;
  localStream: any;
  localScreenStream: any;
  partners: IPartners = {};
  controls: Controls;
  screen: Screen;
  devices: Devices;
  textchat: Textchat;
  userinfo: Userinfo;
  videogrid: Videogrid;
  lightbox: Lightbox;
  createRoom: CreateRoom;
  systemInfo: SystemInfo;
  configuration: Configuration;
  noInternet: NoInternet;
  welcome: Welcome;
  invite: Invite;
  closed: boolean = false;
  called: boolean = false;
  readyToCall: boolean = false;
  stateIsSet: boolean = false;
  yourVideoElement: Video;
  partnerListElement: PartnerListElement;
  hotkey: HotkeyTest;
  switch_: Switch;

  subtitleExtract: HTMLElement;
  libMagnify: HTMLElement;
  participantAlarm: HTMLElement;

  firstlipdiv: boolean = true;
  fisrtfacedetection: boolean = true;

  myfaceMesh: FaceMesh;
  partnerfaceMesh: FaceMesh;

  featureOnOffVueObject: any;
  camerastate: boolean;
  interval: any;

  constructor() {
    this.yourVideo = document.getElementById('yourVideo');
    this.yourVideoElement = new Video(
      document.getElementById('yourVideoArea'),
      null
    );
    this.partnerListElement = new PartnerListElement(null);
    this.controls = new Controls(this);
    this.screen = new Screen(this);
    this.devices = new Devices(this);
    this.textchat = new Textchat(this);
    this.userinfo = new Userinfo(this);
    this.lightbox = new Lightbox(this);
    this.invite = new Invite(this);
    this.createRoom = new CreateRoom(this);
    this.systemInfo = new SystemInfo(this);
    this.configuration = new Configuration(this);
    this.noInternet = new NoInternet(this);
    this.welcome = new Welcome(this);
    this.videogrid = new Videogrid();
    this.hotkey = new HotkeyTest(this);
    this.switch_ = new Switch(this);
    this.videogrid.init();

    this.camerastate = this.controls.controlsVueObject.cameraOn;

    this.subtitleExtract = document.getElementById('subtitleExtract');
    this.libMagnify = document.getElementById('libMagnify');
    this.participantAlarm = document.getElementById('participantAlarm');
    this.myfaceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    this.myfaceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.featureOnOffVueObject = new Vue({
      el: '#settingSwitch',
      data: {
        setting: false,
      },
      methods: {
        isFaceDetect: function () {
          const videoElement = document.getElementsByClassName(
            'input_video'
          )[0] as HTMLVideoElement;

          function onResults(results) {
            if (
              $(document.getElementById('faceDetect')).prop('checked') ==
                true &&
              results.multiFaceLandmarks[0]
            ) {
              if (faceRecognitionState == 1) {
                console.log('Start Face Detection');
                speech('얼굴 인식이 시작되었습니다.');
              }
              if (results.multiFaceLandmarks[0][10].y <= 0.1) {
                console.log('Face Out Direction: Up');
                if (faceRecognitionState !== -1) {
                  faceRecognitionState = -1;
                  window.speechSynthesis.cancel();
                  speech('이탈. 아래쪽으로 이동하시오.');
                }
              } else if (results.multiFaceLandmarks[0][10].y >= 0.6) {
                console.log('Face Out Direction: Down');
                if (faceRecognitionState !== -2) {
                  faceRecognitionState = -2;
                  window.speechSynthesis.cancel();
                  speech('이탈. 위쪽으로 이동하시오.');
                }
              } else if (results.multiFaceLandmarks[0][234].x <= 0.1) {
                console.log('Face Out Direction: Right');
                if (faceRecognitionState !== -3) {
                  faceRecognitionState = -3;
                  window.speechSynthesis.cancel();
                  speech('이탈. 왼쪽으로 이동하시오.');
                }
              } else if (results.multiFaceLandmarks[0][454].x >= 0.9) {
                console.log('Face Out Direction: Left');
                if (faceRecognitionState !== -4) {
                  faceRecognitionState = -4;
                  window.speechSynthesis.cancel();
                  speech('이탈. 오른쪽으로 이동하시오.');
                }
              } else if (
                results.multiFaceLandmarks[0][10].y > 0.1 &&
                results.multiFaceLandmarks[0][10].y < 0.6 &&
                results.multiFaceLandmarks[0][234].x > 0.1 &&
                results.multiFaceLandmarks[0][234].x < 0.9
              ) {
                console.log('Face in Normal Range');
                if (faceRecognitionState !== 0) {
                  faceRecognitionState = 0;
                  window.speechSynthesis.cancel();
                  speech('정상 범위에 들어왔습니다.');
                }
              }
            } else if (
              $(document.getElementById('faceDetect')).prop('checked') !== true
            ) {
              faceRecognitionState = 1;
            }
          }

          var faceRecognitionState = 1;
          app.myfaceMesh.onResults(onResults);

          if (app.interval != null) {
            clearInterval(app.interval);
            app.interval = null;
          } else if (app.camerastate == true) {
            app.interval = setInterval(async () => {
              if (videoElement.videoWidth != 0) {
                await app.myfaceMesh.send({ image: videoElement });
              }
            }, 200);
          }
        },
        isLipMagnify: function () {},
      },
    });
  }

  toggleCameraInApp(isCameraOn) {
    this.camerastate = isCameraOn;
    const videoElement = document.getElementsByClassName(
      'input_video'
    )[0] as HTMLVideoElement;

    function onResults(results) {
      if (
        $(document.getElementById('faceDetect')).prop('checked') == true &&
        results.multiFaceLandmarks[0]
      ) {
        if (faceRecognitionState == 1) {
          console.log('Start Face Detection');
          speech('얼굴 인식이 시작되었습니다.');
        }
        if (results.multiFaceLandmarks[0][10].y <= 0.1) {
          console.log('Face Out Direction: Up');
          if (faceRecognitionState !== -1) {
            faceRecognitionState = -1;
            window.speechSynthesis.cancel();
            speech('이탈. 아래쪽으로 이동하시오.');
          }
        } else if (results.multiFaceLandmarks[0][10].y >= 0.6) {
          console.log('Face Out Direction: Down');
          if (faceRecognitionState !== -2) {
            faceRecognitionState = -2;
            window.speechSynthesis.cancel();
            speech('이탈. 위쪽으로 이동하시오.');
          }
        } else if (results.multiFaceLandmarks[0][234].x <= 0.1) {
          console.log('Face Out Direction: Right');
          if (faceRecognitionState !== -3) {
            faceRecognitionState = -3;
            window.speechSynthesis.cancel();
            speech('이탈. 왼쪽으로 이동하시오.');
          }
        } else if (results.multiFaceLandmarks[0][454].x >= 0.9) {
          console.log('Face Out Direction: Left');
          if (faceRecognitionState !== -4) {
            faceRecognitionState = -4;
            window.speechSynthesis.cancel();
            speech('이탈. 오른쪽으로 이동하시오.');
          }
        } else if (
          results.multiFaceLandmarks[0][10].y > 0.1 &&
          results.multiFaceLandmarks[0][10].y < 0.6 &&
          results.multiFaceLandmarks[0][234].x > 0.1 &&
          results.multiFaceLandmarks[0][234].x < 0.9
        ) {
          console.log('Face in Normal Range');
          if (faceRecognitionState !== 0) {
            faceRecognitionState = 0;
            window.speechSynthesis.cancel();
            speech('정상 범위에 들어왔습니다.');
          }
        }
      } else if (
        $(document.getElementById('faceDetect')).prop('checked') !== true
      ) {
        faceRecognitionState = 1;
      }
    }

    var faceRecognitionState = 1;
    app.myfaceMesh.onResults(onResults);
    if (isCameraOn == false) {
      clearInterval(app.interval);
      app.interval = null;
    } else if (
      $(document.getElementById('faceDetect')).prop('checked') == true
    ) {
      app.interval = setInterval(async () => {
        if (videoElement.videoWidth != 0) {
          await app.myfaceMesh.send({ image: videoElement });
        }
      }, 200);
    }
  }

  run() {
    if (location.hash) {
      this.createRoom.waitroomVueObject.isHost = false;
      this.createRoom.showCreateRoom();
    } else {
      this.createRoom.waitroomVueObject.isHost = true;
      this.createRoom.showCreateRoom();
    }
    $('#main').show();
    this.videogrid.recalculateLayout();
  }

  openConnection(newRoom: boolean = false) {
    if (!this.closed) {
      console.log('Id: ' + this.yourId + ' Room: ' + this.room);

      document.title = this.room + ' | ' + document.title;
      this.welcome.openDialog(newRoom, this.yourName ? false : true);

      this.addExchange();
      this.subtitleExtracttion();
      this.getSubtitle();

      this.preloadElements(function () {
        app.readyToCall = true;
        if (app.called) {
          app.callOther();
        }
      });

      app.devices.gotDevices(true);
      setTimeout(function () {
        if (!app.called) {
          app.callOther();
        }
      }, 1000);
      app.jsEvents();
    }
  }

  openWaitroom(newRoom: boolean = false) {
    if (!this.closed) {
      document.title = this.room + ' | ' + document.title;
      app.devices.gotDevices(true);
    }
  }

  subtitleExtracttion() {
    const annyang = require('annyang');

    annyang.setLanguage('ko');
    annyang.start({ autoRestart: true, continuous: true });

    var recognition = annyang.getSpeechRecognizer();
    var store = app.exchange.firestore;
    var db = store.collection(this.room);

    recognition.interimResults = true;

    recognition.onresult = function (event) {
      var final_transcript = '';

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          annyang.trigger(final_transcript);
        }
      }

      if (final_transcript) {
        var time = new Date();

        var timestamp =
          ('0' + time.getHours()).slice(-2) +
          ':' +
          ('0' + time.getMinutes()).slice(-2) +
          ':' +
          ('0' + time.getSeconds()).slice(-2);

        var text = final_transcript;
        var id = app.yourId;
        var from = app.yourName;

        if (app.controls.controlsVueObject.microphoneOn) {
          console.log('Insert Subtitle Data to FireBase');
          db.doc(time.getTime().toString()).set({ timestamp, from, id, text });
        }
      }
    };
  }

  selectSubtitleTarget(id) {
    var obj_length = document.getElementsByName('subtitle').length;
    var subtitle_ = <NodeListOf<HTMLInputElement>>(
      document.getElementsByName('subtitle')
    );

    for (var i = 0; i < obj_length; i++) {
      if (subtitle_[i].checked == true && subtitle_[i].value == id) {
        return true;
      }
    }
    return false;
  }

  getSubtitle() {
    var store = app.exchange.firestore;
    var db = store.collection(this.room);
    var _this = this;

    db.onSnapshot((snapshot) => {
      console.log('Read Subtitle Data from FireBase');
      if (
        $(document.getElementById('subtitleExtract')).prop('checked') == true &&
        document.getElementsByName('subtitle').length != 0
      ) {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            var getData = await db.doc(change.doc.id).get();
            var data = getData.data();
            var text = data.text.trim();
            var sub = `[${data.timestamp}][${data.from}] ${text}\n\n`;

            $(function () {
              if (_this.selectSubtitleTarget(getData.data().id)) {
                $('.subtitles').append(sub);
              }
            });
          }
        });
      }
    });
  }

  addExchange() {
    if (
      Settings.getValue(config, 'exchangeServices.service') == 'chat-server'
    ) {
      this.exchange = new ChatServer(this.room, this.yourId);
      app.exchange.addReadEvent(app.readMessage);
    } else {
      this.exchange = new Firebase(this.room, this.yourId, function () {
        app.exchange.addReadEvent(app.readMessage);
      });
    }
  }

  preloadElements(callback: () => void) {
    this.textchat.initialDatabase();
    Sounds.preloadSounds();
    IceServers.loadIceServers(callback);
  }

  initialCamera(first: boolean = false) {
    const constraints = {
      audio: {
        deviceId: this.devices.devicesVueObject.audio
          ? { exact: this.devices.devicesVueObject.audio }
          : undefined,
      },
    };
    if (!this.controls.controlsVueObject.cameraOn) {
      this.microphoneOnly = true;
    }
    if (!this.microphoneOnly) {
      constraints['video'] = {
        deviceId: this.devices.devicesVueObject.video
          ? { exact: this.devices.devicesVueObject.video }
          : undefined,
      };
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        app.setAsListener(false);
        if (!app.screen.onScreenMode()) {
          // @ts-ignore
          app.yourVideo.srcObject = stream;
        }
        app.localStream = stream;
        app.controls.initialiseStream();
        app.setStreamToPartners();

        if (first) {
          if (!app.called) {
            app.callOther();
          }
        }
      })
      .catch(function (err) {
        if (!app.microphoneOnly) {
          app.microphoneOnly = true;
          app.microphoneOnlyNotChangeable = true;
          app.initialCamera(first);
        } else {
          new Alert(Translator.get('mediaaccesserrormessage'));
          app.setAsListener(true);
          app.controls.initialiseStream();
          if (!app.called) {
            app.callOther();
          }
          console.log(err);
        }
      });
  }

  callOther() {
    this.called = true;
    if (this.readyToCall) {
      this.exchange.sendMessage({ call: 'init' });
    }
  }

  readMessage(sender: number, dataroom: string, msg) {
    if (app !== undefined && !app.closed) {
      console.log('Exchange message from: ' + sender);
      console.log(msg);
      if (
        !(sender in app.partners) &&
        (msg.call !== undefined || msg.sdp !== undefined)
      ) {
        app.addPartner(sender);
      }
      if (sender in app.partners && app.partners[sender]) {
        var partner = app.partners[sender];
        var partnerConnection = partner.connection;
        partner.lastPing = new Date();
        if (msg.call !== undefined) {
          partner.createOffer(true);
        } else if (msg.closing !== undefined) {
          partner.closeConnection();
          delete app.partners[sender];
        } else if (msg.ice !== undefined) {
          partnerConnection.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type === 'offer') {
          app.partners[sender].createAnswer(msg.sdp);
        } else if (msg.sdp.type === 'answer') {
          partnerConnection.setRemoteDescription(
            new RTCSessionDescription(msg.sdp)
          );
        }
      }
    }
  }

  addPartner(partnerId: number) {
    var cla = this;
    if (partnerId in app.partners) {
      this.partners[partnerId].closeConnection();
      delete this.partners[partnerId];
    }
    this.partners[partnerId] = null;
    this.partners[partnerId] = new Partner(
      partnerId,
      this.exchange,
      this.devices,
      this.textchat,
      this.videogrid,
      this.partnerOnConnected,
      this.partnerOnConnectionClosed,
      this.partnerOnConnectionLosed
    );
    this.setStreamToPartner(this.partners[partnerId], true);
    this.videogrid.recalculateLayout();

    setTimeout(() => {
      TTS.playSound(TTS.newpartnersound, this.partners[partnerId].name);
    }, 2000);

    if (app.firstlipdiv) {
      $('#lips-area').append(
        '<div id="mydiv"><div id="mydivheader">Click here to move</div><div id="lip-area" style="margin:0px"></div></div>'
      );
      var lips_area = document.getElementById('lips-area');
      lips_area.style.display = 'none';
      app.firstlipdiv = false;
    }

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

    $('#lip-area').append(
      '<canvas class="output_canvas-' +
        partnerId +
        '" id ="' +
        partnerId +
        '"></canvas>'
    );

    let thisPartner = app.partners[partnerId];
    thisPartner.lipcanvas = document.getElementsByClassName(
      'output_canvas-' + partnerId
    )[0] as HTMLCanvasElement;
    thisPartner.lipcanvas.style.display = 'none';
    thisPartner.lipcanvas.width = 300;
    thisPartner.lipcanvas.height = 200;
  }

  partnerOnConnected(partner: IPartner) {
    app.setStreamToPartner(partner);
  }

  partnerOnConnectionLosed(partner: IPartner) {}

  partnerOnConnectionClosed(partner: IPartner) {
    if (partner.id in app.partners) {
      delete this.partners[partner.id];
    }
  }

  setStreamToPartners() {
    for (var id in this.partners) {
      this.setStreamToPartner(this.partners[id]);
    }
  }

  setStreamToPartner(partner: IPartner, initial: boolean = false) {
    var reconnectionNeeded: boolean = false;
    if (app.localStream) {
      if (!app.microphoneOnly) {
        var videoTrack = !app.screen.onScreenMode()
          ? app.localStream.getVideoTracks()[0]
          : app.localScreenStream.getVideoTracks()[0];
        reconnectionNeeded = app.setTrackToPartner(
          partner,
          app.localStream,
          videoTrack,
          reconnectionNeeded
        );
      } else if (app.screen.onScreenMode()) {
        var videoTrack = app.localScreenStream.getVideoTracks()[0];
        reconnectionNeeded = app.setTrackToPartner(
          partner,
          app.localStream,
          videoTrack,
          reconnectionNeeded
        );
      }
      var audioTrack = app.localStream.getAudioTracks()[0];
      reconnectionNeeded = app.setTrackToPartner(
        partner,
        app.localStream,
        audioTrack,
        reconnectionNeeded
      );
    } else if (app.localScreenStream) {
      var videoTrack = app.localScreenStream.getVideoTracks()[0];
      reconnectionNeeded = app.setTrackToPartner(
        partner,
        app.localScreenStream,
        videoTrack,
        reconnectionNeeded
      );
    }
    if (!initial && reconnectionNeeded) {
      partner.reloadConnection();
    }
    partner.sendMessage(app.userinfo.getUserInfo());
  }

  setTrackToPartner(
    partner: IPartner,
    stream: any,
    track: any,
    reconnectionNeeded: boolean
  ): boolean {
    var sender = partner.connection.getSenders().find(function (s) {
      return s.track && track && s.track.kind == track.kind;
    });
    if (sender) {
      if (partner.connected) {
        sender.replaceTrack(track);
      }
    } else {
      partner.connection.addTrack(track, stream);
      return true;
    }
    return reconnectionNeeded;
  }

  sendMessageToAllPartners(message: any) {
    for (var id in this.partners) {
      if (this.partners[id]) {
        this.partners[id].sendMessage(message);
      }
    }
  }

  sidebarToogle(open: boolean) {
    $('.maincontainer').toggleClass('opensidebar');
    this.textchat.scrollToBottom();
    this.videogrid.recalculateLayout();
    //fix bug when calculation was wrong in the first calculation
    this.videogrid.recalculateLayout();
    //add history state on mobile to close sidebar on back button
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      if (open) {
        if (this.stateIsSet) {
          window.history.replaceState('forward', null, null);
        } else {
          window.history.pushState('forward', null, null);
          this.stateIsSet = true;
        }
      } else {
        window.history.replaceState('back', null, null);
      }
    }
  }

  setAsListener(listener: boolean) {
    this.listener = listener;
    this.yourVideoElement.videoVueObject.listener = listener;
    this.partnerListElement.partnerListElementVueObject.listener = listener;
  }

  hangOut() {
    if (!this.closed) {
      history.back();

      this.closed = true;
      this.exchange.sendMessage({ closing: this.yourId });
      this.exchange.closeConnection();

      for (var id in this.partners) {
        if (this.partners[id]) {
          this.partners[id].closeConnection();
        }
      }
      this.videogrid.recalculateLayout();
    }
  }

  jsEvents() {
    window.onhashchange = function () {
      if (app.room !== decodeURIComponent(location.hash.substring(1))) {
        location.reload();
      }
    };
    setInterval(function () {
      app.noInternet.setNoInternet(!window.navigator.onLine);
    }, 500);
    addEventListener('popstate', function (e) {
      if (app.stateIsSet) {
        if (app.controls.controlsVueObject.optionOn) {
          app.controls.controlsVueObject.toogleOption();
        } else {
          window.history.back();
        }
      }
      app.stateIsSet = false;
    });
    $(window).on('beforeunload', function () {
      app.hangOut();
    });
    $(window).on('unload', function () {
      app.hangOut();
    });
    $(window).on('pagehide', function () {
      app.hangOut();
    });
    window.onbeforeunload = app.hangOut;
    $(app.yourVideo).on('loadeddata', function () {
      app.videogrid.recalculateLayout();
    });
  }
}

var app = null;
$(function () {
  Translator.setTranslationsInHTML();
  app = new App();
  app.run();
});
