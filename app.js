const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const scoreContainer = document.querySelector(".score");
const container = document.querySelector(".container");
const startBtn = document.querySelector(".container button");
const resultScore = document.querySelector(".container strong");



const CANVAS_WIDTH = canvas.width = innerWidth;
const CANVAS_HEIGHT = canvas.height = innerHeight;
let gameStart = false;

startBtn.addEventListener("click",() => {
    auido.power.play();
    gsap.to("#container",
        {
            opacity:0,
            scale:0,
            duration:0.5
        }
    );
    setTimeout(() => {
        container.style.display = "none";
    },1000);
    init();
});

gsap.fromTo(container,
    {
        opacity: 0,
        scale:0
    },
    {
        opacity: 0.8,
        duration: 1,
        scale:1,
        ease: "bounce"
    }
)

window.addEventListener("load",() => {
    if(!auido.hyper.playing()){
        auido.hyper.play();
    }
})

window.addEventListener("visibilitychange",() => {
    if(document.visibilityState === 'hidden'){
        if(auido.hyper.playing()){
            auido.hyper.pause();
        }
    }else{
        auido.hyper.play();
    }
})

let projectiles = [];
let enemies = [];
let particles = [];
let powerUp = [];
let backgroundParticles = [];


let spacing = 30;
let animationId;
let interval;

let score = 0;
const friction = 0.99;

function init(){
    gameStart = true;
    enemies = [];
    particles = [];
    projectiles = [];
    powerUp = [];
    backgroundParticles = [];
    score = 0;

    player.x = CANVAS_WIDTH / 2;
    player.y = CANVAS_HEIGHT / 2;

    for(let x = 0; x < CANVAS_WIDTH; x+=spacing){
        for(let y = 5; y < CANVAS_HEIGHT; y+=spacing){
            backgroundParticles.push(
                new BackgroundParticle({
                    position:{
                        x,
                        y,
                    },
                    radius:3
                })
            )
        }
    }

    interval = setInterval(createEnemy,500);
    animationId = requestAnimationFrame(animate);
}

function gameOver(){
    auido.death.play();
    cancelAnimationFrame(animationId);
    clearInterval(interval);
    speedProjectile = false;
    gameStart = false;
    resultScore.innerHTML = score;
    setTimeout(() => {
        container.style.display = "flex";
        gsap.fromTo(container,
            {
                opacity: 0,
                scale:0
            },
            {
                opacity: 0.8,
                duration: 1,
                scale:1,
                ease: "elastic"
            }
        )
    },2000);
}

function createEnemy(){
        const radius = Math.random() * 25 + (10);

        let x;
        let y;

        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : CANVAS_WIDTH + radius;
            y = Math.random() * CANVAS_HEIGHT + radius;
        }else{
            x = Math.random() * CANVAS_WIDTH + radius;
            y = Math.random() < 0.5 ? 0 - radius : CANVAS_HEIGHT + radius;
        }

        const color = `hsl(${Math.random() * 360},100%,25%)`;

        const angle = Math.atan2(
            CANVAS_HEIGHT / 2 - y,
            CANVAS_WIDTH / 2 - x 
        );

        const velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        }
            enemies.push(new Enemy(
            x,
            y,
            radius,
            color,
             velocity
        ))
}


const x = CANVAS_WIDTH / 2;
const y = CANVAS_HEIGHT / 2;

let speedProjectile = false;
let frame = 0;

