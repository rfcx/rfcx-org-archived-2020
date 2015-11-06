var extend = require('util')._extend;
var mailchimp_helpers = require('../helpers/mailchimp.js');

exports.getMailChimpListDetails = function(req,res) {
  mailchimp_helpers.mailchimp.getListDetails(
      process.env.MAILCHIMP_DONOR_LIST_ID
    ).then(function(rtrnData){
      res.json({data: rtrnData});
  }).catch(function(err){
    console.log("failed to fetch list details | "+err);
  });
};

exports.searchMailChimpList = function(req,res) {
  mailchimp_helpers.mailchimp.searchListMembers(
      process.env.MAILCHIMP_DONOR_LIST_ID,
      req.query.id
    ).then(function(rtrnData){
      res.json({data: rtrnData});
  }).catch(function(err){
    console.log("failed to search list | "+err);
  });
};


exports.putMailChimpEntry = function(req,res) {
  
  var merge_vars = {
    COUNT: 1,
    REGISTERED: (new Date()).toISOString()
  };

  if (req.body.EMAIL      !== null) { merge_vars.EMAIL_REAL = req.body.EMAIL; }
  if (req.body.EMAIL_REAL !== null) { merge_vars.EMAIL_REAL = req.body.EMAIL_REAL; }
  if (req.body.ADDRESS    !== null) { merge_vars.ADDRESS    = req.body.ADDRESS; }
  if (req.body.NAME_DONOR !== null) { merge_vars.NAME_DONOR = req.body.NAME_DONOR; }
  if (req.body.COUNT      !== null) { merge_vars.COUNT      = parseInt(req.body.COUNT); }
  if (req.body.NOTE_DONOR !== null) { merge_vars.NOTE_DONOR = req.body.NOTE_DONOR; }
  if (req.body.NAME_ADMIN !== null) { merge_vars.NAME_ADMIN = req.body.NAME_ADMIN; }
  if (req.body.VALUE_USD  !== null) { merge_vars.VALUE_USD  = req.body.VALUE_USD; }
  if (req.body.RECEIVED   !== null) { merge_vars.RECEIVED   = req.body.RECEIVED; }
  if (req.body.NOTE_ADMIN !== null) { merge_vars.NOTE_ADMIN = req.body.NOTE_ADMIN; }
  if (req.body.PHOTO      !== null) { merge_vars.PHOTO      = req.body.PHOTO; }

  var generatedEmail = Math.random().toString().substr(2) + "@rfcx.org";

  mailchimp_helpers.mailchimp.addToList(
        process.env.MAILCHIMP_DONOR_LIST_ID,
        generatedEmail,
        merge_vars)
    .then(function(rtrnData){
      var response = {
        status: "success"
      };
      res.json(extend(response, rtrnData));
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: "Failed to save entry"
      });
    });
};

exports.updateMailChimpEntry = function(req,res) {

  var email = req.body.email || '';

  mailchimp_helpers.mailchimp.updateMember(
      process.env.MAILCHIMP_DONOR_LIST_ID,
      email,
      req.body)
    .then(function(rtrnData){
      var response = {
        status: "success"
      };
      res.json(extend(response, rtrnData));
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: "Failed to save entry"
      });
    });

};

exports.validateUser = function(req, res) {
  // if we went into this method, than it means that we passed checkPassword middleware successfully.
  // that's why return success response
  res.status(200).json({status: 'success'});
};