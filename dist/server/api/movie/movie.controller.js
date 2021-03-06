/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Movie = require('./movie.model');

var lastTime = true;

exports.withImages = function(request, response) {
  var totalWithImages = 0;
  var totalWithoutImages = 0;
  Movie.find({withImages:true}, function(err, movies){
    if (err){
      return response.send(400, "An error occurred while trying to initialize the system. We are sorry.");
    }
    else {
      totalWithImages = movies.length;
      Movie.find({withImages:false}, function(err, movies){
        if (err){
          return response.send(400, "An error occurred while trying to initialize the system. We are sorry.");
        }
        else {
          totalWithoutImages = movies.length;
          var abs = Math.abs(totalWithImages - totalWithoutImages);
          if (abs > 10) {
            if (totalWithImages > totalWithoutImages)
              return response.send(false);
            else
              return response.send(true);
          }
          else {
            lastTime = !lastTime;
            return response.send(!lastTime);
          }
        }
      });
    }
  })
};

exports.saveUserExperiment = function(request, response) {
  Movie.create(request.body, function(err){
    if (err){
      return response.send(400, "An error occurred while trying to save data the system. We are sorry.");
    }
    else {
      return response.json(200, request.body);
    }
  });
};

exports.getStats = function(request, response){
  Movie.find(function(err, res){
    if (err){
      return response.send(400, "An error occurred while trying to bring data from system. We are sorry.");
    }
    else {
      var result = {total: 0, withImages: {total:0, amount: 0, chosen: 0}, withoutImages: {total: 0, amount: 0, chosen: 0}};
      res.map(function(record){
        result.total++;
        if (record.withImages)
          result.withImages.total++;
        else
          result.withoutImages.total++;

        record.res.map(function(user){
          if (user.choice){
            if (record.withImages){
              result.withImages.amount++;
              result.withImages.chosen++;
            }
            else {
              result.withoutImages.amount++;
              result.withoutImages.chosen++;
            }
          }
          else {
            if (record.withImages)
              result.withImages.amount++;
            else
              result.withoutImages.amount++;
          }

        });
      });
      return response.json(200, result);
    }
  });
};
