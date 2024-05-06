// //Similar to how we can make use of the middleware funciton to read files in our public directory (static) like external css stylesheets, we can also have javascirpt files - We can add additional functions to an "ejs" file by simply linking the file with the <script> tag and including the "defer" attribute
//     //Learned to place the javascript file INSIDE the public directory from chatGPT

// const video = document.querySelector("#video");
// // video.addEventListener("click", ()=>{
// //     console.log("clicked")
// // })
// function decreaseSpeed() {
//     video.playbackRate -= 0.5;
// }
// decreaseSpeed();


//Real-Time Input Validation
const usernameElement = document.querySelector("#username");
const passwordElement = document.querySelector("#password");
const confirmPasswordElement = document.querySelector("#confirmPassword");

function validateInput(event) {
    // console.log(event);
    const key = event.key; //Stores the key value being pressed
    // The pattern we need to use in the regex if we want to accept ONLY the characters we defined in the character class [ ] - then we need to use the "+" quantifier and not the "*" because this way it matches one ore more occurrences (when it was zero or more, it would accept matches OUTSIDE of the defined pattern)
    const alphanumericRegex = /^[0-9a-zA-Z]+$/; //Define the regex pattern (only numbers 0-9, a-z, A-Z --> exlcuding special characters)
    if(!alphanumericRegex.test(key)){ //Using the test() method of the regex object to match the pressed key to any of the characters defined in the regex pattern (returns true or false)
        event.preventDefault(); //Using the preventDefault method on the event object we prevent from the key value to be inserted in the input field
        return false; //Kepress event should be stopped if the pressed key does not match a character in the regex pattern
    }
}

usernameElement.addEventListener("keypress", validateInput);
passwordElement.addEventListener("keypress", validateInput);
confirmPasswordElement.addEventListener("keypress", validateInput);




