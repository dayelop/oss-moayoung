import { IPartner } from "../Partner/IPartner";
import { Translator } from "../Utils/Translator";

declare var Vue: any;

export class Video{

    element: HTMLElement;
    partner: IPartner;
    myVideo: HTMLElement;//

    videoVueObject: any;

    constructor(element: HTMLElement, partner: IPartner){
        this.element = element;
        this.partner = partner;
        this.myVideo = document.getElementById('yourVideoArea');
        this.addCodeToVideoElement();
        this.setVueElement();
    }

    addCodeToVideoElement(){
        $(this.element).find(".video-wrap").append(`
            <div class="video-info-wrap" v-on:dblclick="expand" v-bind:class="{'cammeraoff': cameraOff  && !screenSharing}">
                <div class="video-name">{{name}} 
                <span v-bind:class="{'on': !listener}" class="listener fas fa-eye"></span>
                <span v-bind:class="{'on': !muted || listener}" class="microphone fas fa-microphone-slash"></span> 
                <span v-bind:class="{'on': !cameraOff || listener}" class="camera fas fa-video-slash"></span>
                <span v-bind:class="{'on': !screenSharing}" class="screen fas fa-desktop"></span>
                ${this.element === this.myVideo ? '' : `<div class="onoffswitch">
                <input type="radio" name="lipDetecting" class="onoffswitch-checkbox" id="${this.partner.id + 12}" value="${this.partner.id}" onclick="libSelect()">
                <label class="onoffswitch-label" for="${this.partner.id + 12}">
                    <div class="onoffswitch-inner">
                        <div class="onoffswitch-active">
                            <div class="onoffswitch-switch">확대</div>
                        </div>
                        <div class="onoffswitch-inactive">
                            <div class="onoffswitch-switch">확대</div>
                        </div>
                    </div>
                </label>
            </div>
            
            <div class="onoffswitch">
                <input type="checkbox" name="subtitle" class="onoffswitch-checkbox" id="subtitle-${this.partner.id}" value="${this.partner.id}">
                <label class="onoffswitch-label" for="subtitle-${this.partner.id}">
                    <div class="onoffswitch-inner">
                        <div class="onoffswitch-active">
                            <div class="onoffswitch-switch">자막</div>
                        </div>
                        <div class="onoffswitch-inactive">
                            <div class="onoffswitch-switch">자막</div>
                        </div>
                    </div>
                </label>
            </div>`}
                </div>
                <div v-on:click="expand" v-bind:class="{'fa-compress-arrows-alt': expanded, 'fa-expand-arrows-alt': !expanded}" class="expand fas"></div>
                <div class="connect">
                    <span class="fas fa-sync"></span>
                    <span class="text">${Translator.get("connect")}</span>
                </div>
            </div>
        `);
    }

    setVueElement(){
        let cla = this;
        this.videoVueObject = new Vue({
            el: $(this.element).find(".video-info-wrap").get(0),
            data: {
                name: cla.partner ? cla.partner.getName() : Translator.get("You"),
                expanded: false,
                muted: false,
                cameraOff: false,
                screenSharing: false,
                listener: false
            },
            methods: {
                expand: function(){
                    $(cla.element).toggleClass("big");
                    this.expanded = !this.expanded;
                }
            }
        });
    }
}