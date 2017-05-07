var express = require('express');

module.exports = function(status, err){
  console.log(err);
  console.log(err.stack);

  res.status(status);
  res.send({status: 'error', message: err});
}
