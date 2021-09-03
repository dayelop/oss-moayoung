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
  //background-color: black;
  width: 600px;
  height: 500px;
  border-radius: 5% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  //color: white;
  background-color: white;
  color: gray;
  justify-content: center;
`;

const optionContainer = css`
  width: 300px;
  height: 50px;
  //background-color: red;
  margin: 10px;
  margin-right: 100px;
  background-color: white;
`;

const switchContainer = css`
  width: 50px;
  height: 50px;
  //background-color: blue;
  margin: 10px;
  background-color: white;
`;

const optionAndSwitchContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: white;
`;

const textContainer = css`
  //display: flex;
  //flex-direction: column;
  //justify-content: center;
  //align-items: center;
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
      <h1
        style={{
          marginBottom: '30px',
          backgroundColor: 'white',
          color: '#0071e3',
        }}
      >
        편의 기능 제어
      </h1>

      <div css={textContainer}>
        <div css={optionAndSwitchContainer}>
          <div css={optionContainer}>
            <h2
              css={css`
                background-color: white;
                color: gray;
              `}
            >
              얼굴 벗어남 감지
            </h2>
          </div>
          <div css={switchContainer}>
            <Switch
              isChecked={faceLocationAlarmToggle}
              handleToggle={handleFaceLocationAlarmToggle}
              id={1}
            />
          </div>
        </div>

        <div css={optionAndSwitchContainer}>
          <div css={optionContainer}>
            <h2
              css={css`
                background-color: white;
                color: gray;
              `}
            >
              자막 추출
            </h2>
          </div>
          <div css={switchContainer}>
            <Switch
              isChecked={lipReadToggle}
              handleToggle={handleLipReadToggle}
              id={2}
            />
          </div>
        </div>

        <div css={optionAndSwitchContainer}>
          <div css={optionContainer}>
            <h2
              css={css`
                background-color: white;
                color: gray;
              `}
            >
              발화자 입 확대
            </h2>
          </div>
          <div css={switchContainer}>
            <Switch
              isChecked={lipMagnifyToggle}
              handleToggle={handleLipMagnifyToggle}
              id={3}
            />
          </div>
        </div>
        <div css={optionAndSwitchContainer}>
          <div css={optionContainer}>
            <h2
              css={css`
                background-color: white;
                color: gray;
              `}
            >
              참여자 음성 알림
            </h2>
          </div>
          <div css={switchContainer}>
            <Switch
              isChecked={participantAlarmToggle}
              handleToggle={handleParticipantAlarmToggle}
              id={7}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
