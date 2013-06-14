exports.endpoints = {
  get: [
    { path: "/api/1/source/:id", callback: "getSource", contentType: "application/json" }
  ],
  post: [
    { path: "/api/1/checkin", callback: "postCheckIn", contentType: "application/json" },
    { path: "/api/1/source/version", callback: "postSourceVersion", "contentType": "application/json" }
  ]
};