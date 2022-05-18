//globalVariables
var zipInputEl = document.querySelector("#zip");
var searchButtonEl = document.querySelector("#search-button");
var searchFormEl = document.querySelector("#search-form");
var resultsContainerEl = document.querySelector("#results-container")
var nameContainerEl = document.querySelector("#name-container");
var buttonsContainerEl = document.querySelector("#buttons-container");
var searchHistory = [];
var displayCount = 0;
var clearHistoryButtonEl = document.querySelector("#clear-history");


var formSubmitHandler = function(event) { //called by event listener on search form submit button
    event.preventDefault();
    var zipInput = zipInputEl.value.trim( );
    if (isNaN(zipInput)) { //ERROR HANDLING TO DETECT NON-NUMERIC CHARACTERS IN THE INPUT
        $('#input-alert').foundation('open');
        zipInputEl.value = ""         
    } else if (zipInput.length == 5) { //check to verify if input is a 5-digit zipcode
        console.log("A search has been initialized for the zip code of: " + zipInput);
        zipInputEl.value = ""; 
        getCoordinates(zipInput); //pass zip to function to retrieve coordinates
    } else { //if input invalid, trigger input-alert modal 
        $('#input-alert').foundation('open'); 
        zipInputEl.value = ""         
    }  
};

var updateSearchHistory = function(cityName, stateId, zipInput) { 
    var newSearch = { //create new object to save search parameters
        city: cityName,
        state: stateId,
        zip: zipInput
    }
    // console.log(newSearch);
    searchHistory.push(newSearch); 
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); //set search history in localStorage
    var historyButtonEl = document.createElement("button"); //create new button for the saved search
    $(historyButtonEl).addClass("button"); 
    historyButtonEl.textContent = zipInput.concat(" (", cityName, ", ", stateId, ")");
    historyButtonEl.setAttribute("id", zipInput);
    console.log(zipInput.concat(" (", cityName, ", ", stateId, ")"));
    buttonsContainerEl.appendChild(historyButtonEl);
    clearHistoryButtonEl.classList.remove("not-shown"); //reveal clear-history button
}

var loadSearchHistory = function() { //called upon page load
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")); //retrieve search history array from localStorage
    if (!searchHistory){
        searchHistory = [];
    } else { //create new variables for the attribute data of each object in the array, and use that data to create and append a new button to the page for that search
        $.each(searchHistory, function (e) {
            var cityName = $(this).attr("city");
            var stateId = $(this).attr("state");
            var zip = $(this).attr("zip");
            var historyButtonEl = document.createElement("button");
            $(historyButtonEl).addClass("button");
            historyButtonEl.textContent = (zip + " (" + cityName + ", " + stateId + ")");
            historyButtonEl.setAttribute("id", zip);
            buttonsContainerEl.appendChild(historyButtonEl);
            clearHistoryButtonEl.classList.remove("not-shown"); //if a search history exists, show the clear-history button
        })
    };
}

var getCoordinates = function(zipInput) { //called by form submit handler
    var apiKey = "3e833f7a376ea50a4b5e624e59d6e907" 
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + zipInput + "," + "US"; //positionstack api uses zip code to retrieve coordinates
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) { 
                response.json().then(function(data) { 
                    // console.log(data);
                    var latitude = data.data[0].latitude; //create new local variables for response data
                    var longitude = data.data[0].longitude;
                    var cityName = data.data[0].locality;
                    var stateId = data.data[0].region_code;
                    console.log(latitude, longitude, cityName, stateId);
                    getTrailInfo(latitude, longitude); 
                    updateSearchHistory(cityName, stateId, zipInput); //pass zip to search history
                    nameContainerEl.textContent = ("Showing Results for: " + zipInput + " (" + cityName + ", " + stateId + ")");
            });
            } else {
                console.log("Error: " + response.statusText, " passing parameters to backup API function");
                getCoordinatesPlanB(zipInput);  //if fetch fails due to insecure request, call backup API function
            };
        })    
        .catch(function(error) {
            //CALL FOR BACKUP API
            getCoordinatesPlanB(zipInput);
            // $('#api-alert').foundation('open');
        });    
}

