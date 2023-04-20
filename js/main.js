// the game itself
var game;

var gameOptions = null;
var targetWhelImage = "";
let oppgaveID = ""

if(window.location.search.includes("bevegelse")){

    targetWhelImage = "Images/bevegelse.png";
   
    let data =  await(await fetch("../data/bevegelse.json")).json();
    gameOptions = {
        slices : data.length,
        slicePrizes : data,
        rotationTime: 3000
    }
       
} else if(window.location.search.includes("norsk")){
    targetWhelImage = "Images/norsk.png"
    let data = await (await fetch("../data/norsk.json")).json();
    gameOptions = {
        slices : data.length,
        slicePrizes : data,
        rotationTime: 3000
    }
} else if(window.location.search.includes("diverse")){
    targetWhelImage = "../Images/diverse.png"
    let data = await (await fetch("../data/diverse.json")).json();
    gameOptions = {
        slices : data.length,
        slicePrizes : data,
        rotationTime: 3000
    }
} 

// once the window loads...
window.onload = function(){

    // game configuration object
var gameConfig = {

    // render type
    type: Phaser.CANVAS,

    // game width, in pixels
    width: 1280,

    // game height, in pixels
    height: 720,

    // game background color
    backgroundColor: 0x880044,

    // scenes used by the game
    scene: [playGame]
};

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame and scale the game
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);

}
// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload() { // loading assets

        this.load.image("wheel", targetWhelImage);
        this.load.image("pin",  "Images/pin.png");
        this.load.image("froskbanner", "Images/froskbanner.png");

    }

    // method to be executed once the scene has been created
    create() {

        // adding the wheel in the middle of the canvas
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");

        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        //adding the textbox
        this.textBox = this.add.sprite(game.config.width / 2, game.config.height / 2, "froskbanner");
        this.textBox.visible = false;


    
        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height / 2, "", {
            font: "bold 45px Rajdhani",
            align: "center",
            color: "black"
        });


        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
    }

    // function to spin the wheel
    spinWheel() {

        // can we spin the wheel?
        if (this.canSpin) {
        
            // Sjule textbox

            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(4, 6);

            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 360);

            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            var prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel to tween targets
                targets: [this.wheel],

                // angle destination
                angle: 360 * rounds + degrees,

                // tween duration
                duration: gameOptions.rotationTime,

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function (tween) {
                    this.textBox.visible = true;

                    
                    //Sjekker om spørsmålet inneholder et komma, og legger til linjeskift.
                    let seperatedText = gameOptions.slicePrizes[prize].text;

                    if(seperatedText.includes(",")){
                        seperatedText = seperatedText.split(",");

                        seperatedText[0] = seperatedText[0] + "," + "\n";
                        seperatedText = seperatedText.join("");
                    }
                    
                    // displaying prize text
                    this.prizeText.setText(seperatedText);


                    // player can spin again
                    this.canSpin = true;
                    oppgaveID = gameOptions.slicePrizes[prize].id;
                }
            });
        }
    }
}



// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
