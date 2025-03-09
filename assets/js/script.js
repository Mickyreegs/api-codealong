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