var getCoordinatesPlanB = function(zipInput) {
    var apiKey = "AtVPCFspco6yXG6X2mdr0-y2H4XO7ZPHdP_Tj-jLPHoBCXKiJlNCsG41H7GSWoYl";
    var apiUrl = "http://dev.virtualearth.net/REST/v1/Locations?q=" + zipInput + "&key=" + apiKey;
    fetch(apiUrl) //bing maps location API
        .then(function(response) {
            if (response.ok) { 
                response.json().then(function(data) { 
                    // console.log(data); 
                    //create new local variables for response data
                    var latitude = data.resourceSets[0].resources[0].point.coordinates[0];
                    var longitude = data.resourceSets[0].resources[0].point.coordinates[1];
                    var cityName = data.resourceSets[0].resources[0].address.locality;
                    var stateId = data.resourceSets[0].resources[0].address.adminDistrict;
                    console.log(latitude, longitude, cityName, stateId);
                    getTrailInfo(latitude, longitude);
                    updateSearchHistory(cityName, stateId, zipInput); //pass zip to search history
                    nameContainerEl.textContent = ("Showing Results for: " + zipInput + " (" + cityName + ", " + stateId + ")");
                });
            } else {
                console.log("Error: " + response.statusText);
            };
        })    
        .catch(function(error) {
            $('#api-alert').foundation('open');  //if fetch fails, trigger api-alert modal
        });    

}

//ANCHOR LINK TO SEARCH FOR NAME AND ZIP CODE ON GOOGLE MAPS? 

var getTrailInfo = function(latitude, longitude) {
    var apiKey = "AtVPCFspco6yXG6X2mdr0-y2H4XO7ZPHdP_Tj-jLPHoBCXKiJlNCsG41H7GSWoYl";
    var apiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Parks&userCircularMapView=" + latitude + "," + longitude + "," + "5000&key=" + apiKey; //returns POIs like community centers, landmarks, farms, etc. NO TRAILS OR PARKS.
    // var apiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=park&userCircularMapView=" + latitude + "," + longitude + "," + "5000&key=" + apiKey; search one parameter at a time - PARK | TRAIL
    // var apiUrl = "https://dev.virtualearth.net/REST/v1/LocationRecog/" + latitude + "," + longitude + "?radius=" + "2&top=5&distanceunit=km&includeEntityTypes=naturalPOI&key=" + apiKey; limit 2 km radius, not useful
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) { 
                response.json().then(function(data) { 
                    console.log(data);
                    if (data.resourceSets[0].resources.length == 0) { //if no results in the response, trigger a modal alert
                        console.log("No results found in your area! Go blaze your own trail! (or try a different location)");
                        $('#no-results').foundation('open');
                    } else if (data.resourceSets[0].resources.length > 0) { //if results found, pass response data to new function
                        buildTrailArrays(data);                        
                    }
                });
            } else {
                console.log("Error: " + response.statusText);
                $('#api-alert').foundation('open');
            };
        })    
        .catch(function(error) {
            // alert("Unable to connect to trail finder server!");
            $('#api-alert').foundation('open');
        });    
};
    
var buildTrailArrays = function(data) {
    var resultsObject = { //create new local object variable of empty arrays, for each response property
        nameArr: [],
        addressArr: [],
        phoneArr: [],
        websiteArr:[]
    };
    
    for (var i=0; i < data.resourceSets[0].resources.length; i++) { //use loop to populate the arrays with each response value
        // console.log(data.resourceSets[0].resources[i]);
        resultsObject.nameArr.push(data.resourceSets[0].resources[i].name);
        resultsObject.addressArr.push(data.resourceSets[0].resources[i].Address.formattedAddress);
        resultsObject.phoneArr.push(data.resourceSets[0].resources[i].PhoneNumber);
        resultsObject.websiteArr.push(data.resourceSets[0].resources[i].Website);
        
        // potential error handling to determine if response includes geocode data or not
        // if (data.resourceSets[0].resources[i].point.coordinates) {
        //     var resultCoordinates = resultsObject.point.coordinates;
        //     console.log(resultCoordinates);
        // } else {
        //     console.log("no coordinates provided");
        // };
    };
    // console.log(resultsObject);
    displayTrailInfo(resultsObject) // pass new object of data arrays to display function
};

