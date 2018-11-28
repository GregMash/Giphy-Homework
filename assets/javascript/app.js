//================================== Global variables ======================================================

const topics = ['cereal', 'raisin bran', 'cinnamon toast crunch', 'froot loops', 'corn pops', 'cheerios', 'lucky charms'];


//===================================== Functions ===========================================================

//render button function to use every time we add a new button
function renderButton() {

    //empty out the gif container which holds the buttons
    $('#button-container').empty();

    // make a loop through the topics array to create buttons for everything in the array, even the one that has been added
    //give them classes and data attributes and then append them to the place where the buttons go on html
    for (let i = 0; i < topics.length; i++) {
        const x = $('<button>');
        x.addClass('gif-button');
        x.attr('data-name', topics[i]);
        x.text(topics[i]);
        $('#button-container').append(x);
    }
};


//click event for adding a new landscape onto the page
$(document).on('click', '#submit-button', function (event) {
    //this will prevent the button from trying to submit a form
    event.preventDefault();
    //This grabs the text from the input field
    const userInput = $('#inputField').val().trim();
    //this pushes the user input into our array of topics
    topics.push(userInput);
    renderButton();
});


//this function will call out to the api and grab gifs from it based on the selected button.
function getGifName() {

    const gifName = $(this).attr('data-name');
    const myGiphyAPIKey = 'knxSPoPVYh2YBRGsPAdFgahd2jDZMJEy';
    const queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifName + "&api_key=" + myGiphyAPIKey + "&limit=10";

    // Here we have our ajax function
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //console log the response from giphy api   
        console.log(response);
        // this grabs the object that has the gif's in it
        const results = response.data;


        // we loop through those ten results, create a div to keep them in html
        for (let i = 0; i < results.length; i++) {
            const gifDiv = $("<div>");
            //give them an image
            const gifImage = $("<img>");
            //give the image a class to access from a click event, an original src, a src for both when they are animated and still,
            //and a state to contain their current state
            gifImage.attr('src', results[i].images.original_still.url); 
            gifImage.attr('data-still', results[i].images.original_still.url);  
            gifImage.attr('data-animate', results[i].images.original.url);
            gifImage.attr('data-state', 'still')
            gifImage.addClass('gif')
            //get the rating for the div also
            const p = $("<p>").text("Rating: " + results[i].rating);
            //append the image and rating to the div
            gifDiv.append(p);
            gifDiv.append(gifImage);
            //add the div to the html
            $('#gifs-view').prepend(gifDiv);
        }
    });
};

//this function takes the current state of the gif and changes it either to either still or animated based on what it currently is set to
function animate() {
    const state = $(this).attr('data-state');
    if( state === 'still') {
        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');
    }else {
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
    }
}

//================================== Main Process ============================================================

//initial buttons to be displayed
renderButton();

// the click event for  getting new buttons
$(document).on('click', '.gif-button', getGifName);

//click event for making the gif still or animated
$(document).on('click', '.gif', animate);
