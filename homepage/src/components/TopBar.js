/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';

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
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: 80%;
  }
`;
const logo = css`
  cursor: pointer;
  font-size: 30px;

  @media (max-width: 768px) {
    font-size: 27px;
  }
`;

const menuContainer = css`
  & button:first-of-type {
    @media (max-width: 600px) {
      display: none;
    }
  }
`;

const menu = css`
  width: 125px;
  padding: 10px;
  border: none;
  border: 2px solid #ccc;
  border-top: 0px;
  border-radius: 0px 0px 15px 15px;
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

  @media (max-width: 600px) {
    font-size: 17px;
  }
`;

function TopBar() {
  const [isHotkeyOn, setIsHotkeyOn] = useState(false);

  return (
    <>
      <div css={background}>
        <div css={container}>
          <div css={logo}>모아영</div>
          <div css={menuContainer}>
            <button css={menu} onClick={() => setIsHotkeyOn(!isHotkeyOn)}>
              단축키
            </button>
          </div>
        </div>
      </div>
      {isHotkeyOn && (
        <Hotkey isHotkeyOn={isHotkeyOn} setIsHotkeyOn={() => setIsHotkeyOn()} />
      )}
    </>
  );
}

export default TopBar;
