exports.endpoints = {
  get: [
    { path: "/api/1/source/:source_id", callback: "getSource" },
    { path: "/api/1/event/:event_id", callback: "getEvent" }
  ],
  post: [
    { path: "/api/1/checkin", callback: "postCheckIn" },
    { path: "/api/1/source/version", callback: "postSourceVersion" },
    { path: "/api/1/source/alert", callback: "postSourceAlert" }
  ]
};