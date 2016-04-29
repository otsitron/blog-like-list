/*------------------------------------------------------------------------
Get data from JSON file and place it in local storage
Available for use and manipulation in all other objects
------------------------------------------------------------------------*/
var getJSONData = {
	options:{
		storage: window.localStorage,
		allData: {}
	},
	init:function(callback){
		var self = this;
		
		$.getJSON("http://olgatsitron.com/tumblrTst/api/api.json",
		function(data) {
            self.options.storage.setItem("allData", JSON.stringify(data));
			allData = JSON.parse(self.options.storage.getItem("allData"));
        })
			.error(function() { console.log("error"); })
			.success(function(){
                callback(allData);
                console.log(allData);
		});
	}
};


/*------------------------------------------------------------------------
Create left and right side views depending on where you are in the process.
Same local storage data that was used in setting up nav.
------------------------------------------------------------------------*/
var formBuilder = {
	options:{
		storage: window.localStorage
	},

	init: function(allData) {
		var self = this;
	}
};

$(document).ready(function(e) {
	getJSONData.init(function(allData) { 
        console.log()
	}); 
});

