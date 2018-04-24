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
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/events.js",
        "id": "cordova-plugin-chrome-apps-common.events",
        "pluginId": "cordova-plugin-chrome-apps-common",
        "clobbers": [
            "chrome.Event"
        ]
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/errors.js",
        "id": "cordova-plugin-chrome-apps-common.errors",
        "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/stubs.js",
        "id": "cordova-plugin-chrome-apps-common.stubs",
        "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-common/helpers.js",
        "id": "cordova-plugin-chrome-apps-common.helpers",
        "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-system-network/system.network.js",
        "id": "cordova-plugin-chrome-apps-system-network.system.network",
        "pluginId": "cordova-plugin-chrome-apps-system-network",
        "clobbers": [
            "chrome.system.network"
        ]
    },
    {
        "file": "plugins/cordova-plugin-chrome-apps-socket/socket.js",
        "id": "cordova-plugin-chrome-apps-socket.Socket",
        "pluginId": "cordova-plugin-chrome-apps-socket",
        "clobbers": [
            "chrome.socket"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/browser/notification.js",
        "id": "cordova-plugin-dialogs.notification_browser",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
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
    "cz.blocshop.socketsforcordova": "1.1.0",
    "cordova-plugin-chrome-apps-common": "1.0.7",
    "cordova-plugin-chrome-apps-system-network": "1.1.2",
    "cordova-plugin-chrome-apps-socket": "1.2.3",
    "cordova-plugin-websocket": "0.12.2",
    "cordova-plugin-dialogs": "2.0.1"
}
// BOTTOM OF METADATA
});