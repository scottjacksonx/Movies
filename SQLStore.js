var systemDB;

function initDB()
{
	try {
	    if (!window.openDatabase) {
	        alert('not supported');
	    } else {
	        var shortName = 'moviesToSee';
	        var version = '1.0';
	        var displayName = 'Movies To See';
	        var maxSize = 65536; // in bytes
	        var db = openDatabase(shortName, version, displayName, maxSize);
			systemDB = db;
			//alert("Database is: " + systemDB);
			createTables(systemDB);
			
			systemDB.transaction(
				function (transaction) {
					transaction.executeSql('SELECT * FROM moviestable;', [], showList, killTransaction);
				}
			);
	    }
	} catch(e) {
	    // Error handling code goes here.
	    if (e == INVALID_STATE_ERR) {
	        // Version number mismatch.
			alert("Invalid database version.");
	    } else {
			alert("Unknown error "+e+".");
	    }
	    return;
	}
}

function showList(transaction, results) {
	var movieHTML = "";
	if (results.rows.length == 0) {
		document.getElementById('movieList').style.border = "none";
	}
	for (var i = 0; i < results.rows.length; i++) {
		movie = results.rows.item(i);
		movieHTML += "<li class='listItem' id='" + movie['name'] + " '><table><tr><td class='listCell'>" + movie['name'] + "</td><td><input type='checkbox' class='checkbox' onClick='removeMovie(systemDB, \"" + movie['name'] + "\");'/></td></tr></table></li>";
	}
	document.getElementById('movieList').innerHTML = movieHTML;
}


function createTables(db)
{
 
db.transaction(
    function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS moviestable(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);');
    }
);
 
}

function updateList(transaction, results)
{
}

function killTransaction(transaction, error)
{
	alert('Oops. ' + error.message);
}


function addMovie(db)
{
	var movie = document.getElementById('newMovie').value;
	if (movie != "") {
		db.transaction(
			function (transaction) {
				transaction.executeSql('INSERT INTO moviestable (name) VALUES ("' + movie + '");', [], updateList, killTransaction);
				document.getElementById('newMovie').value = '';
			}
		);
		
		db.transaction(
			function (transaction) {
				transaction.executeSql('SELECT * FROM moviestable;', [], showList, killTransaction);
				document.getElementById('movieList').style.border = "solid 1px white";
			}
		);
	}
}

function removeMovie(db, movie) {
	db.transaction(
		function (transaction){
			transaction.executeSql('DELETE FROM moviestable WHERE name=?;', [movie]);
			$('#' + movie).slideFadeToggle('slow');
		}
	);
	
	db.transaction(
		function (transaction) {
			transaction.executeSql('SELECT * FROM moviestable;', [], showList, killTransaction);
		}
	);
}


