//globalVariables
var zipInputEl = document.querySelector("#zip");
var searchButtonEl = document.querySelector("#search-button");
var searchFormEl = document.querySelector("#search-form");
var resultsContainerEl = document.querySelector("#results-container")
var nameContainerEl = document.querySelector("#name-container");
var buttonsContainerEl = document.querySelector("#buttons-container");
var searchHistory = [];
var displayCount = 0;


var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log("the submit button was clicked!")
    // resultsContainer.textContent="";
    var zipInput = zipInputEl.value.trim( );
    console.log(zipInput);  
    if (isNaN(zipInput)) { //ERROR HANDLING TO DETECT NON-NUMERIC CHARACTERS IN THE INPUT
        $('#input-alert').foundation('open');
        zipInputEl.value = ""         

        // alert("Please re-enter your search term as a 5-digit zip code (Ex:'15212'");
        // location.reload();
    } else if (zipInput.length == 5) { //check to verify if input is a 5-digit zipcode
        console.log("A search has been initialized for the zip code of: " + zipInput);
        zipInputEl.value = ""; 
        getCoordinates(zipInput); //pass zip to function to retrieve coordinates
        // getTrailInfo(zipInput);
    } else { //if input invalid, (ex: trigger user MODAL to re-enter)
        $('#input-alert').foundation('open'); 
        zipInputEl.value = ""         
    }  
};

var updateSearchHistory = function(cityName, stateId, zipInput) {
    var newSearch = {
        city: cityName,
        state: stateId,
        zip: zipInput
    }
    console.log(newSearch);
    searchHistory.push(newSearch);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); //set search history in localStorage
    var historyButtonEl = document.createElement("button");
    $(historyButtonEl).addClass("button"); 
    historyButtonEl.textContent = zipInput.concat(" (", cityName, ", ", stateId, ")");
    historyButtonEl.setAttribute("id", zipInput);
    console.log(zipInput.concat(" (", cityName, ", ", stateId, ")"));
    buttonsContainerEl.appendChild(historyButtonEl);
}


// var displaySearchButtons = function(newSearch) {
// console.log(newSearch);
// };

var loadSearchHistory = function(zipInput) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory){
        searchHistory = [];
    } else {
        $.each(searchHistory, function (e) {
            var cityName = $(this).attr("city");
            var stateId = $(this).attr("state");
            var zip = $(this).attr("zip");
            var historyButtonEl = document.createElement("button");
            $(historyButtonEl).addClass("button");
            historyButtonEl.textContent = (zip + " (" + cityName + ", " + stateId + ")");
            historyButtonEl.setAttribute("id", zip);
            buttonsContainerEl.appendChild(historyButtonEl);
        })
    };
}

var getCoordinates = function(zipInput) {
    console.log(zipInput);
    var apiKey = "3e833f7a376ea50a4b5e624e59d6e907"
    var apiUrl = "https://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + zipInput + "," + "US";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) { 
                response.json().then(function(data) { 
                    console.log(data);
                    var latitude = data.data[0].latitude;
                    var longitude = data.data[0].longitude;
                    var cityName = data.data[0].locality;
                    var stateId = data.data[0].region_code;
                    console.log(latitude, longitude, cityName, stateId);
                    console.log(cityName + ', ' + stateId);
                    getTrailInfo(latitude, longitude);
                    updateSearchHistory(cityName, stateId, zipInput); //pass zip to search history
                    nameContainerEl.textContent = ("Showing Results for: " + zipInput + " (" + cityName + ", " + stateId + ")");
            });
            } else {
                console.log("Error: " + response.statusText);
            };
        })    
        .catch(function(error) {
            // alert("Unable to connect to Nature Finder servers!");
            $('#api-alert').foundation('open');
        });    
}

//ANCHOR LINK TO SEARCH FOR NAME AND ZIP CODE ON GOOGLE MAPS? 

