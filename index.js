#!/usr/bin/env node

var exec = require('child_process').exec,
    path = require('path');

var chokidar = require('chokidar');


var watcher = chokidar.watch(path.resolve(process.cwd()), {ignored: /(#.+#)|(.git.*)/, persistent: true, ignoreInitial: true});


watcher.on('all', function(method, path) {
  console.log(method, path);
  console.log('Doing', process.argv.slice(2).join(' '));

  exec(process.argv.slice(2).join(' '))
    .on('exit', function(code) {
      if (code == 0) {
        console.log('Exec success');
        return;
      }
      console.log('Exec failed', code);
      process.exit(code);
    })
    .stdout.on('data', function(data) {
      var l = data.split('\n');
      l.forEach(function(s) {
        if (s) {
          console.log('>>>', s);
        }
      });
    });
});


process.on('SIGINT', function() {
  watcher.close();
  process.exit(0);
});
