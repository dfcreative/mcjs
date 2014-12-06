#!/usr/bin/env node
var fs = require('fs');
var uc = require('../');
var path = require('path');

var version = '0.1.x';

process.stdout.on('error', process.exit);


//get options
//TODO: extend options
var opts = require('nomnom')
.option('require', {
	list: true,
	abbr: 'r',
	metavar: 'MODULE[:ALIAS]',
	help: 'Provide `require()` for supplied modules. Optionally set an alias via colon.',
	flag: false
})
.option('standalone', {
	abbr: 's',
	metavar: 'NAME',
	help: 'Generate an UMD bundle for the supplied export name.'
})
.option('wrap', {
	abbr: 'w',
	metavar: 'VAL',
	help: 'Wrap an input with passed value, in place of %output%.'
})
.option('ignore', {
	abbr: 'i',
	metavar: 'MODULE',
	help: 'Don’t include supplied modules/files to bundle.',
	flag: false,
	list: true
})
.option('comments', {
	abbr: 'c',
	help: 'Keep modules comments in export.',
	flag: true,
	default: false
})
// .option('wrapper', {
// 	abbr: 'w',
// 	metavar: 'VAL',
// 	help: 'Wrap the result '
// })
// .option('debug', {
// 	abbr: 'd',
// 	flag: true,
// 	help: 'Provide source maps in output.'
// })
.option('basedir', {
	abbr: 'b',
	flag: false,
	metavar: 'PATH',
	help: 'Setup base dir to resolve modules.'
})
.option('version', {
	abbr: 'v',
	help: 'Show version of uncommon.',
	flag: true,
	callback: function(){
		var pkg = require('../package.json');
		console.log(pkg.name + ' ' + pkg.version);
		return process.exit(1);
	}
})
.parse();


//get base dir to resolve modules
var basedir =  process.cwd() + '/' + opts.basedir;


var bundle;

//get stdin if no files passed
if (!opts._.length) {
	bundle = uc(process.stdin, {
		basedir: basedir
	});
}

else {
	//resolve files
	var files = opts._.map(function(filePath){
		return path.resolve(filePath);
	});

	bundle = uc(files, opts);
}

//stdout on success
bundle.on('success', function(result){
	process.stdout.write(result);
});

bundle.on('error', errorExit);


function errorExit(err) {
	if (err.stack) {
		console.error(err.stack);
	}
	else {
		console.error(String(err));
	}
	process.exit(1);
}