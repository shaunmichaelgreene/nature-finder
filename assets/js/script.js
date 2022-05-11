//globalVariables
var searchInputEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-button");
var resultsContainerEl = document.querySelector("#results-container")

var formSubmitHandler = function(event) {
    event.preventDefault();
    // resultsContainer.textContent="";
    var zipInput = searchInput.value.trim( );
    if (zipInput.includes(',')) { //NEED ERROR HANDLING TO DETECT NON-NUMERIC CHARACTERS IN THE INPUT, AND EXACTLY 5 CHARACTERS (string length, includes)
        console.log("A search has been initialized for the zip code of: " + zipInput);
        searchInputEl.value = ""; 
        if (zipInput) { //check to verify variable is valid
            updateSearchHistory(zipInput); //pass zip to search history
            getCoordinates(zipInput); //pass zip to function to retrieve coordinates
        } else { //if input invalid, (ex: trigger user MODAL to re-enter)
            alert("Please re-enter your search term as a 5-digit zip code (Ex:'15212'");
            location.reload(); //add timer to do this automatically after 
        }
    } else {
        alert("Please re-enter your search term as a 5-digit zip code (Ex:'15212'");
        location.reload(); 
    }
};

var updateSearchHistory = function() {
    console.log(zipInput);
}

var getCoordinates = function() {
    console.log(zipInput);
}

var getTrailInfo = function() {
    console.log(zipInput);
}

var displayTrailInfo = function() {
    console.log(zipInput); //replace with data/or data response object
}

var getWeather = function() {
    console.log(zipInput);
}

var displayWeather = function() {
    console.log(zipInput);  
}

searchButtonEl.addEventListener("submit", formSubmitHandler); //event listener for initial search button



//Function for formHandling - called by event listener for the submit button
//function for initial API call (trailSearch) - fetch initial API  
//pass data to new function to display the info on the page 


//function for second API call (weatherSearch) to get weather by zip code - get respose as an object or array
//function to display page content - change classes of search result containers to visible, append content to page 

