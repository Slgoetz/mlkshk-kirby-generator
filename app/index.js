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
var whichFolder = 'mlkshk-Kirby',
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
			name: 'whichFolder',
			message: 'Where would you like this kirby based project to be created? You can change it later, I think.',
			default: whichFolder
		};

		//Prompt the user for the folder to set up kirby
		this.prompt(prompt, function (props){
			siteDirectory = props.whichFolder + '/app';
			whichFolder = props.whichFolder;
			done();
		}.bind(this));
	},



	//get latest repository of Kirby, in this case we are using 2.0
	cloneKirby: function(){
		// Make sure this runs synchronously
		var done = this.async();

		//clone repo
		child = exec('git clone --recursive https://github.com/getkirby/starterkit.git ' + siteDirectory,
			function (error){
				if (error !== null) {
					console.log("CloneKirby Error:", error);
				}
				done();
			}.bind(this));
	},

	removeExtraneousFiles: function(){
		// Make sure this runs synchronously
		var done = this.async();

		child = exec('rm ./' + siteDirectory + '/site/config/config.php ./' + siteDirectory + '/content/site.txt ./' + siteDirectory + '/.htaccess', 
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
		 	default: 'Kirby Powered Site'
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
		 	default: 'Milkshake Studio'
		 }, {
		 	name: 'panelUsername',
		 	message:'User Name:',
		 	default: 'admin'
		 }, {
		 	name: 'panelPassword',
		 	message:'Password:',
		 	default: 'password'
		 }, {
			type: 'list',
			name: 'encryption',
			message: 'How would you like your password to be encrypted?',
			choices: [{
				name: 'md5'
			}, {
				name: 'sha1'
			}],
			default: 'md5'
		}];

		this.prompt(prompts, function (props) {
			this.slugedName = this._.slugify(props.siteTitle);
			this.licenseKey = props.licenseKey;
			this.siteTitle = props.siteTitle;
			this.siteAuthor = props.siteAuthor;
			this.siteDescription = props.siteDescription;
			this.siteKeywords = props.siteKeywords;
			this.panelUsername = props.panelUsername;
			this.panelPassword = props.panelPassword;
			this.encryption = props.encryption;
			// this.includeSass = props.includeSass;
			// this.includeModernizr = props.includeModernizr;

			if (props.encryption === 'sha1') {
				this.panelPassword = CryptoJS.SHA1(props.panelPassword);
			} else if (props.encryption === 'md5') {
				this.panelPassword = CryptoJS.MD5(props.panelPassword);
			}

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
	  this.template('gulpfile.js', whichFolder + '/gulpfile.js');
	},

	bower:function () {
	  this.template('bower.json', whichFolder + '/bower.json');
	},

	app:function(){
		//copy all files with new information into thier proper location
		this.template('_package.json', whichFolder + '/package.json');
		this.template('kirby-files/config.php', siteDirectory + '/site/config/config.php');
		this.template('kirby-files/site.txt', siteDirectory + '/context/site.txt');
		this.copy('kirby-files/htaccess', siteDirectory + '/.htaccess');
		this.copy('kirby-files/header.php', siteDirectory + '/site/snippets/header.php');
		this.copy('kirby-files/footer.php', siteDirectory + '/site/snippets/footer.php');
		this.copy('jshintrc', siteDirectory + '.jshintrc');
		// this.copy('editorconfig', whichFolder + '/.editorconfig');

		this.template('kirby-files/admin.php', siteDirectory + '/site/panel/accounts/' + this.panelUsername + '.php');
	},
	finish: function () {
		// Give the user info on how to start developing
		var howToInstall =
		'Nice! Now run ' + chalk.magenta('cd ' + siteDirectory + '/') + '.' +
		'\nYou can either start up the server with MAMP, XAMPP, or the like, or' +
		'\nYou can run ' + chalk.magenta('php -S localhost:8080') + '.' +
		'\nEither way, you have completed this scaffolding, young grasshopper.';
		console.log(howToInstall);
	}
});


module.exports = mlkshkKirbyGenerator;















