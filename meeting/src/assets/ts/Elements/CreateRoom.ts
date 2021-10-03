import { App , speech } from "../app";
import { Translator } from "../Utils/Translator";
import { Settings } from "../Utils/Settings";
import config from "../../../config.json"
import { Cookie } from "../Utils/Cookie";
import { Alert } from "./Alert";
import '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

declare var Vue: any;

export class CreateRoom{

    app: App;
    createRoomVueObject: any; 

    readonly microphoneCookie: string = 'microphoneOn';
    readonly cameraCookie: string = 'cameraOn';


    constructor(app: App){
        this.app = app;
        this.initialElements();

    }

    initialElements(){
        let cla = this;
        this.createRoomVueObject = new Vue({
            el: '#create-room',
            data: {
                showDialog: false,
                showInner: true,
                showWaitroom: false,
                roomNameLabel: Translator.get("roomname"),
                roomName: "",
                title: Settings.getValueOrDefault(config, "meta.title"),
                imprint: Settings.getValueOrDefault(config, "privacy.imprint"),
                gdpr: Settings.getValueOrDefault(config, "privacy.gdpr"),

                microphoneOn: Cookie.getCookie(cla.microphoneCookie) == 'false' ? false : true,
                cameraOn: Cookie.getCookie(cla.cameraCookie) == 'false' ? false : true,
                hangouted: false,
                screenOn: false,
                optionOn: false,
                screenSharingNotAllowed: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                hasNewMessage: false
            },
            methods: {
                createRoom: function(){
                    if(this.roomName !== ""){
                        cla.app.room = this.roomName;
                        location.hash = this.roomName;
                        cla.app.openConnection(true);
                        cla.app.invite.resetLink();
                        this.showDialog = false;
                        // location.reload();
                    }
                },
                setRandomName: function(){
                    this.roomName = cla.randomName(20);
                },
                openWaitroom: function() {
                    if(this.roomName !== ""){
                        this.showInner = false;
                        this.showWaitroom = true;
                        cla.app.room = this.roomName;
                        cla.app.openWaitroom(true);

                        const mediaStreamConstraints = {
                            video: true,
                        };

                        const localVideo = document.getElementById('waitroomVideo') as HTMLMediaElement;
                        let localStream;

                        function gotLocalMediaStream(mediaStream) {
                        localStream = mediaStream;
                        localVideo.srcObject = mediaStream;
                        }

                        function handleLocalMediaStreamError(error) {
                        console.log('navigator.getUserMedia error: ', error);
                        }

                        navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
                        .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

                        const videoElement = document.getElementById('waitroomVideo') as HTMLVideoElement;
                        var faceRecognitionState = 1;

                        function onResults(results) {
                            //document.getElementsByClassName('camera fas fa-video')[0])
                            //document.getElementById('waitroomVideo') !== null
                            if (cla.app.waitRoomCamOn && results.multiFaceLandmarks[0]) {
                                console.log("클릭안함");
                                console.log(results.multiFaceLandmarks[0][10]);
                                if (faceRecognitionState == 1) {
                                    console.log("얼굴인식시작")
                                    speech('얼굴 인식이 시작되었습니다.');
                                }
                                if ( results.multiFaceLandmarks[0][10].y <= 0.1) {
                                    console.log("얼굴 위쪽으로 이탈");
                                    if (faceRecognitionState !== -1) {
                                        faceRecognitionState = -1;
                                        window.speechSynthesis.cancel();
                                        speech('이탈. 아래쪽으로 이동하시오.');
                                    }
                                }
                                else if ( results.multiFaceLandmarks[0][10].y >= 0.6) {
                                    console.log("얼굴 아래쪽으로 이탈");
                                    if (faceRecognitionState !== -2) {
                                        faceRecognitionState = -2;
                                        window.speechSynthesis.cancel();
                                        speech('이탈. 위쪽으로 이동하시오.');
                                    }
                                }
                                else if ( results.multiFaceLandmarks[0][234].x <= 0.1) {
                                    console.log("얼굴 오른쪽으로 이탈");
                                    if (faceRecognitionState !== -3) {
                                        faceRecognitionState = -3;
                                        window.speechSynthesis.cancel();
                                        speech('이탈. 왼쪽으로 이동하시오.');
                                    }
                                }
                                else if ( results.multiFaceLandmarks[0][454].x >= 0.9) {
                                    console.log("얼굴 왼쪽으로 이탈");
                                    if (faceRecognitionState !== -4) {
                                        faceRecognitionState = -4;
                                        window.speechSynthesis.cancel();
                                        speech('이탈. 오른쪽으로 이동하시오.');
                                    }
                                }
                                else if (results.multiFaceLandmarks[0][10].y > 0.1 && results.multiFaceLandmarks[0][10].y < 0.6 
                                    && results.multiFaceLandmarks[0][234].x > 0.1 && results.multiFaceLandmarks[0][234].x < 0.9) {
                                    console.log("얼굴 정상범위");
                                    if (faceRecognitionState !== 0) {
                                        faceRecognitionState = 0;
                                        window.speechSynthesis.cancel();
                                        speech('정상 범위에 들어왔습니다.');
                                    }
                                }
                            } else if (!cla.app.waitRoomCamOn) {
                                faceRecognitionState = 1;
                                console.log("카메라 오프");
                            }
                        }

                        cla.app.waitroomFaceMesh.onResults(onResults);

                        const camera = new Camera(videoElement, {
                            onFrame: async () => {
                            await cla.app.waitroomFaceMesh.send({image: videoElement});
                            },
                            width: 1280,
                            height: 720
                        });
                        camera.start();
                    }
                },
                toogleMicrophone: function () {
                    if(cla.app.localStream !== undefined){
                    this.microphoneOn = !this.microphoneOn;
                    Cookie.setCookie(cla.microphoneCookie, this.microphoneOn);
                    cla.toogleStreamMicrophone(false);
                    cla.app.sendMessageToAllPartners(cla.app.userinfo.getUserInfo());
                    } else {
                        new Alert(Translator.get("cannotstartmicrophone"));
                    }
                },
                toogleCamera: function () {
                    cla.app.waitRoomCamOn = !cla.app.waitRoomCamOn;
                    if(!cla.app.microphoneOnlyNotChangeable && cla.app.localStream !== undefined){
                        this.camIsActivated = !this.camIsActivated;
                        this.cameraOn = !this.cameraOn;
                        cla.app.microphoneOnly = !this.cameraOn;
                        Cookie.setCookie(cla.cameraCookie, this.cameraOn);
                        cla.toogleStreamCamera();
                        cla.app.sendMessageToAllPartners(cla.app.userinfo.getUserInfo());

                    } else {
                        new Alert(Translator.get("cannotstartcamera"));
                    }
                },hangOut: function () {
                    if(!this.hangouted){
                        cla.hangOut();
                        this.hangouted = true;
                    } else{
                        location.hash = cla.app.room;
                        location.reload();
                    }                    
                }, toogleScreen: function(){
                    if(cla.app.screen.onScreenMode()){
                        cla.app.screen.stopScreen();
                    }else{
                        cla.app.screen.startScreen();
                    }
                }, toogleOption: function(){
                    this.optionOn = !this.optionOn;
                    cla.toogleOption(); 
                }
            }
        });
    }