const player = new Player(x,y,15,"white",{x:0,y:0});
function animate(){
    c.fillStyle = "rgba(0,0,0,0.2)";
    c.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    if(!gameStart) return;
    animationId = requestAnimationFrame(animate);

    backgroundParticles.forEach((bgParticle) => {

        const distance = Math.hypot(
            bgParticle.position.y - player.y,
            bgParticle.position.x - player.x
        );

        if(distance < 100){
            bgParticle.alpha = 0;
            if(distance > 70){
                bgParticle.alpha = 0.5;
            }
        }else{
            bgParticle.alpha = 0.1;
        }

        bgParticle.draw();
    })

    player.update();

    if(frame % 800 == 0){
        powerUp.push(
            new Power(
                -50,
                Math.random() * CANVAS_HEIGHT,
                20,
                {x:2,y:0}
            )
        );
    }
        
    frame++;
    powerUp.forEach((power,index) => {

        gsap.to(power,{
            opacity:-0.01
        })

        if(power.x > CANVAS_WIDTH){
            console.log("TEST");
            powerUp.splice(index,1);
           }

        const distance = Math.hypot(power.x - player.x,power.y - player.y);

        if(distance - power.radius - player.radius < 1){
             speedProjectile = true;
             auido.power.play();
             powerUp.splice(index,1);
             setTimeout(() => {
                speedProjectile = false;
                auido.power.play();
             },10000);
        }else{
            power.update();
        }
    })


    projectiles.forEach((projectile,index) => {
        if(projectile.x > CANVAS_WIDTH + projectile.radius ||
           projectile.x < 0 - projectile.radius || 
           projectile.y > CANVAS_HEIGHT + projectile.radius ||
           projectile.y < 0 - projectile.radius){
            projectiles.splice(index,1);
           }else{
            projectile.update();
           }

           enemies.forEach((enemy,enemyIndex) => {
            const distance = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y
            );

            if(distance - projectile.radius - enemy.radius < 1){
                if(enemy.radius < 20){
                    enemies.splice(enemyIndex,1);
                    auido.damage.play();
                    backgroundParticles.forEach(bgParticle => {
                        bgParticle.color = enemy.color;
                    });

                    const labelScore = document.createElement("label");
                    labelScore.innerHTML = Math.floor(enemy.radius);
                    labelScore.classList.add("labelScore");
                    labelScore.style.left = enemy.x + "px";
                    labelScore.style.top = enemy.y + "px";
                    labelScore.style.fontSize = enemy.radius + 5 + "px";
                    document.body.appendChild(labelScore);

                    gsap.to(labelScore,{
                        opacity:0,
                        y:-30,
                        duration:1,
                        onComplete:() => {
                            labelScore.parentNode.removeChild(labelScore);
                        }
                    })
                    score++;
                }else{
                    gsap.to(enemy,{
                        radius: enemy.radius - 10
                    })
                }

                projectiles.splice(index,1);
                for(let i=0; i<enemy.radius * 2 - 5; i++){
                    particles.push(new Particles(
                        enemy.x,
                        enemy.y,
                        Math.random() * 2,
                        enemy.color,
                        {
                            x:(Math.random() - 0.5) * (Math.random() * 8),
                            y:(Math.random() - 0.5) * (Math.random() * 8)
                        }
                    ));
                }
            }
           })

         
           scoreContainer.innerHTML = score;
    });

    enemies.forEach(enemy => {

        const distance = Math.hypot(
            player.x - enemy.x,
            player.y - enemy.y 
        );

        if(distance - player.radius - enemy.radius < 1){
            gameOver();
        }

        enemy.update();
    });

    particles.forEach((particle,index) => {

        if(particle.alpha <= 0.1){
            particles.splice(index,1);
        }
        particle.update();
    });
}



document.addEventListener("click",(e) => {

    if(gameStart){
        auido.jump.play();
    }

    const angle = Math.atan2(
        e.clientY - player.y,
        e.clientX - player.x
    );


    const velocity = {
        x:Math.cos(angle) * 8,
        y:Math.sin(angle) * 8
    }


    projectiles.push(new Projectile(player.x,player.y,5,"white",velocity));
});

let moveFrame = 0;

window.addEventListener("mousemove",(e) =>  {

    if(!speedProjectile) return;
    moveFrame++;
    const angle = Math.atan2(e.clientY - player.y,e.clientX - player.x);
    if(moveFrame % 6 === 0){
        auido.select.play();
    }

    const velocity = {
        x:Math.cos(angle) * 7,
        y:Math.sin(angle) * 7
    }

    projectiles.push(
        new Projectile(
            player.x,
            player.y,
            5,
            "yellow",
            velocity
        )
    )
})

window.addEventListener("keydown",(e) => {
    switch(e.key){
        case "a":
            return (
                player.velocity.x = -6,
                player.velocity.y = 0
            )             

        case "d":
            return (
                player.velocity.x = 6,
                player.velocity.y = 0
            )

       case "w":
        return (
            player.velocity.x = 0,
            player.velocity.y = -6
        )

       case "s":
        return (
            player.velocity.x = 0,
            player.velocity.y = 6
        )
    }
});

window.addEventListener("keyup",(e) => {
    switch(e.key){
        case "a":
            return (
                player.velocity.x = 0
            )             

        case "d":
            return (
                player.velocity.x = 0
            )

       case "w":
        return (
            player.velocity.y = 0
        )

       case "s":
        return (
            player.velocity.y = 0
        )
    }
});

canvas.addEventListener("touchmove",(e) => {
    const touchClientX = e.touches[0].clientX;
    const touchClientY = e.touches[0].clientY;

    if(moveFrame % 20 === 0){
        auido.jump.play();
    }

    const angle = Math.atan2(
        touchClientY - player.y,
        touchClientX - player.x
    );

    console.log(angle);

    const velocity = {
        x:Math.cos(angle) * 7,
        y:Math.sin(angle) * 7
    }

    projectiles.push(new Projectile(player.x,player.y,5,"white",velocity));

})

createEnemy();
animate();