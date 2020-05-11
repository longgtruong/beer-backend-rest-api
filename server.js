const fs = require('fs');


// We're using the Better-SQLite3 NPM module as a database.
// Documentation: https://github.com/JoshuaWise/better-sqlite3/wiki/API
const Database = require('sqlite3').Database;

const express = require('express');
const bodyParser = require('body-parser');

// Create an express app
const app = express();

// Open the database
createDb();

function createDb(ready) {
	app.db = new Database('data/sqlite3.db');

	// Make sure tables and initial data exist in the database
	let stmts = fs.readFileSync('schema.sql').toString().split(/;\s*\n/);
	function next(err) {
		if (err) console.warn(err);
		let stmt = stmts.shift();
		if (stmt) app.db.run(stmt, next);
		else if (ready) ready();
	}
	next();
}

// Configure express to automatically decode WWW FORM bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


// Dangerous API method used by the testing script to reset
// the database to a known state.
app.put('/resetDatabase', function(req,rsp) {
	app.db.close(function() {
		fs.unlinkSync('data/sqlite3.db');
		createDb(function() {
			rsp.json({});
		});
	});
});

// Serve static data from the public directory
app.use(express.static('public'));

// Put a reference to our db in the request, so that rules can easily access it.
app.use(function(req,rsp,next){
	req.db = app.db;
	next();
});

app.use(require('./routers'));

// Start accepting requests
const listener = app.listen(process.env.PORT || 3000, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});
