/** 
 * Preinstall script.
 * 
 * Fetch appropriate module versions from gitHub (depending on
 * target OS) and store it in local lib folder.
 * 
 */
const os = require("os");
var https = require('https');
const fs = require('fs');

console.log(process.env.npm_package_config_sqleanVersion);

// path to libs release folder on GitHub (appropriate version)
const rootUri = 'https://github.com/nalgeon/sqlean/releases/download/' + process.env.npm_package_config_sqleanVersion;

// list of available libs
const libs = ['crypto', 'ipaddr', 'json1', 'math', 're', 'stats', 'text', 'unicode', 'vsv'];

/** 
 * Stores remote file on local fs
 * Utility method to get file from remote location and store it 
 * */
const getFile = (moduleName, url, localFilePath, resolve, reject) => {
    https.get(url, (res) => {
        // redirect
        if (res.statusCode === 301 || res.statusCode === 302) {
            return getFile(moduleName, res.headers.location, localFilePath, resolve, reject);
        } else if (res.statusCode === 200) {
            console.log('Saving lib %s to %s', moduleName, localFilePath);
            // if succeed, create file write stream and pipe response to it
            var sWriteFile = fs.createWriteStream(localFilePath);
            res.pipe(sWriteFile);
            // wait for both download and write to finish
            res.on("end", () => {
                try {
                    sWriteFile.on('finish', function () {
                        resolve({ [moduleName]: localFilePath })
                    });
                } catch (err) {
                    console.log('RESPONSE ERROR');
                    reject(err);
                }
            })
        } else if (res.statusCode === 404) {
            console.log('Sqlean ' + moduleName + ' not found!');
            resolve(undefined)
        } else {
            // reject in any other case
            reject('Unknow response code');
        };
    });
};

/** 
 * Promise wrapper around  getFile method 
 * 
 * */
async function saveFile(moduleName, url, localFilePath) {
    return new Promise((resolve, reject) => getFile(moduleName, url, localFilePath, resolve, reject));
}

/** Get appropriate extension for OS type */
const getExtension = () => {
    const targetOs = os.type();
    if (targetOs.toUpperCase().startsWith('WIN')) {
        return 'dll'
    } else if (targetOs.toUpperCase().startsWith('LINUX')) {
        return 'so'
    } else if (targetOs.toUpperCase().startsWith('DARWIN')) {
        return 'dylib'
    } else {
        throw new Error('Unknown OS type');
    }
}

(async () => {
    // create lib target path if not exist
    // create local path if not exists
    if (!fs.existsSync('./lib/')){
        fs.mkdirSync('./lib/', { recursive: true });
    }    
    // prepare object to hold actual files
    const filePromises = [];
    console.log('Fetching OS-specific binaries from sqlean github releases page');
    for (let i = 0; i < libs.length; i++) {
        const libName = libs[i];
        try {
            const fileUrl = rootUri + '/' + libName + '.' + getExtension()
            const localFilePath = './lib/' + libName + '.' + getExtension();
            filePromises.push(saveFile(libName, fileUrl, localFilePath))
        } catch (error) {
            console.log('Error fetching lib file %s due to Error: %s \nNo file stored!', libName, error.message);
        }
    };

    // wait all files to be downloaded
    try {
        const files = await Promise.all(filePromises);
        // prepare files list from promise results
        const moduleList = files.reduce((obj, item) => {
            if (item) {
                return Object.assign(obj, item)
            } else {
                return obj
            }
        }, {});

        // write files list 
        fs.writeFileSync('./libs.json', JSON.stringify(moduleList, undefined, 2));   
    } catch (error) {
        console.error('Error downloading files:', error);
    }
})()






