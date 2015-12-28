define(['ga'], function (ga) {
  if (ga===undefined) {
    return function() {};
  } else {
    ga.l = new Date();
    ga('create', 'UA-68678128-1', 'auto');
    return ga;
  }
});