/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import Setting from '../pages/Setting';
import Hotkey from '../pages/Hotkey';

const background = css`
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
`;
const container = css`
  width: 1000px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const logo = css`
  cursor: pointer;
  font-size: 30px;
`;
const menu = css`
  width: 125px;
  padding: 10px;
  border: none;
  border: 2px solid #ccc;
  border-radius: 5px;
  box-shadow: 5px 5px 15px #555;
  outline: none;
  cursor: pointer;
  margin-left: 30px;
  font-size: 20px;
  font-family: 'S-CoreDream-4Regular';

  :hover {
    color: black;
    background-color: whitesmoke;
    font-family: 'S-CoreDream-7ExtraBold';
  }
`;

function TopBar() {
  const [isSettingOn, setIsSettingOn] = useState(false);
  const [isHotkeyOn, setIsHotkeyOn] = useState(false);

  return (
    <>
      <div css={background}>
        <div css={container}>
          <Link to="/" css={logo}>
            모아영
          </Link>
          <div>
            <button css={menu} onClick={() => setIsHotkeyOn(!isHotkeyOn)}>
              단축키
            </button>
            <button css={menu} onClick={() => setIsSettingOn(!isSettingOn)}>
              기능 제어
            </button>
          </div>
        </div>
      </div>
      {isSettingOn && (
        <Setting
          isSettingOn={isSettingOn}
          setIsSettingOn={() => setIsSettingOn()}
        />
      )}
      {isHotkeyOn && (
        <Hotkey isHotkeyOn={isHotkeyOn} setIsHotkeyOn={() => setIsHotkeyOn()} />
      )}
    </>
  );
}

export default TopBar;