    showCreateRoom(show: boolean = true){
        this.createRoomVueObject.showDialog = show;
    }

    randomName(length) {
        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    toogleStreamMicrophone(changeCamera: boolean = true)
    {
        if(this.app.localStream == undefined){
            this.createRoomVueObject.microphoneOn = false;  
        }else {
            this.app.localStream.getAudioTracks()[0].enabled = this.createRoomVueObject.microphoneOn;
            if(changeCamera && this.createRoomVueObject.microphoneOn){
                this.app.initialCamera();  
            }
        }
        this.setMutedIcon();
    }

    toogleStreamCamera(changeCamera: boolean = true)
    {
        if(this.app.microphoneOnlyNotChangeable || this.app.localStream == undefined){
            this.createRoomVueObject.cameraOn = false;  
        } else {
            if(this.app.localStream.getVideoTracks()[0] != undefined){
                this.app.localStream.getVideoTracks()[0].enabled = this.createRoomVueObject.cameraOn;
            }
            if(changeCamera){
                this.app.initialCamera();
            }
        }
        this.setCameraOffIcon();
    }

    setMutedIcon(){
        this.app.yourVideoElement.videoVueObject.muted = !this.createRoomVueObject.microphoneOn;
        this.app.partnerListElement.partnerListElementVueObject.muted = !this.createRoomVueObject.microphoneOn;
    }

    setCameraOffIcon(){
        this.app.yourVideoElement.videoVueObject.cameraOff = !this.createRoomVueObject.cameraOn;
        this.app.partnerListElement.partnerListElementVueObject.cameraOff = !this.createRoomVueObject.cameraOn;
    }

    toogleOption(){
        this.app.sidebarToogle(this.createRoomVueObject.optionOn);
    }

    hangOut(){
        this.app.hangOut();
    }
}