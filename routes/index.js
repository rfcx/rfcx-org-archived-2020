
/*
 * GET home page.
 */

exports.index = function(req, res, process, Model){
  var node_env = process.env.NODE_ENV;
  res.render("index", {
    title: "Rainforest Connection"+ ((node_env==="production") ? "" : (" ("+node_env+")")),
    segment_io_client_id: process.env.SEGMENT_IO_CLIENT_ID,
    bootstrap_location: (node_env==="production") ? "//netdna.bootstrapcdn.com" : "/vendor"

  });
};
