var Promise = require("bluebird");
var mailchimp = require("../node_modules/mailchimp-api/mailchimp");
var mc = new mailchimp.Mailchimp(process.env.MAILCHIMP_APP_KEY);
var stripHtml = require("../helpers/striphtml.js");

var mandrill_helpers = require("../helpers/mandrill");

exports.mailchimp = {

  getLists: function() {

    return new Promise(function(resolve,reject){
      try {
        mc.lists.list({}, function(data){
          resolve(data);
        });
      } catch(err) {
        reject(err);
      }
    });

  },

  getListDetails: function(listId) {

    return new Promise(function(resolve,reject){
      mc.lists.list({filters:{list_id: listId}}, function(listData) {
        var list = listData.data[0];
        mc.lists.members({id: listId}, function(memberData) {
          resolve(memberData.data);
        }, function (error) {
          reject(error);
        });
      });
    });

  },

  addToList: function(listId, email_addr, merge_vars) {

    merge_vars = stripHtml.stringObject(merge_vars);

    return new Promise(function(resolve,reject){
      mc.lists.subscribe({
          id: listId,
          email: { email: email_addr },
          merge_vars: merge_vars,
          double_optin: false
        }, function(data) {
        // If Donor has specified his email address, then send instructions to that email
        if (merge_vars.FRONTEND && merge_vars.EMAIL_REAL) {
          var html =
            "<div>Your personal token is <b>" + email_addr.substring(0,6) + "</b></div>" +
            "<div>Please include it in the box with your phone</div>";
          mandrill_helpers.sendEmail({
            email:     merge_vars.EMAIL_REAL,
            subject:   "Donation Instructions",
            name:      merge_vars.NAME_DONOR,
            html:      html,
            important: false
          });
        }
        resolve(data);
      }, function(error) {
        reject(error);
      });
    });

  },

  searchListMembers: function(listId, queryString) {

    return new Promise(function(resolve,reject){
      mc.helper.searchMembers({
          id: listId,
          query: queryString
        }, function(listData) {
          resolve(listData.full_search.members);
      }, function (error) {
         reject(error);
       });
    });

  },

  updateMember: function(listId, email_addr, merge_vars) {

    merge_vars = stripHtml.stringObject(merge_vars);

    return new Promise(function(resolve,reject){
      mc.lists.updateMember({
        id: listId,
        email: {
          email: email_addr
        },
        merge_vars: merge_vars
      }, function(data) {
        resolve(data);
      }, function (error) {
        reject(error);
      });
    });
  }


};







