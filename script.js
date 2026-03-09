/* This will help calculate Sephiroth's boundbox */

var sephx = document.getElementById('sephiroth').offsetLeft;
var sephy = document.getElementById('sephiroth').offsetTop;
var sephw = parseInt(document.getElementById('sephiroth').clientWidth);
var sephh = parseInt(document.getElementById('sephiroth').clientHeight);
var sephx1 = sephx + sephw;
var sephy1 = sephy + sephh;

var pizzaCount = 0;

dragElement(document.getElementById('sephiroth'));
dragElement(document.getElementById('pizza'));

/* putting an element into the dragElement function makes the function DRAGGABLE 
the later function pointerDrag actually DRAGS the element. */

const grabAudio = new Audio('assets/squeak.ogg');
const releaseAudio = new Audio('assets/squee.mp3');
const grabPizza = new Audio('assets/plop.mp3');
const releasePizza = new Audio('assets/splat.mp3');
const eatAudio = new Audio('assets/eat.mp3');
const music = new Audio('assets/music.mp3');
const pizzaCountText = document.getElementById('pizza_counter');
const pizzaButton = document.getElementById('pizza_button');

music.volume = 0.5;
music.loop = true;

function dragElement(pizzaElement){
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    /* pos 3 and pos 4 are the MOUSE POSITIONS!!!! */

    /* This will be the positions of where the date
    elements will be and the mouse cursor will be
    and stuff */

    pizzaElement.onpointerdown = pointerDrag;   /* drag stuff when we click and hold */
    pizzaElement.onpointerup = pointerRelease;  /* play a sound once we drop the element */

    function pointerDrag(e){
        if(pizzaElement.id === 'sephiroth'){
            grabAudio.play();
        }else{
            grabPizza.play();
        }
        
        e.preventDefault(); /* dont do that default image thing that happens when you drag an image */
        pos3 = e.clientX;   /* where is the mouse right now when we CLICK THE IMAGE? this is the mouse's current x */
        pos4 = e.clientY;   /* mouse's current y*/

        document.onpointermove = elementDrag; /* elementDrag updates the x and y as the element moves. */
        document.onpointerup = stopElementDrag; /* stops dragging once you release the mouse */
    }

    function pointerRelease(){

        if(pizzaElement.id === 'sephiroth'){
            sephx = parseInt(pizzaElement.style.left);
            sephy = parseInt(pizzaElement.style.top);
            sephx1 = sephx + sephw;
            sephy1 = sephy + sephh;
            console.log(sephx + ', ' + sephy + ', ' + sephx1 + ', ' + sephy1);
            releaseAudio.play();
        }else{
            feedPizzaCheck();
        }
    }

    function feedPizzaCheck(){
        let pizzax = parseInt(pizzaElement.offsetLeft);
        let pizzay = parseInt(pizzaElement.offsetTop);
        let pizzaw = pizzaElement.clientWidth
        let pizzah = pizzaElement.clientHeight;
        
        let pizzax1 = pizzax + pizzaw;
        let pizzay1 = pizzay + pizzah;

        if(pizzax >= sephx && pizzax1 <= sephx1 && pizzay >= sephy && pizzay1 <= sephy1){
            console.log("overlap");
            eatAudio.play();
            pizzaElement.remove();
            pizzaCountText.innerHTML = "Pizzas Eaten: " + ++pizzaCount;
            
        }else{
            console.log("no overlap");
            console.log(sephx + ', ' + sephy + ', ' + sephx1 + ', ' + sephy1);
            console.log(pizzax + ', ' + pizzay + ', ' + pizzax1 + ', ' + pizzay1);

            releasePizza.play();
        }
    }

    function elementDrag(e){
        pos1 = pos3 - e.clientX; /* e.clientX is the position AFTER WE HAVE DRAGGED IT
                                    so pos1 is the difference of the position on click
                                    vs position now */
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        pizzaElement.style.top = pizzaElement.offsetTop - pos2 + 'px'; /* adjusts position by the difference vertically
                                                                        the offset is reverse i guess. + instead of -
                                                                        makes the image move in reverse... */
        pizzaElement.style.left = pizzaElement.offsetLeft - pos1 + 'px'; /* same but horizontally */
    }

    function stopElementDrag(){
        document.onpointerup = null;    /* takes away the event listener so we stop dragging */
        document.onpointermove = null;
    }
}

beginMusic(document.getElementById('sound_button'));

function beginMusic(buttonElement){
    buttonElement.onclick = buttonClick;
    buttonElement.onpointerdown = buttonDown;
    function buttonDown(e){
        e.preventDefault();
    }

    /* on browsers, the music is always paused by default. the user must click the music
    icon to make it start playing. change the icon so the user knows when the music is on vs off */

    function buttonClick(e){
        if(music.paused){
            music.play();
            buttonElement.src = 'assets/soundicon.svg';
        }
        else{
            music.pause();
            buttonElement.src = 'assets/muteicon.svg';
        }
    }
}

function createPizza(e){

    let mousex = e.clientX;
    let mousey = e.clientY;

    /* ----------------- initialization ----------------- */

    e.preventDefault();
    const pizza = document.createElement('img');
    pizza.src = 'images/pizza.webp';
    pizza.style.position = 'absolute';
    pizza.style.width = "5%";
    pizza.style.height = "auto";
    const main = document.getElementById("play_area");
    main.appendChild(pizza);

    /* Spawn the pizza right under the mouse */

    pizza.style.left = (mousex - 50)+ "px";
    pizza.style.top = (mousey) + "px";

    dragElement(pizza);

    /* We use a dispatchEvent here because the click event needs to be taken from the 
    pizza spawner to the individual pizza slice, so that we do not have to rewrite
    code for the pizza slice. */

    pizza.dispatchEvent(new PointerEvent("pointerdown", {

        /* Pretend we clicked the pizza */
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true
    }));

}

pizzaButton.addEventListener('mousedown', createPizza);