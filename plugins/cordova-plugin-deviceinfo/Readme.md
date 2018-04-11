# community.deviceInfo Native Extension for applications built using BlackBerry 10 WebWorks

This extension provides additional APIs to identify the device.

## Version History

    1.0.0 Initial Release
    1.0.1 Bug fix for getNetwork() on 10.3.0+

**Author(s)** 

* Anzor Bashkhaz (http://www.twitter.com/anzor_b)
* Simon Booth (http://github.com/peardox)
* Alexandre Huot


## How To Install The Plugin

This API can be installed from source or from NPM. Installation from NPM is done through the following:

    cordova plugin add cordova-plugin-deviceinfo

Installation from source is the same but instead of the id ("cordova-plugin-deviceinfo"), use the file system path to the source plugin folder.

## Use

<pre>
//returns model number i.e. 'Z10'
community.deviceInfo.getModelNumber()
</pre> 

<pre>
//returns whether the device is a Simulator - 'true' or 'false'
community.deviceInfo.isSimulator()
</pre> 

<pre>
//returns Roaming Status as 'true' or 'false'
community.deviceInfo.getRoamingStatus()
</pre> 

<pre>
//returns whether device has physical keyboard as 0 or 1
community.deviceInfo.hasPhysicalKeyboard()
</pre> 

The following APIs require the following permission:
<b>read_cellular_data</b>

<pre>
//returns Mobile Country Code
community.deviceInfo.getMCC()
//returns Mobile Network Code, that identifies the carrier
community.deviceInfo.getMNC()
</pre>	

The following API returns detailed network information for the default interface (ideally WIFI or Cellular)
<pre>
//returns network information as a JSON object
community.deviceInfo.getNetwork()

Returned object structure...

status			- True/False - did the API work?
ifconnected		- True/False - is the interface connected?
ifipcount		- Number of IP addresses - should be 2, one IPv4 and one IPv6
ifname			- Interface name, e.g. bcm0
ifstatus		- Status of the interface - should be 1 (see [1] below)
iftype			- Type of the interface (see [2] below)
ifup			- True/False - is the interface up?
iplist			- Array of ifipcount object
	ifaddress	- IP of this connection [IPv4 / IPv6]
	ifnetmark	- Netmask of this connection [IPv4 / IPv6]

[1] Possible ifstatus values (from netstatus.h)

    NETSTATUS_IP_STATUS_ERROR_UNKNOWN = 0;
    NETSTATUS_IP_STATUS_OK = 1;
    NETSTATUS_IP_STATUS_ERROR_NOT_CONNECTED = 2;
    NETSTATUS_IP_STATUS_ERROR_NOT_UP = 3;
    NETSTATUS_IP_STATUS_ERROR_NOT_CONFIGURED = 4;
    NETSTATUS_IP_STATUS_ERROR_IP6_OFF = 5;
    NETSTATUS_IP_STATUS_ERROR_NO_IP_ADDRESS = 6;
    NETSTATUS_IP_STATUS_ERROR_NO_IP6_ADDRESS = 7;
    NETSTATUS_IP_STATUS_ERROR_NO_IP_GATEWAY = 8;
    NETSTATUS_IP_STATUS_ERROR_NO_IP6_GATEWAY = 9;
	NETSTATUS_IP_STATUS_ERROR_NO_NAME_SERVER = 10;


[2] Possible iftype values (from netstatus.h)
	
    NETSTATUS_INTERFACE_TYPE_UNKNOWN = 0;
    NETSTATUS_INTERFACE_TYPE_WIRED = 1;
    NETSTATUS_INTERFACE_TYPE_WIFI = 2;
    NETSTATUS_INTERFACE_TYPE_BLUETOOTH_DUN = 3;
    NETSTATUS_INTERFACE_TYPE_USB = 4;
    NETSTATUS_INTERFACE_TYPE_VPN = 5;
    NETSTATUS_INTERFACE_TYPE_BB = 6;
    NETSTATUS_INTERFACE_TYPE_CELLULAR = 7;
    NETSTATUS_INTERFACE_TYPE_P2P = 8;

</pre> 

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.