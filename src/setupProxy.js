const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://simple-websocket-chat-app.partysoon.repl.co/",
      changeOrigin: true
    })
  );

  app.use(
    "/socket",
    createProxyMiddleware({
      target: "https://simple-websocket-chat-app.partysoon.repl.co/",
      ws: true
    })
  );
};
