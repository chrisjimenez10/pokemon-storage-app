//Similar to how we can make use of the middleware funciton to read files in our public directory (static) like external css stylesheets, we can also have javascirpt files - We can add additional functions to an "ejs" file by simply linking the file with the <script> tag and including the "defer" attribute
    //Learned to place the javascript file INSIDE the public directory from chatGPT

const video = document.querySelector("#video");
// video.addEventListener("click", ()=>{
//     console.log("clicked")
// })
function decreaseSpeed() {
    video.playbackRate -= 0.5;
}
decreaseSpeed();



