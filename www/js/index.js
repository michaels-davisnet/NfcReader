var app = {
	initialize : function () {
		this.bindEvents();
	},
	bindEvents : function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady : function () {
		// Params: event handler function, success callback, failure callback.
		nfc.addMimeTypeListener("text/pan", app.onNfc, initSuccess, initError);
		function initSuccess(status) {
			app.display("Tap a tag to read its id number.");
		}
		function initError(error) {
			app.display("NFC reader failed to initialize " + JSON.stringify(error));
		}

	},

	onNfc : function (nfcEvent) {
		app.clear();
		var tag = nfcEvent.tag;
		app.display("Tag ID: " + nfc.bytesToHexString(tag.id));
		app.showTag(nfcEvent.tag); // display the tag details
	},

	showTag : function (tag) {
		// if there is an NDEF message on the tag, display it.
		var message = tag.ndefMessage;
		if (message !== null) {
			var record = message[0];
			app.display("TNF: " + record.tnf);
			app.display("Type: " + nfc.bytesToString(record.type));
			app.display("Payload: " + nfc.bytesToString(record.payload));
		}
		else {
			app.display("No message");
		}
	},

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
