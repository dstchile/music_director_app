cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-ip-mac-address/www/addressimpl.js",
        "id": "cordova-plugin-ip-mac-address.addressimpl",
        "pluginId": "cordova-plugin-ip-mac-address",
        "clobbers": [
            "addressimpl"
        ]
    },
    {
        "file": "plugins/cordova-plugin-deviceinfo/www/client.js",
        "id": "cordova-plugin-deviceinfo.client",
        "pluginId": "cordova-plugin-deviceinfo",
        "clobbers": [
            "community.deviceInfo"
        ]
    },
    {
        "file": "plugins/cordova-plugin-networkinterface/www/networkinterface.js",
        "id": "cordova-plugin-networkinterface.networkinterface",
        "pluginId": "cordova-plugin-networkinterface",
        "clobbers": [
            "window.networkinterface"
        ]
    },
    {
        "file": "plugins/cordova-plugin-networkinterface/src/browser/networkinterfaceProxy.js",
        "id": "cordova-plugin-networkinterface.networkinterfaceProxy",
        "pluginId": "cordova-plugin-networkinterface",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-node/www/node.js",
        "id": "cordova-plugin-node.node",
        "pluginId": "cordova-plugin-node",
        "clobbers": [
            "node"
        ]
    },
    {
        "file": "plugins/cz.blocshop.socketsforcordova/socket.js",
        "id": "cz.blocshop.socketsforcordova.Socket",
        "pluginId": "cz.blocshop.socketsforcordova",
        "clobbers": [
            "window.Socket"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-add-swift-support": "1.7.2",
    "cordova-plugin-websocket-server": "1.4.10",
    "cordova-plugin-ip-mac-address": "1.0.1",
    "cordova-plugin-deviceinfo": "1.0.1",
    "cordova-plugin-networkinterface": "2.0.0",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-node": "0.1.1",
    "cz.blocshop.socketsforcordova": "1.1.0"
}
// BOTTOM OF METADATA
});