/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

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
  //background-color: black;
  width: 600px;
  height: 700px;
  border-radius: 5% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  //color: white;
  background-color: white;
  color: gray;
  justify-content: center;

  h2 {
    background-color: white;
    color: black;
  }
`;

const textContainer = css`
  display: flex;
  flex-direction: column;
`;

const textDiv = css`
  display: flex;
  flex-direction: row;
  background-color: white;
  justify-content: space-between;

  h2 {
    margin: 13px;
  }

  h2:nth-of-type(1) {
    color: gray;
    margin-right: 60px;
  }
`;

const Hotkey = ({ isHotkeyOn, setIsHotkeyOn }) => {
  return (
    <div css={settingContainer} onClick={() => setIsHotkeyOn()}>
      <Modal />
    </div>
  );
};

const Modal = () => {
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

      if (e.which === 82 && isCtrl === true) {
        console.log('replay');
        const alarmAudio = document.getElementById('alarmAudio');
        alarmAudio.currentTime = 0;
        alarmAudio.play();
        return false;
      }
    };
  };

  return (
    <div css={modalContainer} onClick={(e) => e.stopPropagation()}>
      <h1
        style={{
          marginBottom: '30px',
          backgroundColor: 'white',
          color: '#0071e3',
        }}
      >
        단축키 알림
      </h1>
      <audio id="alarmAudio" src="/sounds/hotkeyAlarm.mp3" autoPlay></audio>{' '}
      {/*autoplay */}
      <div css={textContainer}>
        <div css={textDiv}>
          <h2>마이크 ON/OFF</h2>
          <h2>ctrl + m</h2>
        </div>

        <div css={textDiv}>
          <h2>카메라 ON/OFF</h2>
          <h2>ctrl + c</h2>
        </div>

        <div css={textDiv}>
          <h2>화면 공유</h2>
          <h2>ctrl + s</h2>
        </div>

        <div css={textDiv}>
          <h2>옵션</h2>
          <h2>ctrl + o</h2>
        </div>

        <div css={textDiv}>
          <h2>통화방 퇴장</h2>
          <h2>ctrl + e</h2>
        </div>

        <div css={textDiv}>
          <h2>얼굴 벗어남 감지 ON/OFF</h2>
          <h2>ctrl + f</h2>
        </div>

        <div css={textDiv}>
          <h2>자막 추출 ON/OFF</h2>
          <h2>ctrl + t</h2>
        </div>

        <div css={textDiv}>
          <h2>발화자 입 확대 ON/OFF</h2>
          <h2>ctrl + l</h2>
        </div>

        <div css={textDiv}>
          <h2>참여자 음성 알림 ON/OFF</h2>
          <h2>ctrl + a</h2>
        </div>

        <div css={textDiv}>
          <h2 style={{ color: '#0071e3' }}>다시 듣기</h2>
          <h2>ctrl + r</h2>
        </div>
      </div>
    </div>
  );
};

export default Hotkey;
