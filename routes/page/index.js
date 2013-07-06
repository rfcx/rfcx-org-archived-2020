
/*
 * GET home page.
 */

exports.index = function(req, res, process){

  res.render("index", {
    title: "Rainforest Connection"+process.env.NODE_ENV
  });
};