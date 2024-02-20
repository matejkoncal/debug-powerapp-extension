import { Route, Routes } from 'react-router-dom';

import styles from './action.module.scss';

/* eslint-disable-next-line */

export function Action() {
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
                      const url = tabs[0].url || '';
                      chrome.cookies.get({ url, name: 'CrmOwinAuth' }, (c) => {
                        alert(c?.value);
                        chrome.storage.local.set({ cookieValue: c?.value });
                      });
                    }
                  );
                }}
              >
                Get Cookie
              </button>
              <button
                onClick={async () => {
                  const fromStorage = await chrome.storage.local.get(
                    'cookieValue'
                  );
                  alert(fromStorage['cookieValue']);
                  try {
                    await chrome.declarativeNetRequest.updateDynamicRules({
                      removeRuleIds: [5],
                      addRules: [
                        {
                          id: 5,
                          priority: 1,
                          action: {
                            type: chrome.declarativeNetRequest.RuleActionType
                              .MODIFY_HEADERS,
                            requestHeaders: [
                              {
                                header: 'cookie',
                                value:
                                  'CrmOwinAuth=' + fromStorage['cookieValue'],
                                operation:
                                  chrome.declarativeNetRequest.HeaderOperation
                                    .SET,
                              },
                            ],
                          },
                          condition: {
                            initiatorDomains: ['localhost'],
                          },
                        },
                      ],
                    });
                  } catch (e) {
                    alert(e);
                  }
                }}
              >
                Proxy on
              </button>
              <button
                onClick={async () => {
                  try {
                    await chrome.declarativeNetRequest.updateDynamicRules({
                      removeRuleIds: [5],
                    });
                  } catch (e) {
                    alert(e);
                  }
                }}
              >
                Proxy off
              </button>
              <button
                onClick={async () => {
                  const fromStorage = await chrome.storage.local.get(
                    'cookieValue'
                  );
                  const cookies = 'CrmOwinAuth=' + fromStorage['cookieValue'];
                  fetch('http://localhost:3000', {
                    method: 'POST',
                    body: JSON.stringify(cookies),
                  });
                }}
              >
                send cookies
              </button>
              <button
                onClick={async () => {
                  const config = {
                    mode: 'pac_script',
                    pacScript: {
                      data:
                        'function FindProxyForURL(url, host) {\n' +
                        "  if (host == 'foobar.com')\n" +
                        "    return 'PROXY localhost:8080';\n" +
                        "  return 'DIRECT';\n" +
                        '}',
                    },
                  };
                  chrome.proxy.settings.set({
                    value: config,
                    scope: 'regular',
                  });
                }}
              >
                Redirect on1
              </button>
              <button
                onClick={() => {
                  chrome.proxy.settings.clear({ scope: 'regular' });
                }}
              >
                Redirect off
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
