window.onload = function() {
    console.log("welcome to the about page!")

    document.getElementById("downloadResumes").onclick = () => {
        window.location = "https://bobbysinclusto.github.io/hacky-heap/Arshia-and-Allen-Resume.pdf"
    }
    
    document.getElementById("playGame").onclick = () => {
        window.location = "https://bobbysinclusto.github.io/hacky-heap/game.html"
    }


    //load the interactive background!
    VANTA.NET({
        el: "#interactive",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0xd0d14
      })
    document.getElementById("overlay-thingy").remove();
}