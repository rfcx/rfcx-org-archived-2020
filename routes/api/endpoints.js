exports.endpoints = {
  get: [
    { path: "/api/1/source/:source_id", callback: "getSource" }
  ],
  post: [
    { path: "/api/1/checkin", callback: "postCheckIn" },
    { path: "/api/1/source/version", callback: "postSourceVersion" },
    { path: "/api/1/source/register", callback: "postSourceVersion" }
  ]
};