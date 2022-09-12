class Player{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        const friction = 0.99;
    }

    draw(){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        c.fill();
        c.closePath();
    }
    
    update(){
        this.draw();

        this.velocity.x *= friction;
        this.velocity.y *= friction;

        if(player.x + player.radius + player.velocity.x <= canvas.width &&
           player.x - player.radius + player.velocity.x >= 0){
            player.x += player.velocity.x;
        }else{
            player.velocity.x = 0;
        }

        if(player.y + player.radius + player.velocity.y <= canvas.height &&
            player.y - player.radius + player.velocity.y >= 0){
            player.y += player.velocity.y;
         }else{
             player.velocity.y = 0;
         }

    }
}

class Projectile{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.type = "Linear";
        this.radiant = 0;
        this.center = {
            x,
            y
        }

        if(Math.random() < 0.5){
            this.type = "Homing";
            if(Math.random() * 0.5){
                this.type = "Spinning";
            }
        }

    }

    draw(){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();

    if(this.type === "Spinning"){
        this.radiant += 0.1;

        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;

        this.x = this.center.x + Math.cos(this.radiant) * 30;
        this.y = this.center.y + Math.sin(this.radiant) * 30;
    }else if(this.type = "Homing"){
        const angle = Math.atan2(player.y - this.y,player.x - this.x);
        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }else{
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
        


    }
}

class Particles{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.color = color;
        this.alpha = 1;
    }

    draw(){
        c.save();
        c.fillStyle = this.color;
        c.beginPath();
        c.globalAlpha = this.alpha;
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        c.fill();
        c.closePath();
        c.restore();
    }

    update(){
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.alpha -= 0.01;
    }
}

class Power{
    constructor(x,y,radius,velocity){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.image = new Image();
        this.image.src = "Asset/lightning.png";
        this.alpha = 1;

        gsap.to(this,{
            alpha:0,
            duration:0.2,
            repeat:-1,
            yoyo:true,
            ease:"linear"
        })
    }

    draw(){

        c.fillStyle = "transparent";
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        c.fill();
        c.closePath();


        c.save();
        c.globalAlpha = this.alpha;
        c.drawImage(this.image,this.x - 25,this.y - 25,50,50);
        c.restore();

    }

    update(){
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class BackgroundParticle{
    constructor({position,color="blue",radius=5}){
        this.position = position;
        this.color = color;
        this.radius = radius;
        this.alpha = 0.1;
    }

    draw(){
        c.save();
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2);
        c.fill();
        c.closePath();
        c.restore();
    }
}