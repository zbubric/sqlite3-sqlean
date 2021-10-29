# SQLean (sqlite3) extensions as NPM package
Simple utility package that fetch SQLean extension libs and expose their paths as constants that can be used with loadExtension method of Sqlite3 module.

Extensions are fetched as precompiled binaries suitable for installation OS (*.dll for Windows, *.so for Linux, *.dylib for macOS). Please note that binaries are 64-bit and require a 64-bit SQLite version.

## Installation
To install, use 
```
npm install sqlite3-sqlean
```
Binary files are downloaded and stored during module post-install phase. Binaries are stored in module folder's within node_modules.


## Usage
Once installed, paths to individual extension libs are available as sqlite3-sqlean module exports as shown: 

```
const sqlite3 = require('sqlite3');
// import all
const sqleanLibs = require('sqlite3-sqlean');
// import specific library
const {mathLibPath} = require('sqlite3-sqlean');


(async () =>{

    // create database
    dbInstance = new sqlite3.Database('./dbFile.sqlite')

    // create table
    await dbInstance.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)');

    // add stats extension by using it's path from node_modules
    try {
        await dbInstance.loadExtension(sqleanLibs.statsLibPath);
        console.log('PLUGIN ADDED');
    } catch (error) {
        console.error('Cant load SQLITE STATS lib due to error:', error);
    }
})();

```

## Version mapping
Following versions of sqlite3-sqlean module
Versions of sqlite3-sqlean module matching of sqlean binaries version:

Version | sqlean ver. | comments
--------- | ------------- | ----------
0.1.0 | 0.9.1 | Initial version
