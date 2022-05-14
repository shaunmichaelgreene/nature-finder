//globalVariables
var zipInputEl = document.querySelector("#zip");
var searchButtonEl = document.querySelector("#search-button");
var searchFormEl = document.querySelector("#search-form");
var resultsContainerEl = document.querySelector("#results-container")
var searchHistory = [];
var displayCount = 0;


var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log("the submit button was clicked!")
    // resultsContainer.textContent="";
    var zipInput = zipInputEl.value.trim( );
    console.log(zipInput);  
    if (isNaN(zipInput)) { //ERROR HANDLING TO DETECT NON-NUMERIC CHARACTERS IN THE INPUT
        alert("Please re-enter your search term as a 5-digit zip code (Ex:'15212'");
        location.reload();
    } else if (zipInput.length == 5) { //check to verify if input is a 5-digit zipcode
        console.log("A search has been initialized for the zip code of: " + zipInput);
        zipInputEl.value = ""; 
        updateSearchHistory(zipInput); //pass zip to search history
        getCoordinates(zipInput); //pass zip to function to retrieve coordinates
        // getTrailInfo(zipInput);
    } else {//if input invalid, (ex: trigger user MODAL to re-enter)
        alert("Please re-enter your search term as a 5-digit zip code (Ex:'15212'");
        location.reload();          
    }  
};

var updateSearchHistory = function(zipInput) {
    console.log(zipInput);
}

var loadSearchHistory = function(zipInput) {
    console.log(searchHistory);
}

var getCoordinates = function(zipInput) {
    console.log(zipInput);
    var apiKey = "3e833f7a376ea50a4b5e624e59d6e907"
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + zipInput + "," + "US";
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

            });
            } else {
                alert("Error: " + response.statusText);
            };
        })    
        .catch(function(error) {
            alert("Unable to connect to trail finder server!");
        });    
}

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
                        for (var i=0; i < data.resourceSets[0].resources.length; i++) {
                            // console.log(data.resourceSets[0].resources[i]);
                            var resultsObject = data.resourceSets[0].resources[i];
                            var resultName = resultsObject.name;
                            var resultAddress = resultsObject.Address.formattedAddress;
                            // if (data.resourceSets[0].resources[i].point.coordinates) {
                            //     var resultCoordinates = resultsObject.point.coordinates;
                            //     console.log(resultCoordinates);
                            // } else {
                            //     console.log("no coordinates provided");
                            // };
                            var resultWebsite =  resultsObject.Website;
                            var resultPhone = resultsObject.PhoneNumber;
                            displayTrailInfo(resultsObject)
                        };

                    }
            });
            } else {
                alert("Error: " + response.statusText);
            };
        })    
        .catch(function(error) {
            alert("Unable to connect to trail finder server!");
        });    
};


var displayTrailInfo = function(resultsObject) {
    console.log(resultsObject); //replace with data/or data response object
    //add dark border class to all divs (to make them appear visible)
    displayCount++
    if (displayCount <= 5) {
        var nameIdPrefix = "name";
        var addressIdPrefix = "address";
        var phoneIdPrefix = "phone";
        var websiteIdPrefix = "website";
        var targetNameId = nameIdPrefix.concat("-", displayCount);
        var targetAddressId = addressIdPrefix.concat("-", displayCount);
        var targetPhoneId = phoneIdPrefix.concat("-", displayCount);
        var targetWebsiteId = websiteIdPrefix.concat("-", displayCount);
        
        document.getElementById(targetNameId).textContent = resultsObject.name;
        document.getElementById(targetAddressId).textContent = resultsObject.Address.formattedAddress;
        document.getElementById(targetPhoneId).textContent = resultsObject.PhoneNumber;
        document.getElementById(targetWebsiteId).textContent = resultsObject.Website;

    };

}

loadSearchHistory()

searchFormEl.addEventListener("submit", formSubmitHandler); //event listener for initial search button



//Function for formHandling - called by event listener for the submit button
//function for initial API call (trailSearch) - fetch initial API  
//pass data to new function to display the info on the page 


//function for second API call (weatherSearch) to get weather by zip code - get respose as an object or array
//function to display page content - change classes of search result containers to visible, append content to page 