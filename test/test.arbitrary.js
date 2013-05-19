var assert = require('assert')
  , app = require('./../app');

describe("Array", function(){
  describe("#indexOf()", function(){
    it("should return -1 when value ain't present",function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});