/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Switch } from '../components';
import { useState } from 'react';

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
  height: 500px;
  border-radius: 5% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: white;
  color: gray;
  justify-content: center;

  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
  }
`;

const gridContainer = css`
  display: grid;
  grid-template-columns: 3fr 1fr;
  background-color: white;
  width: 90%;
  row-gap: 30px;
  column-gap: 30px;

  div {
    background-color: transparent;
  }

  p {
    background-color: transparent;
    color: black;
  }
`;

const title = css`
  margin-bottom: 50px;
  background-color: white;
  color: #0071e3;
  font-size: calc(1vw + 15px);
  font-weight: bold;
`;

const text = css`
  font-size: calc(0.5vw + 13px);
  font-weight: bold;
`;

const Setting = ({ isSettingOn, setIsSettingOn }) => {
  return (
    <div css={settingContainer} onClick={() => setIsSettingOn()}>
      <Modal />
    </div>
  );
};

const Modal = () => {
  const [faceLocationAlarmToggle, setFaceLocationAlarmToggle] = useState(false);
  const [lipReadToggle, setLipReadToggle] = useState(false);
  const [lipMagnifyToggle, setLipMagnifyToggle] = useState(false);
  const [participantAlarmToggle, setParticipantAlarmToggle] = useState(false);

  const handleFaceLocationAlarmToggle = () => {
    setFaceLocationAlarmToggle(!faceLocationAlarmToggle);
  };

  const handleLipReadToggle = () => {
    setLipReadToggle(!lipReadToggle);
  };

  const handleLipMagnifyToggle = () => {
    setLipMagnifyToggle(!lipMagnifyToggle);
  };

  const handleParticipantAlarmToggle = () => {
    setParticipantAlarmToggle(!participantAlarmToggle);
  };

  return (
    <div css={modalContainer} onClick={(e) => e.stopPropagation()}>
      <p css={title}>편의 기능 제어</p>

      <div css={gridContainer}>
        <p css={text}>얼굴 벗어남 감지</p>
        <Switch
          isChecked={faceLocationAlarmToggle}
          handleToggle={handleFaceLocationAlarmToggle}
          id={1}
        />

        <p css={text}>자막 추출</p>
        <Switch
          isChecked={lipReadToggle}
          handleToggle={handleLipReadToggle}
          id={2}
        />

        <p css={text}>발화자 입 확대</p>
        <Switch
          isChecked={lipMagnifyToggle}
          handleToggle={handleLipMagnifyToggle}
          id={3}
        />

        <p css={text}>참여자 음성 알림</p>
        <Switch
          isChecked={participantAlarmToggle}
          handleToggle={handleParticipantAlarmToggle}
          id={7}
        />
      </div>
    </div>
  );
};

export default Setting;
