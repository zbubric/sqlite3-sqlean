const path = require('path');
const libs = require('./libs.json');
module.exports = {
    /** secure hashes */
    cryptoLibPath: libs.crypto ? path.resolve(__dirname, libs.crypto) : undefined,

    /** IP address manipulation */
    ipaddrLibPath: libs.ipaddr ? path.resolve(__dirname, libs.ipaddr) : undefined,

    /** JSON functions */
    json1LibPath: libs.json1 ? path.resolve(__dirname, libs.json1) : undefined,

    /** math functions */
    mathLibPath: libs.math ? path.resolve(__dirname, libs.math) : undefined,

    /** regular expressions */
    reLibPath: libs.re ? path.resolve(__dirname, libs.re) : undefined,

    /** math statistics */
    statsLibPath: libs.stats ? path.resolve(__dirname, libs.stats) : undefined,

    /** string functions */
    textLibPath: libs.text ? path.resolve(__dirname, libs.text) : undefined,

    /** Unicode support */
    unicodeLibPath: libs.unicode ? path.resolve(__dirname, libs.unicode) : undefined,

    /** CSV files as virtual tables */
    vsvLibPath: libs.vsv ? path.resolve(__dirname, libs.vsv) : undefined,
}



