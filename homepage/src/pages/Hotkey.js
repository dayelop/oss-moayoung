/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useRef } from 'react';

const settingContainer = css`
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const modalContainer = css`
  width: 600px;
  height: 700px;
  border-radius: 5% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: white;
  color: gray;
  justify-content: center;

  h2 {
    background-color: white;
    color: black;
  }
`;

const textContainer = css`
  display: grid;
  grid-template-columns: 3fr 1fr;
  row-gap: 25px;
  background-color: white;
  column-gap: 90px;
`;

const title = css`
  margin-bottom: 30px;
  background-color: white;
  color: #0071e3;
`;

const Hotkey = ({ isHotkeyOn, setIsHotkeyOn }) => {
  return (
    <div css={settingContainer} onClick={() => setIsHotkeyOn()}>
      <Modal />
    </div>
  );
};

const Item = ({ title, hotkey }) => {
  return (
    <>
      <h2>{title}</h2>
      <h2>ctrl + {hotkey}</h2>
    </>
  );
};

const Modal = () => {
  const _audio = useRef();

  React.useEffect(() => {
    keyevent();
  });

  const keyevent = () => {
    var isCtrl = false;

    document.onkeyup = function (e) {
      if (e.which === 17) isCtrl = false;
    };

    document.onkeydown = function (e) {
      if (e.which === 17) isCtrl = true;

      if (e.which === 73 && isCtrl === true) {
        _audio.current.currentTime = 0;
        _audio.current.play();
        return false;
      }
    };
  };

  return (
    <div css={modalContainer} onClick={(e) => e.stopPropagation()}>
      <h1 css={title}>단축키 알림</h1>
      <audio
        id="alarmAudio"
        src="/sounds/hotkeyAlarm.mp3"
        ref={_audio}
        autoPlay
      ></audio>
      <div css={textContainer}>
        <Item title={'마이크 ON/OFF'} hotkey={'m'} />
        <Item title={'카메라 ON/OFF'} hotkey={'c'} />
        <Item title={'화면 공유'} hotkey={'s'} />
        <Item title={'옵션'} hotkey={'o'} />
        <Item title={'통화방 입/퇴장'} hotkey={'e'} />
        <Item title={'얼굴 벗어남 감지 ON/OFF'} hotkey={'f'} />
        <Item title={'자막 추출 ON/OFF'} hotkey={'b'} />
        <Item title={'발화자 입 확대 ON/OFF'} hotkey={'l'} />
        <Item title={'참여자 음성 알림 ON/OFF'} hotkey={'a'} />
        <Item title={'다시 듣기'} hotkey={'i'} />
      </div>
    </div>
  );
};

export default Hotkey;
