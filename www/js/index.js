var app = {
	initialize : function () {
		this.bindEvents();
	},
	bindEvents : function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		tagButton.addEventListener('click', app.tag, false);
	},
	//////////////////////////////////////////////////////////////////////////////////////////////////
	MACaddress : "FA:22:C8:BB:93:0B",
	onDeviceReady : function () {
		// Params: event handler function, success callback, failure callback.
		nfc.addMimeTypeListener("text/pan", app.onNfc, initSuccess, initError);
		// TODO: Need to handle other nfc types.
		function initSuccess(status) {
			app.display("Place your phone on MAIA");
		}
		function initError(error) {
			app.display("NFC reader failed to initialize. Is NFC enabled? " + JSON.stringify(error));
		}
	},
	
	tag : function() {
		app.clear();
		app.display("Place your phone on MAIA");
		ble.disconnect(app.MACaddress);
	},
	onNfc : function (nfcEvent) {
		app.clear();
		var tag = nfcEvent.tag;
		// app.display("Tag ID: " + nfc.bytesToHexString(tag.id));
		app.display("MAIA Device Detected");
		app.showTag(nfcEvent.tag); // display the tag details
	},
	showTag : function (tag) {
		// if there is an NDEF message on the tag, display it.
		var message = tag.ndefMessage;
		if (message !== null) {
			var record = message[0];
			// app.display("TNF: " + record.tnf);
			// app.display("Type: " + nfc.bytesToString(record.type));
			app.MACaddress = nfc.bytesToString(record.payload);
			app.display("MAC: " + app.MACaddress);
			app.bleConnect();
		} else {
			app.display("No NFC message");
		}
	},

	bleConnect : function () {
		app.display("Scanning for Bluetooth...");
		ble.scan([], 5, scanned, failure);
		function scanned(device) {
			ble.connect(app.MACaddress, function () {
				app.clear();
				app.display("Connected to: " + device.name);
				// TODO: Read BLE data from here
				app.display("RSSI: " + device.rssi);
				app.display("Battery: 56%");
				app.display("Network Id: \"Davis Instruments\"");
				app.display("Firmware: v0.01b");
				app.watchLocation();
			}, function () {
				app.display("Failed to Connect");
			});
		}
		function failure() {
			app.display("Bluetooth Low Energy Error");
		}
	},
	//Displays the current position in the message div:
	watchLocation : function () {
		// Calls the function navigator.geolocation... when parent function is called.
		var watchId = navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
		// Declare these functions inside the scope of watchLocation. These are utility functions, only available within the scope of watchLocation.
		function onSuccess(position) {
			app.display('Location: ' + position.coords.latitude.toFixed(2) + ', ' + position.coords.longitude.toFixed(2));
		}
		function onError(error) {
			app.display(error.message);
			app.display("Is GPS enabled?");
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	display : function (message) {
		var label = document.createTextNode(message);
		var lineBreak = document.createElement("br");
		messageDiv.appendChild(lineBreak); // add a line break
		messageDiv.appendChild(label); // add the text
	},
	clear : function () {
		messageDiv.innerHTML = "";
	}
};
