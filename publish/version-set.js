var exec = require('child_process').exec;
var fs = require("fs");

var file = __dirname+"/../config/version.js";
require('crypto').randomBytes(6, function(ex, buf) {
  var newId = buf.toString('hex');
  var oldId = require(file).productionVersionId;
  var str = "exports.productionVersionId = \""+newId+"\";";
  fs.unlink(file,function(e){
    fs.writeFile(file, str, function(e){
      console.log("Updating ID from "+oldId+" to "+newId+": "+((e) ? "Error" : "Success"));
      if (!e) {
        exec( "git add "+file+"; "
              +"git commit -m \"Incrementing Production Version.\"; "
              +"git checkout aws_push; "
              +"git merge master -m \"Merging with master branch.\"; "
 //             +"git aws.push; "
 //             +"git checkout master; "
              ,function(err,stdout,stderr){
          console.log(stdout);
        });
      }
    });
  });
});