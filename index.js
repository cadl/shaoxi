#!/usr/bin/env node

var exec = require('child_process').exec,
    path = require('path');

var chokidar = require('chokidar');


var watcher = chokidar.watch(path.resolve(process.cwd()), {ignored: /(#.+#)/, persistent: true, ignoreInitial: true});


watcher.on('all', function(method, path) {
  console.log(method, path);
  console.log('Doing', process.argv.slice(2).join(' '));

  try {
    exec(process.argv.slice(2).join(' '))
      .on('exit', function(code) {
        if (code == 0) {
          console.log('Exec success');
          return;
        }
        console.log('Exec failed', code);
      })
      .stdout.on('data', function(data) {
        var l = data.split('\n');
        l.forEach(function(s) {
          if (s) {
            console.log('>>>', s);
          }
        });
      });
  } catch(e) {
    console.error('Exec error', e);
  }
});


process.on('SIGINT', function() {
  watcher.close();
  process.exit(0);
});
