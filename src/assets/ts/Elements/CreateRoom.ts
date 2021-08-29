import { App } from "../app";
import { Translator } from "../Utils/Translator";
import { Settings } from "../Utils/Settings";
import config from "../../../config.json"
import { Cookie } from "../Utils/Cookie";
import { Alert } from "./Alert";

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
                        location.reload();
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
                        location.hash = this.roomName;
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
                    if(!cla.app.microphoneOnlyNotChangeable && cla.app.localStream !== undefined){
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