var displayTrailInfo = function(resultsObject) {
    //create local variables to hold element ID prefixes
    var nameIdPrefix = "name";
    var addressIdPrefix = "address";
    var phoneIdPrefix = "phone";
    var websiteIdPrefix = "website";
    var resultRowIdPrefix = "results-row";
    for (var i = 0; i < 5; i++) { //loop 5x to create new variables with target element IDs to insert response data into page
        var targetNameId = nameIdPrefix.concat("-", (i+1));
        var targetAddressId = addressIdPrefix.concat("-", (i+1));
        var targetPhoneId = phoneIdPrefix.concat("-", (i+1));
        var targetWebsiteId = websiteIdPrefix.concat("-", (i+1));
        var targetResultRowId = resultRowIdPrefix.concat("-", (i+1));
               
        if (!resultsObject.nameArr[i]) { //if the name array is empty for a new index, then there will be no other results for that matching index in the other arrays, so the entire row can be hidden
            document.getElementById(targetNameId).textContent = "No Result Found!";
            document.getElementById(targetAddressId).textContent = "No Result Found!";
            document.getElementById(targetPhoneId).textContent = "No Result Found!";
            document.getElementById(targetWebsiteId).textContent = "No Result Found!";
            document.getElementById(targetResultRowId).classList.add("not-shown");
            
        } else {  //if the array does have content, display it on the page
            document.getElementById(targetNameId).textContent = resultsObject.nameArr[i];

        }
        if (!resultsObject.addressArr[i]) { //run this same check for each property
            document.getElementById(targetAddressId).textContent = "No Address Found!";

        } else {
            document.getElementById(targetAddressId).textContent = resultsObject.addressArr[i];
        }

        if (!resultsObject.phoneArr[i]) {
            document.getElementById(targetPhoneId).textContent = "No Phone # Found!";

        } else {
            document.getElementById(targetPhoneId).textContent = resultsObject.phoneArr[i];
        }
        
        if (!resultsObject.websiteArr[i]) { 
            document.getElementById(targetWebsiteId).textContent = "No Website Found!";
        } else {
            document.getElementById(targetWebsiteId).textContent = "website";
            document.getElementById(targetWebsiteId).setAttribute("href", resultsObject.websiteArr[i]);
            document.getElementById(targetWebsiteId).setAttribute("target", "_blank");
        }

        // console.log(resultsObject.websiteArr[i]);
    };
    resultsContainerEl.classList.remove("not-shown"); //remove hidden class to display content on page
    clearHistoryButtonEl.classList.remove("not-shown") //remove hidden class to display clear-history button on page

};

var buttonClickHandler = function(event) { //when search history button is clicked
    var zipInput = event.target.getAttribute("id") //locate the button's ID and make it the zipInput value
    if(zipInput.length == 5) { //verify button clicked was for a search history button with a zip code as the ID
        resultsContainerEl.classList.remove("not-shown"); //remove hidden class from search results container
        getCoordinates(zipInput); //pass zip code to function to pull coordinates and repeat process
;    } else if (zipInput = "clear-history") { //if the clear-history button is clicked instead, clear local storage and refresh page
        localStorage.clear() 
        location.reload() 
    };
};

loadSearchHistory()

searchFormEl.addEventListener("submit", formSubmitHandler); //event listener for initial search button
buttonsContainerEl.addEventListener("click", buttonClickHandler);  //event listener for search history buttons


//API KEY SECRET - ADD PLACEHOLDER FOR YOUR API KEY ONCE PRESENTATION IS OVER. PUSH TO GH SO THAT IT ISNT VIEWABLE. THEN MAKE NOTE IN THE README POINT TO WHERE YOUR API KEY. 