var getTrailInfo = function(latitude, longitude) {
    // var secretKey = 
    var apiKey = "AtVPCFspco6yXG6X2mdr0-y2H4XO7ZPHdP_Tj-jLPHoBCXKiJlNCsG41H7GSWoYl";
    var apiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Parks&userCircularMapView=" + latitude + "," + longitude + "," + "5000&key=" + apiKey; //returns POIs like community centers, landmarks, farms, etc. NO TRAILS OR PARKS.
    // var apiUrl = "https://dev.virtualearth.net/REST/v1/LocalSearch/?query=park&userCircularMapView=" + latitude + "," + longitude + "," + "5000&key=" + apiKey; search one parameter at a time - PARK | TRAIL
    // var apiUrl = "https://dev.virtualearth.net/REST/v1/LocationRecog/" + latitude + "," + longitude + "?radius=" + "2&top=5&distanceunit=km&includeEntityTypes=naturalPOI&key=" + apiKey; limit 2 km radius, not useful
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) { 
                response.json().then(function(data) { 
                    console.log(data);
                    if (data.resourceSets[0].resources.length == 0) {
                        console.log("No results found in your area! Go blaze your own trail! (or try a different location)");
                        //call new function to clear page content?
                        //add modal
                    } else if (data.resourceSets[0].resources.length > 0) {
                        console.log(data.resourceSets[0].resources[0].Address.formattedAddress);
                        console.log(data.resourceSets[0].resources.length);
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
    var resultsObject = {
        nameArr: [],
        addressArr: [],
        phoneArr: [],
        websiteArr:[]
    };
    
    for (var i=0; i < data.resourceSets[0].resources.length; i++) {
        // console.log(data.resourceSets[0].resources[i]);
        resultsObject.nameArr.push(data.resourceSets[0].resources[i].name);
        resultsObject.addressArr.push(data.resourceSets[0].resources[i].Address.formattedAddress);
        resultsObject.phoneArr.push(data.resourceSets[0].resources[i].PhoneNumber);
        resultsObject.websiteArr.push(data.resourceSets[0].resources[i].Website);
        
        // name: data.resourceSets[0].resources[i].name,
        // address: data.resourceSets[0].resources[i].Address.formattedAddress,
        // phone: data.resourceSets[0].resources[i].PhoneNumber,
        // website: data.resourceSets[0].resources[i].Website
        // var resultWebsite =  resultsObject.Website;
        // var resultPhone = resultsObject.PhoneNumber;
        
        // if (data.resourceSets[0].resources[i].point.coordinates) {
        //     var resultCoordinates = resultsObject.point.coordinates;
        //     console.log(resultCoordinates);
        // } else {
        //     console.log("no coordinates provided");
        // };
    };
    console.log(resultsObject);
    displayTrailInfo(resultsObject)
};

var displayTrailInfo = function(resultsObject) {
    console.log(resultsObject); //replace with data/or data response object
    //add dark border class to all divs (to make them appear visible)
    // displayCount++
    // if (displayCount <= 5) {
        var nameIdPrefix = "name";
        var addressIdPrefix = "address";
        var phoneIdPrefix = "phone";
        var websiteIdPrefix = "website";
    for (var i = 0; i < 5; i++) {
        var targetNameId = nameIdPrefix.concat("-", (i+1));
        var targetAddressId = addressIdPrefix.concat("-", (i+1));
        var targetPhoneId = phoneIdPrefix.concat("-", (i+1));
        var targetWebsiteId = websiteIdPrefix.concat("-", (i+1));
        
        document.getElementById(targetNameId).textContent = resultsObject.nameArr[i];
        document.getElementById(targetAddressId).textContent = resultsObject.addressArr[i];
        document.getElementById(targetPhoneId).textContent = resultsObject.phoneArr[i];
        document.getElementById(targetWebsiteId).textContent = "website";
        document.getElementById(targetWebsiteId).setAttribute("href", resultsObject.websiteArr[i]);
        document.getElementById(targetWebsiteId).setAttribute("target", "_blank");


    };
};

var buttonClickHandler = function(event) {
    var zipInput = event.target.getAttribute("id")
    if(zipInput.length == 5) {
        // resultsContainerEl.textContent=""
        getCoordinates(zipInput);
;    } else if (zipInput = "clear-history") {
        localStorage.clear()
        location.reload()
    };
};

loadSearchHistory()

searchFormEl.addEventListener("submit", formSubmitHandler); //event listener for initial search button
buttonsContainerEl.addEventListener("click", buttonClickHandler);


//API KEY SECRET - ADD PLACEHOLDER FOR YOUR API KEY. PUSH TO GH SO THAT IT ISNT VIEWABLE. THEN MAKE NOTE IN THE README POINT TO WHERE YOUR API KEY. 

//Function for formHandling - called by event listener for the submit button
//function for initial API call (trailSearch) - fetch initial API  
//pass data to new function to display the info on the page 


//function for second API call (weatherSearch) to get weather by zip code - get respose as an object or array
//function to display page content - change classes of search result containers to visible, append content to page 

