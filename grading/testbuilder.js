var data = require('./../data.js')
var utils = require('utils')
var http = require('http')
var fs = require('fs')
var tempData = data.map(function(e){return e});
var casper = require('casper').create({

  pageSettings: {

    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
  }
});

casper
.start()
.then(function(){
  this.each(tempData, function(self, item){
      self.thenOpen('http://localhost:9000/'+item.Class+'/'+item.GithubName+'/testbuilder/index.html', function(){
        this.wait(5000, function() {
          var passedTests = this.evaluate(function(){
            return document.querySelector("#mocha-stats > li.passes > em").textContent
          })
          item.Testbuilder = passedTests;
          this.echo('TestBuilder: ' + item.FullName +", Passed = "+passedTests)
        });
      })
  })
})
.then(function(){
  var content = "module.exports = " + JSON.stringify(tempData)
  fs.writeFile('./../data.js',content,'w');
})

casper.run();
