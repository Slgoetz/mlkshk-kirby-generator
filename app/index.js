'use strict';

// Dependencies
var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	exec = require('child_process').exec,
	child;

// CryptoJS gives MD5 & SHA1 encryption
var CryptoJS = require('crypto-js');

// These variables need to be global
var appFolder = 'mlkshk-kirby',
	kirbyPanel, siteDirectory, kirbyBlog, kirbyContactForm;
var slugedName = '';

var mlkshkKirbyGenerator = yeoman.generators.Base.extend({
	init:function(){
	this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

	  this.on('end', function(){
		if(!this.options['skip-install']){
		  // this.npmInstall();
		}
	  });
	},

	checkForGit:function(){
		// Make sure this runs synchronously
		var done = this.async();

		// execute git command
		child = exec('git --version',
			function (error){
				if (error) {
					console.log('Git does not seem to be installed or is not properly set up in the PATH, please configure this then come back.');
					return;// you need git bitch
				}
				done();
			}.bind(this));
	},

	promptForFolder: function(){
		// Make sure this runs synchronously
		var done = this.async();

		// Yeoman greets the user
		console.log(this.yeoman);

		//Generator description - keep it simple
		console.log(chalk.yellow('Fuck Bitches Make Milkshakes'));

		var prompt = {
			name: 'appFolder',
			message: 'Where would you like this kirby based project to be created?',
			default: appFolder
		};

		//Prompt the user for the folder to set up kirby
		this.prompt(prompt, function (props){
			siteDirectory = props.appFolder + '/app';
			appFolder = props.appFolder;
			done();
		}.bind(this));
	},



	//get latest repository of Kirby, in this case we are using 2.0
	cloneKirby: function(){
		// Make sure this runs synchronously
		var done = this.async();

		console.log('Hold on while Kirby 2.0 is downloaded');
		//clone repo
		// https://github.com/getkirby/toolkit.git
		// https://github.com/getkirby/kirby.git
		child = exec('git clone --recursive https://github.com/getkirby/starterkit.git ' + siteDirectory,
			function (error){
				if (error !== null) {
					console.log("CloneKirby Error:", error);
				}
				done();
			}.bind(this)
		);
	},

	removeExtraneousFiles: function(){
		// Make sure this runs synchronously
		var done = this.async();

		child = exec('rm ./' + siteDirectory + '/content/site.txt', 
			function (error){
				if(error !==null ){
					console.log(error);
				}
				done();
			}.bind(this));
	},

	setupQuestions: function(){
		 // Make sure this runs synchronously
		 var done = this.async();

		 var prompts = [{
		 	name: 'licenseKey',
		 	message: 'License Key:'
		 }, {
		 	name: 'siteTitle',
		 	message:'Site Name:',
		 	default: 'Milkshake Studio Starter Kit'
		 }, {
		 	name: 'siteAuthor',
		 	message:'Site Author:',
		 	default: 'Milkshake Studio'
		 }, {
		 	name: 'siteDescription',
		 	message:'Site Description:',
		 	default: 'An Awesome Site'
		 }, {
		 	name: 'siteKeywords',
		 	message:'Site Keywords:',
		 	default: 'Milkshake Studio, Kirby CMS, Yeoman, Gulp, Brooklyn'
		 }];

		this.prompt(prompts, function (props) {
			this.slugedName = this._.slugify(props.siteTitle);
			this.licenseKey = props.licenseKey;
			this.siteTitle = props.siteTitle;
			this.siteAuthor = props.siteAuthor;
			this.siteDescription = props.siteDescription;
			this.siteKeywords = props.siteKeywords;
			// this.includeSass = props.includeSass;
			// this.includeModernizr = props.includeModernizr;

			done();
		}.bind(this));

		
	},

	// gulpfile: function () {
	//   this.template('gulpfile.js');
	// };

	// bower: function () {
	//   var bower = {
	//     name: this._.slugify(this.appname),
	//     private: true,
	//     dependencies: {}
	//   };

	//   if (this.includeSass) {
	//      this.includeSass ? '-sass-official' : ''
	//   }

	//   if (this.includeModernizr) {
	//   	bower.dependencies.jquery = '~2.1.1';
	//     bower.dependencies.modernizr = '~2.8.1';
	//   }

	//   this.write('bower.json', JSON.stringify(bower, null, 2));
	// },

	gulpfile:function () {
	  this.template('gulpfile.js', appFolder + '/gulpfile.js');
	},

	bower:function () {
	  this.template('bower.json', appFolder + '/bower.json');
	},

	app:function(){
		//copy all files with new information into thier proper location
		this.template('_package.json', appFolder + '/package.json');
		this.template('kirby-files/site.txt', siteDirectory + '/content/site.txt');
		this.copy('kirby-files/header.php', siteDirectory + '/site/snippets/header.php');
		this.copy('kirby-files/footer.php', siteDirectory + '/site/snippets/footer.php');
	},
	finish: function () {
		// Give the user info on how to start developing
		var howToInstall =
		'Nice! Now run ' + chalk.magenta('cd ' + siteDirectory + '/') + '.' +
		'\nMake sure you run' + chalk.magenta('npm install') + 'and chalk.' +magenta('bower install') + 
		'\nThen you can either start up the server with MAMP, XAMPP, or the like, or' +
		'\nYou can run ' + chalk.magenta('gulp dev') + '.' +
		'\nEither way, you have completed this scaffolding and are ready to build.';
		console.log(howToInstall);
	}
});


module.exports = mlkshkKirbyGenerator;















