/**
 * @description
    defination on platforms (both variants on platform like Electron)

    bower i --save s-inherit

    npm i --save s-inherit

 * @example window.inherit                      // in browser
 * @example var inherit = require('s-inherit')  // in Node.js
 *
 * @exports s-inherit
 * @public
 */
if ( typeof process != 'undefined' && Object.prototype.toString.call(process) == '[object process]' ) {
    module.exports = inherit;
}
if ( typeof window != 'undefined' && Object.prototype.toString.call(window) == '[object Window]' ) {
    window['inherit'] = inherit;
}
