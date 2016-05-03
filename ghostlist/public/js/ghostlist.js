
/*------------------------------------------------------------------------
Ghostlist, or a virtual list, is a mechanism for displaying large amount 
of scrollable content (such as the Tumblr dashboard or search) which 
aims to avoid performance issues that would be caused by having all 
content present in the DOM at the same time.
------------------------------------------------------------------------*/
var ghostBlog = {
	options:{
		listWrapper: "#theBlog",
        itemTemplate: ".blogPostTemplate",
        blogPosts: new Array //will hold data for all blog posts
	},
	init:function(allData){
		var self = this;
		
        self.options.blogPosts = allData.posts;
        self.buildPosts();
	},
    buildPosts: function(){
        var self = this;
        
		$.each(self.options.blogPosts, function(index){
            //copy template for an item (hidden by default at the bottom of html)
            templateClone = $(".blogPostTemplate").find("li").clone();
            
            //match elements to data
            templateClone.attr({"data-id": index}); //set id in the DOM
            this.id = index; //set id in the API
            
            //fill in the blanks in the DOM of this element
            self.fillInTheBlanks(templateClone, index);
            
            //add this to the end of the list in the DOM
			$(self.options.listWrapper).append(templateClone);
           
            self.windowActions(templateClone);
		});
        //test single element
        //testEl = $(self.options.listWrapper).find("li[data-id='5']");
        //testEl.css("background-color","red");
        //console.log(testEl)
        //self.windowActions(testEl);
    },
    
    //do this once when a batch of data is loaded for the first time
    //for lazy loading content, this could mean a call to this function
    //with every new batch of data when the bottom is reached.
    fillInTheBlanks: function(elToFill, index){
        var self = this;
        
        elToFill.find("time").html(self.options.blogPosts[index].date);
        elToFill.find("h2").html(self.options.blogPosts[index].title);
        elToFill.find(".content").html(self.options.blogPosts[index].content);
        elToFill.find(".author .name").html(self.options.blogPosts[index].author.firstName + ' ' + self.options.blogPosts[index].author.lastName);
        
        //store HTML in the API to retrieve it again when needed.
        self.options.blogPosts[index].storeContent = elToFill.contents();
    },
    
    windowActions: function(thisBlogItem){
        var self = this;
        var coordinates = {
            elementPos: document.body.scrollTop,    //this is how far we scrolled
            scrollerPos:document.body.clientHeight, //this is the height of the view
            viewHeight: thisBlogItem.offset().top   //this is where the element is from the top of the page
        }
        
        function setCoordinates(){
            coordinates.scrollerPos = document.body.scrollTop;  
            coordinates.viewHeight = document.body.clientHeight + 200; //give some extra space to the view
            coordinates.elementPos = thisBlogItem.offset().top;                                                        
        };
        
        //what happens when we scroll...
        //but only vertically
        $(window).scroll(function() {
            setCoordinates();
            whereIsIt(coordinates);
        });
        
        //what happens when we resize the window
        $(window).resize(function() {
            setCoordinates();
            whereIsIt();
        });
        
        //WHERE IS THIS ELEMENT? it's all relative...
        function whereIsIt(){
            //it's below the view :-\
            if(coordinates.elementPos > coordinates.scrollerPos + coordinates.viewHeight){      
                self.removeContent(thisBlogItem);
                console.log("below");
            }//it's in the view!!! :-)
            else if(coordinates.elementPos > coordinates.scrollerPos - coordinates.viewHeight){
                self.addContent(thisBlogItem);
                console.log("in");
            }//it's above the view :-/
            else{                                          
                self.removeContent(thisBlogItem);
                console.log("above");
            }
        };
    },
    removeContent: function(itemToRemove){
        var self = this;
        
        //match the height of emptied element to its version
        //with contents to keep scrollbar from changing size
        itemToRemove.css("height",itemToRemove.height());
        
        //don't worry, we stored it in blogPosts object 
        //under appropriate id
        itemToRemove.contents().remove();
    },
    addContent: function(itemToAdd){
        var self = this;
        
        itemToAdd.css("height",""); //this is no longer necessary
        itemToAdd.html(self.options.blogPosts[itemToAdd.data("id")].storeContent);
    }
};

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
		
		$.getJSON("js/api.json",
		function(data) {
            self.options.storage.setItem("allData", JSON.stringify(data));
			allData = JSON.parse(self.options.storage.getItem("allData"));
        }).error(function() { 
            console.log("error"); 
        }).success(function(){
            callback(allData);
		});
	}
};
/*------------------------------------------------------------------------
The document is ready! Pass data to the blog.
------------------------------------------------------------------------*/
$(document).ready(function(e) {
	getJSONData.init(function(allData) {
        ghostBlog.init(allData);
	}); 
});

