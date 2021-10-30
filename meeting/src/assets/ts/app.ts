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
import { Hotkey } from './Elements/Hotkey';
import { Switch } from './Elements/Switch';
import '@mediapipe/face_mesh';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Hands } from '@mediapipe/hands';

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

  utterThis.lang = lang;
  utterThis.pitch = 1;
  utterThis.rate = 1.2; //속도

  window.speechSynthesis.speak(utterThis);
}
function Mobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function faceRelocateVoice() {
  if (app.faceDetectionState == -1) {
    if (Mobile()) {
      speech('이탈. 핸드폰을 위로 움직이세요.');
    } else {
      speech('이탈. 아래쪽으로 이동하시오.');
    }
  } else if (app.faceDetectionState == -2) {
    if (Mobile()) {
      speech('이탈. 핸드폰을 아래로 움직이세요.');
    } else {
      speech('이탈. 위쪽으로 이동하시오.');
    }
  } else if (app.faceDetectionState == -3) {
    if (Mobile()) {
      speech('이탈. 핸드폰을 오른쪽으로 움직이세요.');
    } else {
      speech('이탈. 왼쪽으로 이동하시오.');
    }
  } else if (app.faceDetectionState == -4) {
    if (Mobile()) {
      speech('이탈. 핸드폰을 왼쪽으로 움직이세요.');
    } else {
      speech('이탈. 오른쪽으로 이동하시오.');
    }
  }

  app.faceDetectionStateCount = 0;
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
  hotkey: Hotkey;
  switch_: Switch;

  subtitleExtract: HTMLElement;
  libMagnify: HTMLElement;
  participantAlarm: HTMLElement;

  firstlipdiv: boolean = true;
  fisrtFaceDetection: boolean = true;

  isInWaitroom: boolean = true;
  waitroomCameraOn: boolean = true;

  myFaceMesh: FaceMesh;
  faceLeft: number;
  faceRight: number;
  faceUp: number;
  faceDown: number;
  isStartFaceDetect: boolean;
  isFaceDetectionSet: boolean = false;
  faceDetectionState: any = -99;
  faceDetectionStateCount: any;
  partnerfaceMesh: FaceMesh;
  isVideoLoading: boolean = false;
  isEntering: boolean = false;

  myHands: Hands;
  isHandIn: boolean = false;
  isHandDetectionSpeaking: boolean = false;

  featureOnOffVueObject: any;
  camerastate: boolean;
  interval: any;
  videoLoadingInterval: any;

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
    this.hotkey = new Hotkey(this);
    this.switch_ = new Switch(this);
    this.videogrid.init();

    this.camerastate = this.controls.controlsVueObject.cameraOn;

    this.subtitleExtract = document.getElementById('subtitleExtract');
    this.libMagnify = document.getElementById('libMagnify');
    this.participantAlarm = document.getElementById('participantAlarm');

    this.faceDown = 1;
    this.faceLeft = 0;
    this.faceRight = 1;
    this.faceUp = 0;

    this.myFaceMesh = new FaceMesh({
      locateFile: (file) => {
        console.log('얼굴인식 로드');
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    this.myFaceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    this.myFaceMesh.initialize();

    this.myHands = new Hands({
      locateFile: (file) => {
        console.log('손 로드');
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1632795355
        /${file}`;
      },
    });
    this.myHands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    this.isStartFaceDetect = true;

    this.featureOnOffVueObject = new Vue({
      el: '#settingSwitch',
      data: {
        setting: false,
      },
      methods: {
        isFaceDetect: function () {
          app.faceDetectionStateCount = 0;
          app.isStartFaceDetect = true;

          app.myHands.onResults(onResultsOnHands);
          app.myFaceMesh.onResults(onResultsOnFaceMesh);

          if (app.fisrtFaceDetection) {
            app.interval = setInterval(async () => {
              if (
                ((app.isInWaitroom && app.waitroomCameraOn) ||
                  (!app.isInWaitroom && app.camerastate)) &&
                $(document.getElementById('faceDetect')).prop('checked') ==
                  true &&
                app.faceDetectionState == -99
              ) {
                app.faceDetectionState = 1;
                console.log('Face Detection On');
                speech('얼굴 인식 기능이 켜졌습니다. 잠시만 기다려주세요.');
              }
              if (app.fisrtFaceDetection) {
                app.fisrtFaceDetection = false;
                console.log('Start 5s Delay');
                app.myHands.initialize();

                setTimeout(function () {
                  console.log('Finish 5s Delay');
                  app.faceDetectionState = 1;
                  app.isFaceDetectionSet = true;
                }, 5000);
              } else if (app.isFaceDetectionSet) {
                //얼굴인식 세팅이 완료된 상태
                if (
                  app.isStartFaceDetect &&
                  ((app.isInWaitroom && app.waitroomCameraOn) ||
                    (!app.isInWaitroom && app.camerastate)) &&
                  $(document.getElementById('faceDetect')).prop('checked') ==
                    true
                ) {
                  app.isStartFaceDetect = false;
                  speech('얼굴인식을 시작합니다.');
                }

                if (app.isInWaitroom) {
                  // 현재의 방에 따라 비디오 바꿔주기
                  var face_input = document.getElementById(
                    'waitroomVideo'
                  ) as HTMLVideoElement;
                } else {
                  var face_input = document.getElementsByClassName(
                    'input_video'
                  )[0] as HTMLVideoElement;
                }

                if (face_input == null) {
                  if (!app.isEntering) {
                    var count = 0;
                    app.isEntering = true;
                    app.isInWaitroom = false;

                    app.videoLoadingInterval = setInterval(async () => {
                      window.speechSynthesis.cancel();
                      console.log('Video Loading...');
                      count++;
                      if (count == 15) {
                        clearInterval(app.videoLoadingInterval);
                        app.isVideoLoading = false;
                        console.log('Video Loading Complete');
                        app.faceDetectionState = 1;
                      }
                    }, 200);
                  }
                } else if (face_input.videoHeight != 0) {
                  if (
                    ((app.isInWaitroom && app.waitroomCameraOn) ||
                      (!app.isInWaitroom && app.camerastate)) &&
                    $(document.getElementById('faceDetect')).prop('checked') ==
                      true
                  ) {
                    if (!Mobile()) {
                      console.log('Send Hand Data');
                      await app.myHands.send({
                        image: face_input,
                      });
                    }
                    await app.myFaceMesh.send({
                      image: face_input,
                    });
                  }
                }
              }
            }, 200);
          }

          function onResultsOnHands(results) {
            if (
              $(document.getElementById('faceDetect')).prop('checked') ==
                true &&
              results.multiHandLandmarks.length > 0
            )
              app.isHandIn = true;
            else if (
              $(document.getElementById('faceDetect')).prop('checked') ==
                true &&
              results.multiHandLandmarks.length <= 0
            )
              app.isHandIn = false;
          }
          function onResultsOnFaceMesh(results) {
            if (app.isVideoLoading) console.log('Video Loading...');
            else if (
              $(document.getElementById('faceDetect')).prop('checked') ==
                true &&
              results.multiFaceLandmarks[0]
            ) {
              if (results.multiFaceLandmarks[0][10].y <= app.faceUp) {
                console.log('Face Out Direction: Up');
                if (app.faceDetectionState !== -1) {
                  if (
                    app.faceDetectionState !== 1 ||
                    !app.isHandDetectionSpeaking
                  )
                    window.speechSynthesis.cancel();
                  app.faceDetectionState = -1;
                  speech('이탈. 아래쪽으로 이동하시오.');
                  app.faceDetectionStateCount = 0;
                } else app.faceDetectionStateCount++;
              } else if (results.multiFaceLandmarks[0][152].y >= app.faceDown) {
                console.log('Face Out Direction: Down');
                if (app.faceDetectionState !== -2) {
                  if (
                    app.faceDetectionState !== 1 ||
                    !app.isHandDetectionSpeaking
                  )
                    window.speechSynthesis.cancel();
                  app.faceDetectionState = -2;
                  speech('이탈. 위쪽으로 이동하시오.');
                  app.faceDetectionStateCount = 0;
                } else app.faceDetectionStateCount++;
              } else if (results.multiFaceLandmarks[0][234].x <= app.faceLeft) {
                console.log('Face Out Direction: Right');
                if (app.faceDetectionState !== -3) {
                  if (
                    app.faceDetectionState !== 1 ||
                    !app.isHandDetectionSpeaking
                  ) {
                    window.speechSynthesis.cancel();
                    app.faceDetectionState = -3;
                    speech('이탈. 왼쪽으로 이동하시오.');
                    app.faceDetectionStateCount = 0;
                  }
                } else app.faceDetectionStateCount++;
              } else if (
                results.multiFaceLandmarks[0][454].x >= app.faceRight
              ) {
                console.log('Face Out Direction: Left');
                if (app.faceDetectionState !== -4) {
                  if (
                    app.faceDetectionState !== 1 ||
                    !app.isHandDetectionSpeaking
                  )
                    window.speechSynthesis.cancel();
                  app.faceDetectionState = -4;
                  speech('이탈. 오른쪽으로 이동하시오.');
                  app.faceDetectionStateCount = 0;
                } else app.faceDetectionStateCount++;
              } else if (
                results.multiFaceLandmarks[0][10].y > app.faceUp &&
                results.multiFaceLandmarks[0][152].y < app.faceDown &&
                results.multiFaceLandmarks[0][234].x > app.faceLeft &&
                results.multiFaceLandmarks[0][234].x < app.faceRight
              ) {
                console.log('Face in Normal Range');
                if (app.faceDetectionState !== 0) {
                  if (app.faceDetectionState !== 1)
                    window.speechSynthesis.cancel();
                  app.faceDetectionState = 0;
                  speech('정상 범위에 들어왔습니다.');
                  app.faceDetectionStateCount = 0;
                }
              }

              app.isHandDetectionSpeaking = false;
            } else if (
              ((app.isInWaitroom && app.waitroomCameraOn) ||
                (!app.isInWaitroom && app.camerastate)) &&
              $(document.getElementById('faceDetect')).prop('checked') ==
                true &&
              results.multiFaceLandmarks.length <= 0
            ) {
              console.log('Face Total Out');
              if (app.faceDetectionState !== -100) {
                if (
                  app.faceDetectionState !== 1 ||
                  !app.isHandDetectionSpeaking
                )
                  window.speechSynthesis.cancel();
                app.faceDetectionState = -100;
                app.isHandDetectionSpeaking = false;
                speech('얼굴이 화면 밖으로 완전히 벗어났습니다.');
                speech('앵글 범위를 찾기 위해 손을 천천히 흔들어보세요');
                app.faceDetectionStateCount = -25;
              } else {
                app.faceDetectionStateCount++;

                if (app.isHandIn) {
                  console.log('Face Total out & Hand in');
                  if (!app.isHandDetectionSpeaking) {
                    app.isHandDetectionSpeaking = true;
                    if (app.faceDetectionState !== 1)
                      window.speechSynthesis.cancel();
                    speech(
                      '손이 화면에 들어왔습니다. 손의 위치로 얼굴을 이동해주세요'
                    );
                    setTimeout(function () {
                      app.isHandDetectionSpeaking = false;
                    }, 25000);
                  }
                }
              }
            }
            if (app.faceDetectionStateCount == 25) {
              speech('아직 정상 범위에 들어오지 않았습니다');
              if (app.faceDetectionState == -100) {
                speech('앵글 범위를 찾기 위해 손을 천천히 흔들어보세요');
                app.faceDetectionStateCount = -25;
              } else {
                faceRelocateVoice();
                app.faceDetectionStateCount = -20;
              }
            }
          }
        },

        isLipMagnify: function () {},
      },
    });
  }

  toggleCameraInApp(isCameraOn) {
    var count = 0;
    app.camerastate = isCameraOn;

    if (isCameraOn) {
      app.isVideoLoading = true;
      app.videoLoadingInterval = setInterval(async () => {
        window.speechSynthesis.cancel();
        console.log('Video Loading...');
        count++;
        if (count == 15) {
          clearInterval(app.videoLoadingInterval);
          app.isVideoLoading = false;
          console.log('Video Loading Complete');
          app.faceDetectionState = 1;
        }
      }, 200);
    }
  }

  run() {
    if (location.hash) {
      this.createRoom.waitroomVueObject.isHost = false;
      this.createRoom.showCreateRoom();
      this.createRoom.openDialog(this.yourName ? false : true);
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

    console.log(annyang);

    var recognition = annyang.getSpeechRecognizer();

    console.log(recognition);
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

      console.log('자막:', final_transcript);
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

    if ($(document.getElementById('participantAlarm')).prop('checked')) {
      setTimeout(() => {
        TTS.playSound(TTS.newpartnersound, this.partners[partnerId].name);
      }, 2000);
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
