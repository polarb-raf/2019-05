const NO_MSG = '전달할 메세지가 없습니다.';
const CLIENT_FOCUS_BROWSER_MSG =
  '아직 퀵킥에 남아 계셨군요! 지금 당장 매치를 확인해 보러가요!';
const CLIENT_NOT_FOCUS_BROWSER_MSG =
  '지금 매치가 올라왔습니다! 해당 메세지를 누르면 페이지로 이동해요!';

const selectedMsg = (focused) => {
  if (focused) {
    return CLIENT_FOCUS_BROWSER_MSG;
  }
  return CLIENT_NOT_FOCUS_BROWSER_MSG;
};

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.text() : NO_MSG;
  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      // console.log(clientList);
      const focused = clientList.some((client) => {
        return client.focused;
      });
      const notificationMsg = selectedMsg(focused);
      return self.registration.showNotification(
        '안녕하세요 Quick-Kick 입니다!',
        {
          body: notificationMsg,
          icon: 'quick_48.png',
          badge: 'quick_48.png',
        }
      );
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});