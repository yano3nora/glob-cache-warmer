var fdir = require('fdir').fdir;
var host = new URL(process.argv[2]).host;
var files = new fdir()
    .withDirs()
    .withBasePath()
    .glob(process.argv[3].split(','))
    .sync();
files.forEach(function (file) {
    console.log(file);
});
