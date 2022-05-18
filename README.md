# Nature Finder

Nature Finder is an application that will allow you to search a zipcode to find nearby parks, trails and other natural points of interest.

**User Story:** AS A user, I WANT to locate and view info about natural points-of-interest in my area, SO THAT I can decide which one to visit.

This app utilizes HTML, CSS, JavaScript and multiple APIs to create a single-page application to find nearby parks or trails. The user enters their zip code and is shown the name, address, phone #, and website (if applicable) for up to 5 natural POIs in a 5km radius. The zip code is passed to a function that fetches a positionstack API to return the geographical coordinates and city/state name. A second function then uses the coordinates to fetch the POI data from a Bing Maps API. A 3rd API with Bing Maps was installed as a backup to support the positionstack API, as the free version of positionstack does not support HTTPS encryption, which is required by GitHub Pages. As a result, the positionstack API is only usable in a test environment. 

**Presentation:** https://docs.google.com/presentation/d/1fCUpbm_U-_Q4L0K-1IIRDDiC1S_TNNcZ-WKClF4j65M/edit?usp=sharing

## Live Deployed Link:
https://shaunmichaelgreene.github.io/easy-trail-finder/

**Screenshot:** 
[![screenshot.jpg](https://i.postimg.cc/vmmSVSd7/screenshot.jpg)](https://postimg.cc/PCB4GyJN)

## Contributors
Shaune Greene, Dylan Okum, Danielle Vespa

**Special Thanks To**:  Kevin Begin, Cabral Williams, Brennan Spicer, [Oziel Gómez](https://www.pexels.com/@ozgomz/), [positionstack](https://positionstack.com/), [Bing Maps](https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fbingmaps%2Frest-services%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2FBingMaps%2Fbreadcrumb%2Ftoc.json).
