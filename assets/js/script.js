const API_KEY = "V2WaERdFS31XPNdoE8ELCtYOJQo";
const API_URL = "https://ci-jshint.herokuapp.com/api";  //we’re going to make  a couple of calls to the API, and we don’t want to have to retype the URL each time.
/*
Now Bootstrap 5, which we’ve used to format this project, allows us to trigger modals
using JavaScript, and they conveniently supply the methods for this.
Since our script.js file is loading  after Bootstrap’s JavaScript file,  
we can make use of Bootstrap’s functions.
So, we'll create a reference to our modal. 
We'll make it another constant,  we'll call it resultsModal.
That's going to be a new Bootstrap modal and its going to be the modal with the ID of resultsModal.
*/
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

document.getElementById("submit").addEventListener("click", e => postForm(e)); //wires up our run checks button

/*
Firstly, it needs to make a  GET request to the API_URL 
with the API_KEY.
And secondly, it needs to pass this data to a function that will display it.

When we’re handling promises, we have two ways of doing it.
We can chain “.then”s as we did before, 
or we can wrap the promises in  an async function - like this -
and then await the promise coming true.
And that’s exactly what we’re going to do here.

So we'll make a constant called queryString. The first variable is going to be our API_URL.
And then, question mark 'API_KEY = ' and then the next variable is going to be our API_KEY.
Now that we’ve done that, let’s “await” our response.
So again, we want another constant, 'response = await fetch(queryString);'.
When the response comes back, we'll need to convert it to json.
Remember that the json() method also returns 
a promise, so we need to await that too.
So, 'const data = await response.json'.
So, at this stage in our function, we can assume that we'll have some data back.
It will either be our key expiry data, or it will be an error.
*/

/*
Fortunately, JavaScript provides a very helpful  
interface to help us do that and appropriately  enough it's called the FormData interface.  
What does this do for us? Well, it can capture all of the fields  
in a HTML form and return it as an object. Now this is very cool because we can then  
give this object to "fetch", and we  don't need to do any other processing.  
*/
async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    /*
    Then the formData object has several default  methods that allow us to manipulate the data. 
    One of these, is the entries method. Which  we can iterate through to see the form entries.
    And when we  click on the Run Checks button, we should see  
    the data logged in the console like this. Which is great! So now we know that that part of our form is working.
    All we need to do instead of logging  it to the console is send this data to the API.
    Now as below, I need to 'await fetch' because it  returns a promise. So I need to add in await.
    And you can see  that the second argument here then, is the method  
    and the headers. So how do we send the form  data to the API? Well thanks to the helpful  
    formData object, all we need to do is add it  into the request just after the headers, like so.  
    Using 'body: form'. So this will make a POST  request to the API, authorize it with the API key,  
    and attach the form as the body of the request.
    What do we need to do next? 
    You probably realize that we need to do exactly  the same as in our GET status function.
    We need to turn the response into json and then call the  appropriate function or throw an error if the  
    response doesn't return okay.     
    */
    
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
                    "Authorization": API_KEY,
                 },
                 body: form,
        });

    const data = await response.json(); //Now we need to convert the  response to json and display it. 

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }

}

/*
We've got a result from our  API, so now all we need to do is format it again.  
Let's create a display errors function back  in our code to format the response just like  
we did before. So I'm just going to create the  function here first. So it's going to be 'function displayErrors'
and that's going to  take in data as a parameter again,  
just as it did before. Don't forget as I nearly  did that we need to change our console.log  
to call our new function displayErrors.
Now this function is a little bit more complex  
this time because we need to  iterate through the error list  
but it's still quite straightforward.
*/

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if(data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class ="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if(response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

/*
So now we just need to create our display  status function and this will take in the parameter of data.
Okay, so our display  status function needs to set the heading text
to API key status, it needs to set the body  text to, "your key is valid until" and the date,  
and it needs to show the modal.

As you can see, I set the  heading text to API key status  
I set the results variable to the content that  I want in the body using template literals.  
Then using document.getElementById and the  IDs I gave you earlier I set the content.  
And finally, the results modal is shown.
*/
function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

/*
For the POST (sending data) request, The overall structure of the code that we’re going to  write is just a slightly more complex version of  
the code we’ve already written. Essentially, it consists of the same two functions. 
Firstly, a function to make the request. And secondly, a function to display the data.
*/