"use strict";
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})(); /* eslint-disable no-console */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var socketInstance = null;

var reLinkCount = 0;
// var headers={
//     taskId:'301870',
//     userId:'admin'
// };
var strJson = JSON.stringify({
  message: "Marco!"
});
/**
 * 创建 WebSocket Promise
 * @param {object} scope
 * @return {Promise}
 */
var createPromise = function createPromise(scope) {
  var socket = Stomp.over(new SockJS(scope.url), {
    heartbeat: {
      incoming: scope.heartBeatOutTime,
      outgoing: scope.heartBeatInTime
    },
    debug: true
  });
  socket.heartbeat.outgoing = 15000; // client will send heartbeats every 20000ms
  socket.heartbeat.incoming = 15000; // client does not want to receive heartbeats
  socket.onheartbeat = function() {
    console.log("heartbeat");
  };
  return new Promise(function(resolve, reject) {
    socket.connect(
      scope.header,
      function(frame) {
        var tx = socket.begin();
        socket.send(
          "/app/marco",
          {
            transaction: tx.id
          },
          strJson
        );
        tx.commit();
        scope.openHandler();
        return resolve(socket);
      },
      function(err) {
        scope.closeHandler(err);
        if (reLinkCount < 1000) {
          setTimeout(function() {
            scope.socketPromise = createPromise(scope);
            scope.events.forEach(function(e) {
              scope.applyEvent(e.url, e.callback);
            });
          }, 4000);
        }
        reLinkCount++;
        return reject("Connection Error!");
      }
    );
  });
};

var Socket = (function() {
  function Socket(url, heartBeatOutTime, heartBeatInTime, taskId) {
    _classCallCheck(this, Socket);

    var self = this;
    self.events = [];
    self.url = url;
    self.heartBeatOutTime = heartBeatOutTime;
    self.heartBeatInTime = heartBeatInTime;
    self.header = {
      taskId: taskId,
      userId: "admin"
    };
    self.socketPromise = createPromise(self);
  }

  _createClass(Socket, [
    {
      key: "closeHandler",
      value: function closeHandler(err) {
        console.error("default close handler", err);
      },
   
    },
      {
          key: "openHandler",
          value: function openHandler(msg) {
           
          },

      },
    {
      key: "on",
      value: function on(destinationUrl, messageCallback) {
        var self = this;
        self.events.push({
          url: destinationUrl,
          callback: messageCallback
        });
        self.applyEvent(destinationUrl, messageCallback);
      }
    },
    {
      key: "applyEvent",
      value: function applyEvent(destinationUrl, messageCallback) {
        if (
          Object.prototype.toString.call(messageCallback) ===
          "[object Function]"
        ) {
          return this.socketPromise
            .then(function(socket) {
              socket.subscribe(destinationUrl, function(msg) {
                var msgObj = {};
                try {
                  msgObj = JSON.parse(msg.body);
                } catch (err) {
                  console.error(err);
                } finally {
                  messageCallback(msgObj);
                }
              });
            })
            .catch(function(err) {
              console.error(err);
            });
        } else {
          console.log("Please provide a callBack function");
        }
      }

      /**
       * 发送 WebSocket 消息
       * @param {string} targetUrl
       * @param {Object} msg
       */
    },
    {
      key: "emit",
      value: function emit(targetUrl, msg) {
        return this.socketPromise
          .then(function(socket) {
            //socket.send(targetUrl, JSON.stringify(msg), {});
            socket.send(targetUrl, {atytopic:"greetings"}, JSON.stringify({ 'message': msg }));
          })
          .catch(function(err) {
            console.error(err);
          });
      }

      /**
       * 主动断开 WebSocket 连接
       * @return {Promise}
       */
    },
    {
      key: "disconnect",
      value: function disconnect() {
        return this.socketPromise
          .then(function(socket) {
            socket.disconnect();
          })
          .catch(function(err) {
            console.error(err);
          });
      }

      /**
       * 监听 WebSocket 断开
       * @param {function} closeHandler
       */
    },
    {
      key: "onClose",
      value: function onClose(closeHandler) {
        this.closeHandler = closeHandler;
      }
    },
    {
        key: "onOpen",
        value: function onOpen(openHandler) {
            this.openHandler = openHandler;
        }
    }
  ]);
  return Socket;
})();
