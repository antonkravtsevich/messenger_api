"use strict";
var stackTrace = require('stack-trace');
var util = require('util');
var path = require('path');
var projectname = require('../package.json').name;

module.exports = class Logger{
  constructor(){
    function generateLogFinction(level) {
      return function(message, meta){
        var mes = this.module+" -- ";
        mes+=level+" -- ";
        mes+=message;
        if(meta) mes+= " "+util.inspect(meta)+" ";
        mes+='\n';
        this.write(mes);
      }
    };

    this.trace = stackTrace.get() [1];
    this.filename = this.trace.getFileName();
    this.module = projectname + path.sep + path.relative('.', this.filename);
    this.streams = [process.stdout];
    this.log = generateLogFinction('Log');
    this.info = generateLogFinction('Info');
    this.error = generateLogFinction('Error');
    this.warn = generateLogFinction('Warning');
  }
  write(d){
    this.streams.forEach((stream)=>{
      stream.write(d);
    });
  }
}
