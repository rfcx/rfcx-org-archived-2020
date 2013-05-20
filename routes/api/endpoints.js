exports.endpoints = {
  get: [
    { path: "/api/1/source/:id", callback: "getSource", contentType: "application/json" },
    { path: "/api/1/env", callback: "getEnv", contentType: "application/json" }
  ],
  post: [
    { path: "/api/1/checkin", callback: "postCheckIn", contentType: "text/plain" }
  ]
};