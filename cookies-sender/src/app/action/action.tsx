import { Route, Link, Routes } from 'react-router-dom';
import 'chrome';

import styles from './action.module.scss';

/* eslint-disable-next-line */
export interface ActionProps {}

export function Action(props: ActionProps) {
  return (
    <div className={styles['container']}>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <button
                onClick={() => {
                  window.chrome.tabs.query(
                    { active: true, currentWindow: true },
                    (tabs) => {
                      alert(tabs[0].url);
                    }
                  );
                  // chrome.cookies.get({}, (cookies) => {
                  //   console.log(cookies);
                  // });
                  console.log('click');
                }}
              >
                Click
              </button>
            </div>
          }
        />
        <Route path="/test" element={<div>This is the test route.</div>} />
      </Routes>
    </div>
  );
}

export default Action;
