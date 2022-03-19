  /*
      ### The Game Project – Finale
      Report, by Frank Benjamin Arias Padilla
          
      Through the process of the game project I have been learning many functions, shapes, libraries, etc. 
      I have adapted to many changes, rewrote entire lines of codes just so it would be clearer. 
      I think that after the game project I am able to understand code easily. 
      I am not afraid to use something I might not understand fully, but if I try it out I know I can make it work. 
      Within this project, I was very excited to draw the purple alien-ghost. 
      I was very detailed and it really made me understand positioning and the many alternatives you have within p5.js. 
      Creating the enemies was probably the most fun, since the function of “this” is so useful. 
      As well, creating the whole background, calling functions to iterate, to create “new” enemies in empty arrays. 
      The automation of the whole game, I really enjoyed this experience, as well as the sleuth game. 
      By implementing I learnt the library of p5.js, since I didn’t know of its existence. 
      I also enjoy using the library with web design, in general, now. 
      Parts I found difficult, probably the mechanic movement and logic of the character. 
      Since I implemented a  gravity function, I had to use a lot of understanding.
      I wanted to make the movement as fluid as possible.

      For the aesthetics, I thought of this after-climate change, with muted colors, but with a touch of science fiction, the background is very muted, but the characters are purple and green.


      */

  var gameChar_x;
  var gameChar_y;
  var floorPos_y;
  var scrollPos;
  var gameChar_world_x;
  var enemyCollision;


  var isLeft;
  var isRight;
  var isFalling;
  var isPlummeting;

  //P6
  var game_score;
  var flagpole;
  var lives;
  var bottomCanvas;
  //gravity
  var direction = 1.5;
  var velocity = 2;
  var jumpPower = 15;
  var fallingSpeed = 3;
  var maxHeight;
  var jumpCounter = 0;
  var aliensize = 80;

  //enemies
  var enemies = [];
  //sounds
  var jumpSound;
  var enemySound;
  var winSound;
  var deadSound;
  var bonusSound;
  var music;

  //music
  function preload() {
      soundFormats('mp3', 'ogg');
      jumpSound = loadSound('https://raw.githubusercontent.com/devbenx/Academic_Game_Project/main/sounds/jump.mp3');
      enemySound = loadSound('https://raw.githubusercontent.com/devbenx/Academic_Game_Project/main/sounds/click.mp3');
      winSound = loadSound('https://raw.githubusercontent.com/devbenx/Academic_Game_Project/main/sounds/win.mp3');
      deadSound = loadSound('https://raw.githubusercontent.com/devbenx/Academic_Game_Project/main/sounds/dead.mp3');
      bonusSound = loadSound('https://raw.githubusercontent.com/devbenx/Academic_Game_Project/main/sounds/bonus.mp3');
  }

  function setup() {
      createCanvas(1024, 576);
      music = loadSound('https://raw.githubusercontent.com/devbenx/Academic_Game_Project/main/sounds/level.mp3', loaded);

      floorPos_y = height * 3 / 4;
      lives = 3;
      //final part of game
      platform = [{ x_pos: 550, y_pos: 350, large: 180, size: 20, isReached: false },
          { x_pos: 950, y_pos: 350, large: 180, size: 20, isReached: false },
          { x_pos: 1950, y_pos: 350, large: 180, size: 20, isReached: false },
          { x_pos: 2950, y_pos: 350, large: 180, size: 20, isReached: false },
          { x_pos: 3350, y_pos: 250, large: 180, size: 20, isReached: false }

      ];
      //enemy 
      for (var e = 0; e < platform.length; e++) {
          enemies[e] = new Enemy(platform[e]);
      }
      startGame();
  }

  function loaded() {
      music.play();
      music.setVolume(0.1);
  }

  function draw() {

      //gameCharacter shared variables
      alien.x = gameChar_x;
      alien.y = gameChar_y;
      //sky and brown dessert
      background(173, 217, 207); //sky blue
      //brown ground
      noStroke();
      fill(196, 151, 116); //changed the color
      rect(0, height * 3 / 4, width, height - height * 3 / 4); //draw some ground
      //starts scrolling horizontal
      push();
      translate(scrollPos, 0);
      // Draw items.
      drawClouds();
      // Draw mountains.
      drawMountains();
      // Draw trees.
      drawTrees();
      // Draw canyons.
      for (var s = 0; s < canyons.length; s++) {
          drawCanyon(canyons[s]);
          checkCanyon();
      }


      // Draw collectable items.
      for (var z = 0; z < collectables.length; z++) {
          if (!collectables[z].isFound) {
              drawCollectable(collectables[z]);
              checkCollectable(collectables[z]);
          }
      }


      renderFlagpole();
      //final part game
      drawPlatforms();
      for (var i_p = 0; i_p < platform.length; i_p++) {
          var platform_checked = checkPlatform();
          if (platform_checked != null) {
              floorPos_y = platform_checked.y_pos;
              gameChar_y = gameChar_y;
              jumpCounter = 0;
          } else {
              floorPos_y = height * 3 / 4;
          }
      }
      //enemy 
      for (var e = 0; e < enemies.length; e++) {
          enemies[e].display();
          enemies[e].move();
          enemies[e].check();
          var del = enemies[e].remove();
          if (del) {
              enemySound.play();
              enemySound.setVolume(0.3);
              enemies.splice(e, 1);
          }
      }

      //scrolling elements ends
      pop();
      // Draw game character.
      drawGameChar(gameChar_x, gameChar_y, aliensize)
      drawLifeTokens();

      fill(0);
      strokeWeight(2);
      stroke(107, 91, 217);
      textSize(18);
      text("SCORE: " + game_score, 40, 40);
      fill(100);
      noStroke();
      textSize(15);
      text("Instructions:", 40, 70);
      text("Spacebar to jump", 40, 100);
      text("Arrows to move", 40, 130);



      if (lives < 1) {
          background(0);
          fill(255);
          strokeWeight(1.5);
          stroke(255);
          textSize(60);
          text("GAME OVER", width / 2 - 220, height / 2);
          textSize(30);
          text("Refresh the page to play again.", width / 2 - 220, height / 2 + 40);
          music.stop();
          deadSound.playSound();
          deadSound.setVolume(0.5);
          return;
      }
      if (flagpole.isReached == true) {
          fill(20, 20, 20, 100);
          rect(0, height / 4, width, height / 2);
          textSize(80);
          fill(255, 239, 133);
          text("YOU WIN!", width / 2 - 230, height / 2);
          fill(255);
          textSize(40);
          text("Your score is: " + game_score, width / 2 - 220, height / 2 + 50);
          textSize(30);
          text("Refresh the page to play again.", width / 2 - 220, height / 2 + 90);
          winSound.playSound();
          winSound.setVolume(0.5);

      }


      // Logic to make the game character move or the background scroll.
      //Put conditional statements to move the game character below here
      if (isLeft == true) {

          if (gameChar_x > width * 0.4) {
              gameChar_x -= 2.8;
          } else {
              scrollPos += 5
          }
      }
      if (isRight == true) {
          if (gameChar_x < width * 0.6) {
              gameChar_x += 2.8;
          } else {
              scrollPos -= 5
          }
      }

      if (flagpole.isReached == false) {
          checkFlagpole();
      }
      // Logic to make the game character rise and fall.
      //call functions for gravity
      gravity();
      // Update real position of gameChar for collision detection.
      gameChar_world_x = gameChar_x - scrollPos;

      checkPlayerDie();
  }


  // ---------------------
  // Key control functions
  // ---------------------

  function keyPressed() {
      // if statements to control the animation of the character when
      // keys are pressed.
      if (keyCode == 37) {
          //console.log("left arrow");
          isLeft = true;
      } else if (keyCode == 39) {
          //console.log("right arrow");
          isRight = true;
      } else if (keyCode == 32) {
          //console.log("space bar");
          isPlummeting = true;
          jumpSound.play();
          jumpSound.setVolume(0.2);

      }

  }

  function keyReleased() {
      // if statements to control the animation of the character when
      // keys are released.
      if (keyCode == 37) {
          //console.log("left arrow");
          isLeft = false;
      } else if (keyCode == 39) {
          //console.log("right arrow");
          isRight = false;
      } else if (keyCode == 32) {
          //console.log("space bar");
          isPlummeting = false;
      }
  }

  function gravity() {

      //function gravity controls how the game character moves, depending on each situation
      if (gameChar_y >= floorPos_y && (isPlummeting == false) && !isInCanyon) {
          gameChar_y = gameChar_y;
          jumpCounter = 0;
      } else {
          gameChar_y = gameChar_y + (direction * velocity);
      }
      //falling
      if (abs(gameChar_y - floorPos_y) < 10 && !isInCanyon) {
          velocity = fallingSpeed;
      }
      //isPlummeting = false;
      if (gameChar_y == floorPos_y && !isInCanyon) {
          isPlummeting = false;
      }
      //
      if (isPlummeting == true && !isInCanyon) {
          if (gameChar_y <= maxHeight || jumpCounter >= jumpPower) {
              velocity = fallingSpeed;
              jumpCounter = 0;

          }
          //if the gameCharacter is in the canyon
          else if (isInCanyon && (gameChar_y <= floorPos_y || abs(gameChar_y - floorPos_y) < 2)) {
              background(20);
              velocity = fallingSpeed;
              gameChar_y *= gameChar_y + (direction * velocity);
          }
          //or not in the canyon
          else {
              velocity = -jumpPower;
              jumpCounter = jumpCounter + 1;
          }
      } else {
          velocity = fallingSpeed;
      }
  }
  // ------------------------------
  // Game character render function
  // ------------------------------

  // Function to draw the game character.

  function drawGameChar(x, y, radius) {
      y = y - (radius * 0.8889) //to set origin but in middle 
      if (isFalling || isPlummeting) {
          y = y - (radius * 0.15)

          //body
          let rightleg = {
              x: x - radius / 2 + (radius * 0.25),
              y: y + (radius * 0.5556),
          };
          let middleleg = {
              x: x + (radius * 0.0444),
              y: y + (radius * 0.6667),
          };
          let leftleg = {
              x: x + radius / 2 - (radius * 0.2),
              y: y + (radius * 0.5556),
          };

          //shadow
          let srightleg = {
              x: x + (radius * 0.19),
              y: y + (radius * 0.5556),
          };
          let sleftleg = {
              x: x - (radius * 0.13),
              y: y + (radius * 0.5556),
          };

          //           fill(110, 110, 110, 100);
          //           ellipse(x, floorPos_y, radius - (radius * 0.2222) - (radius * 0.07), (radius * 0.1111));


          //shadowbody
          fill(39, 28, 92);

          beginShape();
          vertex(rightleg.x, rightleg.y); //(first point)
          bezierVertex(x - (radius * 1.1111), y - (radius * 0.9556) + (radius * 0.0667), x + (radius * 1.1556), y - (radius * 0.9556) + (radius * 0.0667), leftleg.x, leftleg.y); //second point and circle
          bezierVertex(x + (radius * 0.3111), y + (radius * 0.4444), x + (radius * 0.3111), y + (radius * 0.4444), srightleg.x, srightleg.y); //shadow triangle
          bezierVertex(x + (radius * 0.18), y + (radius * 0.4), x + (radius * 0.17), y + (radius * 0.4), middleleg.x, middleleg.y); //middle leg

          bezierVertex(x - (radius * 0.12), y + (radius * 0.4), x - (radius * 0.15), y + (radius * 0.4), sleftleg.x, sleftleg.y); //left triangle
          bezierVertex(x - (radius * 0.30), y + (radius * 0.4033), x - (radius * 0.30), y + (radius * 0.40), rightleg.x, rightleg.y); //connecting point to beginning
          endShape();

          //alien body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          //body
          beginShape();
          vertex(rightleg.x, rightleg.y);
          bezierVertex(x - (radius * 1.1111), y - (radius * 0.9556) + (radius * 0.0667), x + (radius * 1.1556), y - (radius * 0.9556) + (radius * 0.0667), leftleg.x, leftleg.y); //right leg
          bezierVertex(x + (radius * 0.2667), y + (radius * 0.3333), x + (radius * 0.2667), y + (radius * 0.3333), middleleg.x, middleleg.y); //middle leg
          bezierVertex(x - (radius * 0.23), y + (radius * 0.25), x - (radius * 0.20), y + (radius * 0.3333), rightleg.x, rightleg.y); //left leg
          endShape();

          y = y + (radius * 0.0667)

          //eye yellow
          noStroke();
          fill(235, 225, 52);
          ellipse(x + (radius * 0.0222), y - (radius * 0.1556), (radius * 0.7778), (radius * 0.6667) - (radius * 0.07));

          //little eye
          noStroke();
          fill(227, 186, 50);
          ellipse(x - (radius * 0.0222), y - (radius * 0.1111), (radius * 0.40), (radius * 0.3111));

          //eyelid
          stroke(40);
          strokeWeight(0.05);
          fill(91, 62, 163);
          beginShape();
          vertex(x - (radius * 0.3667), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.4444), y - (radius * 0.60) - (radius * 0.07), x + (radius * 0.4444), y - (radius * 0.6444) - (radius * 0.07), x + (radius * 0.4167), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.0444), y - (radius * 0.0278), x - (radius * 0.0444), y - (radius * 0.0333), x - (radius * 0.3667), y - (radius * 0.1111));
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 100);
          beginShape();
          vertex(x - (radius * 0.3667), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.3556), y - (radius * 0.0667), x + (radius * 0.40), y - (radius * 0.0667), x + (radius * 0.4167), y - (radius * 0.1111));
          bezierVertex(x + (radius * 0.3111), y + (radius * 0.0111), x - (radius * 0.3111), y + (radius * 0.0111), x - (radius * 0.3667), y - (radius * 0.1111));
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(x - (radius * 0.3667), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.3), y - (radius * 0.03), x + (radius * 0.37), y - (radius * 0.03), x + (radius * 0.4167), y - (radius * 0.1111));
          bezierVertex(x + (radius * 0.2), y - (radius * 0.07), x - (radius * 0.2), y - (radius * 0.07), x - (radius * 0.3667), y - (radius * 0.1111));
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 180);
          smooth();
          ellipse(x + (radius * 0.1111), y, (radius * 0.12), (radius * 0.04));

          //highlight body
          noStroke();
          push();
          translate(x + (radius * 0.2889), y - (radius * 0.49) + (radius * 0.01));
          rotate(7.7 / -3);
          fill(255, 255, 255, 175);
          ellipse(0, 0, (radius * 0.14) - (radius * 0.005), (radius * 0.04) - (radius * 0.07));
          pop();

          //highlight eyelid
          fill(103, 70, 189);
          ellipse(x + (radius * 0.10778), y - (radius * 0.20), (radius * 0.35), (radius * 0.178)) - (radius * 0.07);
      } else if (isLeft) {
          x = x - (radius * 0.07)

          //body
          let rightleg = {
              x: x + (radius * 0.33),
              y: y + (radius * 0.60),
          };
          let leftleg = {
              x: x - (radius * 0.1778),
              y: y + (radius * 0.60),
          };
          let smidleg = {
              x: x + (radius * 0.1),
              y: y + (radius * 0.58),
          };
          //shadow
          //   fill(110, 110, 110, 100);
          //   smooth();
          //   ellipse(x + (radius * 0.1), floorPos_y, radius - (radius * 0.2222), (radius * 0.1111));

          //shadowbody
          fill(39, 28, 92);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.3), y - (radius * 0.8), x + (radius * 1.1), y - (radius * 1.13), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.45), x + (radius * 0.09), y + (radius * 0.5), smidleg.x, smidleg.y); //right leg
          bezierVertex(x - (radius * 0.05), y + (radius * 0.45), x - (radius * 0.15), y + (radius * 0.4), leftleg.x, leftleg.y); //left leg
          endShape();

          //body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.3), y - (radius * 0.8), x + (radius * 1.1), y - (radius * 1.13), rightleg.x, rightleg.y); //right leg
          bezierVertex(x - (radius * 0.05), y + (radius * 0.27), x - (radius * 0.15), y + (radius * 0.3778), leftleg.x, leftleg.y); //left leg
          endShape();

          let eye_y = y - (radius * 0.1111);
          let eye_xi = x - (radius * 0.5111);
          let eye_xf = x - (radius * 0.1667);

          //eye yellow
          push();
          translate(x - (radius * 0.3333), y - (radius * 0.1556));
          rotate(0.2);
          noStroke();
          fill(235, 225, 52);
          ellipse(0, 0, (radius * 0.3333), (radius * 0.6667));
          pop();

          //little eye
          push();
          translate(x - (radius * 0.40) - (radius * 0.0389), y - (radius * 0.1111));
          rotate(0.15);
          noStroke();
          fill(227, 186, 50);
          ellipse(0, 0, (radius * 0.1333), (radius * 0.3111));
          pop();

          //eyelid
          stroke(40);
          strokeWeight(0.1);
          fill(91, 62, 163);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x - (radius * 0.4556), y - (radius * 0.6222), x - (radius * 0.0167), y - (radius * 0.6222), eye_xf - (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x - (radius * 0.40), y - (radius * 0.0444), x - (radius * 0.4444), y - (radius * 0.0444), eye_xi, eye_y);
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 120);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x - (radius * 0.5333), y - (radius * 0.0222), x - (radius * 0.3111), y - (radius * 0.0222), eye_xf - (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x - (radius * 0.4444), y - (radius * 0.0833), x - (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x - (radius * 0.5333), y - (radius * 0.0556), x - (radius * 0.3111), y - (radius * 0.0333), eye_xf - (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x - (radius * 0.4444), y - (radius * 0.0833), x - (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 200);
          smooth();
          ellipse(x - (radius * 0.40), y, (radius * 0.07), (radius * 0.035));

          //highlights
          noStroke();
          push();
          translate(x + (radius * 0.2889), y - (radius * 0.4556) + (radius * 0.09));
          rotate(0.85);
          fill(255, 255, 255, 200);
          ellipse(0, 0, (radius * 0.23), (radius * 0.089));
          pop();

          //parpado
          fill(103, 70, 189);
          ellipse(x - (radius * 0.3), y - (radius * 0.175), (radius * 0.23), (radius * 0.15));

      } else if (isLeft && isFalling) {
          x = x - (radius * 0.07)
          y = y - (radius * 0.15)


          //body
          let rightleg = {
              x: x + (radius * 0.30),
              y: y + (radius * 0.5556),
          };
          let leftleg = {
              x: x - (radius * 0.1778),
              y: y + (radius * 0.5556),
          };
          let smidleg = {
              x: x + (radius * 0.1),
              y: y + (radius * 0.5556),
          };
          //shadow
          //           fill(110, 110, 110, 100);
          //           smooth();
          //           ellipse(x + (radius * 0.1), floorPos_y, radius - (radius * 0.2222) - (radius * 0.07), (radius * 0.1111));
          //shadowbody
          fill(39, 28, 92);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.3), y - (radius * 0.8) + (radius * 0.0667), x + (radius * 1.1), y - (radius * 1.13) + (radius * 0.0667), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.45), x + (radius * 0.09), y + (radius * 0.45), smidleg.x, smidleg.y); //right leg
          bezierVertex(x - (radius * 0.05), y + (radius * 0.35), x - (radius * 0.15), y + (radius * 0.45), leftleg.x, leftleg.y); //left leg
          endShape();

          //body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.3), y - (radius * 0.8) + (radius * 0.0667), x + (radius * 1.1), y - (radius * 1.13) + (radius * 0.0667), rightleg.x, rightleg.y); //right leg
          bezierVertex(x - (radius * 0.05), y + (radius * 0.27), x - (radius * 0.15), y + (radius * 0.3778), leftleg.x, leftleg.y); //left leg
          endShape();

          y = y + (radius * 0.015)

          let eye_y = y - (radius * 0.1111);
          let eye_xi = x - (radius * 0.5111);
          let eye_xf = x - (radius * 0.1667);

          //eye yellow
          push();
          translate(x - (radius * 0.3333), y - (radius * 0.1556));
          rotate(0.2);
          noStroke();
          fill(235, 225, 52);
          ellipse(0, 0, (radius * 0.3333), (radius * 0.6667) - (radius * 0.07));
          pop();

          //little eye
          push();
          translate(x - (radius * 0.40) - (radius * 0.0389), y - (radius * 0.1111));
          rotate(0.15);
          noStroke();
          fill(227, 186, 50);
          ellipse(0, 0, (radius * 0.1333), (radius * 0.3111));
          pop();

          //eyelid
          stroke(40);
          strokeWeight(0.1);
          fill(91, 62, 163);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x - (radius * 0.4556), y - (radius * 0.6222), x - (radius * 0.0167), y - (radius * 0.6222), eye_xf - (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x - (radius * 0.40), y - (radius * 0.0444), x - (radius * 0.4444), y - (radius * 0.0444), eye_xi, eye_y);
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 120);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x - (radius * 0.5333), y - (radius * 0.0222), x - (radius * 0.3111), y - (radius * 0.0222), eye_xf - (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x - (radius * 0.4444), y - (radius * 0.0833), x - (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x - (radius * 0.5333), y - (radius * 0.0556), x - (radius * 0.3111), y - (radius * 0.0333), eye_xf - (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x - (radius * 0.4444), y - (radius * 0.0833), x - (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 200);
          smooth();
          ellipse(x - (radius * 0.40), y, (radius * 0.07), (radius * 0.035));

          //highlights
          noStroke();
          push();
          translate(x + (radius * 0.2889), y - (radius * 0.4556) + (radius * 0.09));
          rotate(0.8);
          fill(255, 255, 255, 180);
          ellipse(0, 0, (radius * 0.23), (radius * 0.089));
          pop();


          //parpado
          fill(103, 70, 189);
          ellipse(x - (radius * 0.3), y - (radius * 0.175), (radius * 0.23), (radius * 0.15));
      } else if (isInCanyon) {

          x = x + (radius * 0.07)

          //body
          let rightleg = {
              x: x + (radius * 0.1778),
              y: y + (radius * 0.60),
          };
          let leftleg = {
              x: x - (radius * 0.33),
              y: y + (radius * 0.60),
          };
          let smidleg = {
              x: x - (radius * 0.1),
              y: y + (radius * 0.58),
          };

          //shadowbody
          fill(39, 28, 92);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg
          bezierVertex(x - (radius * 1.1), y - (radius * 1.13), x + (radius * 1.3), y - (radius * 0.8), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.45), x + (radius * 0.09), y + (radius * 0.5), smidleg.x, smidleg.y); //ghost leg
          bezierVertex(x - (radius * 0.05), y + (radius * 0.45), x - (radius * 0.15), y + (radius * 0.4), leftleg.x, leftleg.y); //left leg
          endShape();

          //body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.1), y - (radius * 1.13), x + (radius * 1.3), y - (radius * 0.8), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.3778), x - (radius * 0.05), y + (radius * 0.27), leftleg.x, leftleg.y); //left leg
          endShape();

          let eye_y = y - (radius * 0.1111);
          let eye_xi = x + (radius * 0.5111);
          let eye_xf = x + (radius * 0.1667);

          //eye yellow
          push();
          translate(x + (radius * 0.3333), y - (radius * 0.1556));
          rotate(-0.2);
          noStroke();
          fill(235, 225, 52);
          ellipse(0, 0, (radius * 0.3333), (radius * 0.6667));
          pop();

          //little eye
          push();
          translate(x + (radius * 0.40) + (radius * 0.0389), y - (radius * 0.1111));
          rotate(-0.15);
          noStroke();
          fill(227, 186, 50);
          ellipse(0, 0, (radius * 0.1333), (radius * 0.3111));
          pop();

          //eyelid
          stroke(40);
          strokeWeight(0.1);
          fill(91, 62, 163);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.4556), y - (radius * 0.6222), x + (radius * 0.0167), y - (radius * 0.6222), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.40), y - (radius * 0.0444), x + (radius * 0.4444), y - (radius * 0.0444), eye_xi, eye_y);
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 120);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.5333), y - (radius * 0.0222), x + (radius * 0.3111), y - (radius * 0.0222), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.4444), y - (radius * 0.0833), x + (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.5333), y - (radius * 0.0556), x + (radius * 0.3111), y - (radius * 0.0333), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.4444), y - (radius * 0.0833), x + (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 200);
          smooth();
          ellipse(x + (radius * 0.40), y, (radius * 0.07), (radius * 0.035));

          //highlights
          noStroke();
          push();
          translate(x - (radius * 0.2889), y - (radius * 0.4556) + (radius * 0.09));
          rotate(-0.85);
          fill(255, 255, 255, 200);
          ellipse(0, 0, (radius * 0.23), (radius * 0.089));
          pop();

          //parpado
          fill(103, 70, 189);
          ellipse(x + (radius * 0.3), y - (radius * 0.175), (radius * 0.23), (radius * 0.15));
      } else if (isRight) {

          x = x + (radius * 0.07)

          //body
          let rightleg = {
              x: x + (radius * 0.1778),
              y: y + (radius * 0.60),
          };
          let leftleg = {
              x: x - (radius * 0.33),
              y: y + (radius * 0.60),
          };
          let smidleg = {
              x: x - (radius * 0.1),
              y: y + (radius * 0.58),
          };

          //shadow
          //           fill(110, 110, 110, 100);
          //           smooth();
          //           ellipse(x - (radius * 0.1), floorPos_y, radius - (radius * 0.2222), (radius * 0.1111));

          //shadowbody
          fill(39, 28, 92);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg
          bezierVertex(x - (radius * 1.1), y - (radius * 1.13), x + (radius * 1.3), y - (radius * 0.8), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.45), x + (radius * 0.09), y + (radius * 0.5), smidleg.x, smidleg.y); //ghost leg
          bezierVertex(x - (radius * 0.05), y + (radius * 0.45), x - (radius * 0.15), y + (radius * 0.4), leftleg.x, leftleg.y); //left leg
          endShape();

          //body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.1), y - (radius * 1.13), x + (radius * 1.3), y - (radius * 0.8), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.3778), x - (radius * 0.05), y + (radius * 0.27), leftleg.x, leftleg.y); //left leg
          endShape();

          let eye_y = y - (radius * 0.1111);
          let eye_xi = x + (radius * 0.5111);
          let eye_xf = x + (radius * 0.1667);

          //eye yellow
          push();
          translate(x + (radius * 0.3333), y - (radius * 0.1556));
          rotate(-0.2);
          noStroke();
          fill(235, 225, 52);
          ellipse(0, 0, (radius * 0.3333), (radius * 0.6667));
          pop();

          //little eye
          push();
          translate(x + (radius * 0.40) + (radius * 0.0389), y - (radius * 0.1111));
          rotate(-0.15);
          noStroke();
          fill(227, 186, 50);
          ellipse(0, 0, (radius * 0.1333), (radius * 0.3111));
          pop();

          //eyelid
          stroke(40);
          strokeWeight(0.1);
          fill(91, 62, 163);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.4556), y - (radius * 0.6222), x + (radius * 0.0167), y - (radius * 0.6222), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.40), y - (radius * 0.0444), x + (radius * 0.4444), y - (radius * 0.0444), eye_xi, eye_y);
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 120);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.5333), y - (radius * 0.0222), x + (radius * 0.3111), y - (radius * 0.0222), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.4444), y - (radius * 0.0833), x + (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.5333), y - (radius * 0.0556), x + (radius * 0.3111), y - (radius * 0.0333), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.4444), y - (radius * 0.0833), x + (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 200);
          smooth();
          ellipse(x + (radius * 0.40), y, (radius * 0.07), (radius * 0.035));

          //highlights
          noStroke();
          push();
          translate(x - (radius * 0.2889), y - (radius * 0.4556) + (radius * 0.09));
          rotate(-0.85);
          fill(255, 255, 255, 200);
          ellipse(0, 0, (radius * 0.23), (radius * 0.089));
          pop();

          //parpado
          fill(103, 70, 189);
          ellipse(x + (radius * 0.3), y - (radius * 0.175), (radius * 0.23), (radius * 0.15));
      } else if (isRight && isFalling) {

          x = x + (radius * 0.07)
          y = y - (radius * 0.15)

          //body
          let rightleg = {
              x: x + (radius * 0.17),

              y: y + (radius * 0.5556),
          };
          let leftleg = {
              x: x - (radius * 0.3),

              y: y + (radius * 0.5556),
          };
          let smidleg = {
              x: x - (radius * 0.1),
              y: y + (radius * 0.55),
          };

          //shadow

          //           fill(110, 110, 110, 100);
          //           smooth();
          //           ellipse(x - (radius * 0.1), floorPos_y, radius - (radius * 0.2222) - (radius * 0.07), (radius * 0.1111));

          //shadowbody
          fill(39, 28, 92);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg
          bezierVertex(x - (radius * 1.1), y - (radius * 1.13) + (radius * 0.0667), x + (radius * 1.3), y - (radius * 0.8) + (radius * 0.0667), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.45), x + (radius * 0.05), y + (radius * 0.35), smidleg.x, smidleg.y); //ghost leg
          bezierVertex(x - (radius * 0.09), y + (radius * 0.45), x - (radius * 0.15), y + (radius * 0.45), leftleg.x, leftleg.y); //left leg
          endShape();

          //body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          beginShape();
          vertex(leftleg.x, leftleg.y); //first point and left leg

          bezierVertex(x - (radius * 1.1), y - (radius * 1.13) + (radius * 0.0667), x + (radius * 1.3), y - (radius * 0.8) + (radius * 0.0667), rightleg.x, rightleg.y); //right leg
          bezierVertex(x + (radius * 0.15), y + (radius * 0.3778), x - (radius * 0.05), y + (radius * 0.27), leftleg.x, leftleg.y); //left leg
          endShape();

          y = y + (radius * 0.015)


          let eye_y = y - (radius * 0.1111);
          let eye_xi = x + (radius * 0.5111);
          let eye_xf = x + (radius * 0.1667);


          //eye yellow
          push();
          translate(x + (radius * 0.3333), y - (radius * 0.1556));
          rotate(-0.2);
          noStroke();
          fill(235, 225, 52);
          ellipse(0, 0, (radius * 0.3333), (radius * 0.6667) - (radius * 0.07));
          pop();

          //little eye
          push();
          translate(x + (radius * 0.40) + (radius * 0.0389), y - (radius * 0.1111));
          rotate(-0.15);
          noStroke();
          fill(227, 186, 50);
          ellipse(0, 0, (radius * 0.1333), (radius * 0.3111));
          pop();

          //eyelid
          stroke(40);
          strokeWeight(0.1);
          fill(91, 62, 163);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.4556), y - (radius * 0.6222), x + (radius * 0.0167), y - (radius * 0.6222), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.40), y - (radius * 0.0444), x + (radius * 0.4444), y - (radius * 0.0444), eye_xi, eye_y);
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 120);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.5333), y - (radius * 0.0222), x + (radius * 0.3111), y - (radius * 0.0222), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.4444), y - (radius * 0.0833), x + (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(eye_xi, eye_y);
          bezierVertex(x + (radius * 0.5333), y - (radius * 0.0556), x + (radius * 0.3111), y - (radius * 0.0333), eye_xf + (radius * 0.0222), eye_y + (radius * 0.0667));
          bezierVertex(x + (radius * 0.4444), y - (radius * 0.0833), x + (radius * 0.4889), y - (radius * 0.0833), eye_xi, eye_y);
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 200);
          smooth();
          ellipse(x + (radius * 0.40), y, (radius * 0.07), (radius * 0.035));

          //highlights
          noStroke();
          push();
          translate(x - (radius * 0.2889), y - (radius * 0.4556) + (radius * 0.09));
          rotate(-0.8);
          fill(255, 255, 255, 180);
          ellipse(0, 0, (radius * 0.23), (radius * 0.089));
          pop();

          //parpado
          fill(103, 70, 189);
          ellipse(x + (radius * 0.3), y - (radius * 0.175), (radius * 0.23), (radius * 0.15));
      } else {
          //body
          let rightleg = {
              x: x - radius / 2 + (radius * 0.2),
              y: y + (radius * 0.5556), //55.56%  (radius*0.5556)
          };
          let middleleg = {
              x: x + (radius * 0.0444), //
              y: y + (radius * 0.6667), // 66.67% (radius*0.6667)
          };
          let leftleg = {
              x: x + radius / 2 - (radius * 0.1556), //(radius*0.1556)
              y: y + (radius * 0.5556),
          };

          //shadow
          //           fill(110, 110, 110, 100);
          //           ellipse(x, floorPos_y, radius - (radius * 0.2222), (radius * 0.1111));
          //shadowbody
          let srightleg = {
              x: x + (radius * 0.2222),
              y: y + (radius * 0.5556),
          };
          let sleftleg = {
              x: x - (radius * 0.1778),
              y: y + (radius * 0.5556),
          };
          fill(39, 28, 92);

          beginShape();
          vertex(rightleg.x, rightleg.y); //(first point)
          bezierVertex(x - (radius * 1.1111), y - (radius * 0.95), x + (radius * 1.1556), y - (radius * 0.95), leftleg.x, leftleg.y); //second point and circle
          bezierVertex(x + (radius * 0.3111), y + (radius * 0.4444), x + (radius * 0.3111), y + (radius * 0.4444), srightleg.x, srightleg.y); //shadow triangle
          bezierVertex(x + (radius * 0.18), y + (radius * 0.4), x + (radius * 0.17), y + (radius * 0.4), middleleg.x, middleleg.y); //middle leg

          bezierVertex(x - (radius * 0.12), y + (radius * 0.4), x - (radius * 0.15), y + (radius * 0.4), sleftleg.x, sleftleg.y); //left triangle
          bezierVertex(x - (radius * 0.30), y + (radius * 0.4033), x - (radius * 0.30), y + (radius * 0.4778), rightleg.x, rightleg.y); //connecting point to beginning
          endShape();
          //alien body
          stroke(40);
          strokeWeight(0.18);
          fill(116, 90, 219);
          //body
          beginShape();
          vertex(rightleg.x, rightleg.y);
          bezierVertex(x - (radius * 1.1111), y - (radius * 0.95), x + (radius * 1.1556), y - (radius * 0.95), leftleg.x, leftleg.y); //right leg
          bezierVertex(x + (radius * 0.2667), y + (radius * 0.3333), x + (radius * 0.2667), y + (radius * 0.3333), middleleg.x, middleleg.y); //middle leg
          bezierVertex(x - (radius * 0.23), y + (radius * 0.25), x - (radius * 0.20), y + (radius * 0.3333), rightleg.x, rightleg.y); //left leg
          endShape();

          //eye yellow
          noStroke();
          fill(235, 225, 52);
          ellipse(x + (radius * 0.0222), y - (radius * 0.1556), (radius * 0.7778), (radius * 0.6667));

          //little eye
          noStroke();
          fill(227, 186, 50);
          ellipse(x - (radius * 0.0222), y - (radius * 0.1111), (radius * 0.40), (radius * 0.3111));

          //eyelid
          stroke(40);
          strokeWeight(0.05);
          fill(91, 62, 163);
          beginShape();
          vertex(x - (radius * 0.3667), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.4444), y - (radius * 0.60), x + (radius * 0.4444), y - (radius * 0.6444), x + (radius * 0.4167), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.0444), y - (radius * 0.0278), x - (radius * 0.0444), y - (radius * 0.0333), x - (radius * 0.3667), y - (radius * 0.1111));
          endShape();

          //eyelid shadow
          noStroke();
          fill(120, 120, 120, 100);
          beginShape();
          vertex(x - (radius * 0.3667), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.3556), y - (radius * 0.0667), x + (radius * 0.40), y - (radius * 0.0667), x + (radius * 0.4167), y - (radius * 0.1111));
          bezierVertex(x + (radius * 0.3111), y + (radius * 0.0111), x - (radius * 0.3111), y + (radius * 0.0111), x - (radius * 0.3667), y - (radius * 0.1111));
          endShape();

          //parpado oscuro
          fill(41, 28, 74);
          beginShape();
          vertex(x - (radius * 0.3667), y - (radius * 0.1111));
          bezierVertex(x - (radius * 0.3), y - (radius * 0.03), x + (radius * 0.37), y - (radius * 0.03), x + (radius * 0.4167), y - (radius * 0.1111));
          bezierVertex(x + (radius * 0.2), y - (radius * 0.07), x - (radius * 0.2), y - (radius * 0.07), x - (radius * 0.3667), y - (radius * 0.1111));
          endShape();

          //highlights
          noStroke();
          fill(255, 255, 255, 180);
          smooth();
          ellipse(x + (radius * 0.1111), y, (radius * 0.12), (radius * 0.04));

          //highlight body
          noStroke();
          push();
          translate(x + (radius * 0.2889), y - (radius * 0.49) + (radius * 0.0333));
          rotate(7.95 / -3);
          fill(255, 255, 255, 175);
          ellipse(0, 0, (radius * 0.14), (radius * 0.04));
          pop();

          //highlight eyelid
          fill(103, 70, 189);
          ellipse(x + (radius * 0.10778), y - (radius * 0.20), (radius * 0.35), (radius * 0.178));
      }

  }
  // ---------------------------
  // Background render functions
  // ---------------------------

  // Function to draw cloud objects.
  function drawClouds() {
      for (var v = 0; v < clouds.length; v++) {
          //main shape
          fill(209, 225, 231);
          ellipse(clouds[v].x_pos - 30, clouds[v].y_pos, 220, 120);

          //decorations
          stroke(209, 225, 231);
          strokeWeight(clouds[v].size);
          point(clouds[v].x_pos + 40, clouds[v].y_pos + 16);
          point(clouds[v].x_pos - 132, clouds[v].y_pos - 5);
          point(clouds[v].x_pos - 106, clouds[v].y_pos - 21);
          point(clouds[v].x_pos - 72, clouds[v].y_pos - 38);
          point(clouds[v].x_pos - 45, clouds[v].y_pos - 38);
          point(clouds[v].x_pos + 10, clouds[v].y_pos - 36);
          point(clouds[v].x_pos + 40, clouds[v].y_pos - 30);
          point(clouds[v].x_pos + 64, clouds[v].y_pos - 5);
          point(clouds[v].x_pos + 58, clouds[v].y_pos + 23);
          point(clouds[v].x_pos - 17, clouds[v].y_pos - 44);
          point(clouds[v].x_pos + 76, clouds[v].y_pos + 10);
          point(clouds[v].x_pos + 19, clouds[v].y_pos + 38);
          point(clouds[v].x_pos - 28, clouds[v].y_pos + 48);
          point(clouds[v].x_pos - 59, clouds[v].y_pos + 48);
          point(clouds[v].x_pos - 87, clouds[v].y_pos + 46);
          point(clouds[v].x_pos - 105, clouds[v].y_pos + 38);
          point(clouds[v].x_pos - 125, clouds[v].y_pos + 23);
          point(clouds[v].x_pos - 1, clouds[v].y_pos + 46);
          point(clouds[v].x_pos + 41, clouds[v].y_pos + 35);
          noStroke();
      }
  }
  // Function to draw mountains objects.
  function drawMountains() {
      for (var i = 0; i < mountains.length; i++) {

          //drawing the mountain
          stroke(72, 61, 139, 30);
          strokeWeight(1);

          fill(77, 0, 102);
          triangle(mountains[i].x_pos - 120, mountains[i].y_pos, mountains[i].x_pos, mountains[i].y_pos - 176, mountains[i].x_pos - 80, mountains[i].y_pos);

          fill(113, 39, 109);
          triangle(mountains[i].x_pos - 97, mountains[i].y_pos, mountains[i].x_pos, mountains[i].y_pos - 176, mountains[i].x_pos + 120, mountains[i].y_pos);

          //snow in mountain
          noStroke();
          fill(250);
          triangle(mountains[i].x_pos, mountains[i].y_pos - 176, mountains[i].x_pos - 30, mountains[i].y_pos - 122, mountains[i].x_pos + 37, mountains[i].y_pos - 122);

          fill(170);
          triangle(mountains[i].x_pos - 37, mountains[i].y_pos - 122, mountains[i].x_pos - 30, mountains[i].y_pos - 122, mountains[i].x_pos, mountains[i].y_pos - 176);
      }
  }
  // Function to draw trees objects.
  function drawTrees() {
      for (var q = 0; q < trees_x.length; q++) {
          //drawing the tree
          fill(145, 130, 107);
          rect(trees_x[q], 332, 15, 100);

          fill(211, 145, 227);
          triangle(trees_x[q] - 22, 332 + 23, trees_x[q] + 8, 332 - 12, trees_x[q] + 42, 332 + 23);
          triangle(trees_x[q] - 35, 332 + 53, trees_x[q] + 8, 332 - 12, trees_x[q] + 55, 332 + 53);
          triangle(trees_x[q] - 40, 332 + 83, trees_x[q] + 8, 332 - 12, trees_x[q] + 60, 332 + 83);
          noStroke();
      }

  }
  // ---------------------------------
  // Canyon render and check functions
  // ---------------------------------
  // Function to draw canyon objects.
  function drawCanyon(t_canyon) {
      //drawing the canyon
      fill(173, 217, 207);
      quad(t_canyon.x_pos + 20, 432, t_canyon.x_pos, 577, t_canyon.x_pos + t_canyon.width + 95, 577, t_canyon.x_pos + t_canyon.width + 75, 432);
  }

  // ----------------------------------
  // Collectable items render and check functions
  // ----------------------------------
  // Function to draw collectable objects.
  function drawCollectable(t_collectable) {
      //drawing the collectable 
      noStroke();
      fill(120, 120, 120, 100);
      rect(t_collectable.x_pos, t_collectable.y_pos + t_collectable.size * 0.76, t_collectable.size, t_collectable.size / t_collectable.size * 0.2, t_collectable.size * 0.12);

      fill(120, 162, 191);
      rect(t_collectable.x_pos, t_collectable.y_pos + t_collectable.size * 0.2, t_collectable.size, t_collectable.size - t_collectable.size * 0.4, t_collectable.size * 0.1);
      stroke(100, 100, 139, 100);
      strokeWeight(1);
      fill(230, 237, 245);
      rect(t_collectable.x_pos + t_collectable.size * 0.04, t_collectable.y_pos + t_collectable.size * 0.2, t_collectable.size, t_collectable.size - t_collectable.size * 0.4, t_collectable.size * 0.1);

      noStroke();
      fill(213, 88, 88);
      rect(t_collectable.x_pos + t_collectable.size * 0.46, t_collectable.y_pos + t_collectable.size * 0.28, t_collectable.size * 0.16, t_collectable.size * 0.44, t_collectable.size * 0.02);
      rect(t_collectable.x_pos + t_collectable.size * 0.32, t_collectable.y_pos + t_collectable.size * 0.41, t_collectable.size * 0.44, t_collectable.size * 0.16, t_collectable.size * 0.02);
  }
  // Function to check character has collected an item.
  function checkCollectable(t_collectable) {
      //draw first anchored collectable, conditions is found?
      if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size + 5) {
          t_collectable.isFound = true;
          game_score += 1;
          if (bonusSound.loaded) {
              bonusSound.playSound();
          }
      }

  }

  function renderFlagpole() {
      push();
      strokeWeight(5);
      stroke(100);
      line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
      if (flagpole.isReached) {
          fill(191, 189, 88);
          stroke(115, 113, 47);

          rect(flagpole.x_pos, floorPos_y - 250, 100, 50);
      } else {
          fill(53, 59, 115);
          stroke(115, 113, 47);

          rect(flagpole.x_pos, floorPos_y - 50, 100, 50);
      }
      pop();
  }

  function checkFlagpole() {
      var d = abs(gameChar_world_x - flagpole.x_pos);
      if (d < 15) {
          flagpole.isReached = true;
      }
  }

  function checkPlayerDie() {

      if (gameChar_y >= 630) {
          bottomCanvas = true;
          playerDied();
      } else {
          bottomCanvas = false;
      }



  }

  function playerDied() {
      if (lives != 0 && bottomCanvas || enemyCollision) {
          lives -= 1;
          enemySound.play();
          enemySound.setVolume(0.3);
          startGame();
      }
  }

  function startGame() {
      maxHeight = 0;
      gameChar_x = width / 6;
      gameChar_y = floorPos_y;
      gameChar_world_x = gameChar_x;
      scrollPos = 0;

      isLeft = false;
      isRight = false;
      isPlummeting = false;
      isFalling = false;
      isInCanyon = false;
      isInPlatform = false;
      enemyCollision = false;
      bottomCanvas = false;

      // Variable to control the background scrolling.
      scrollPos = 0;
      //gamecharacter initial position
      alien = {
          x: 0,
          y: 0,
      }


      //trees_x variables
      trees_x = [60, 150, 1350, 1390, 1440, 1650, 2450, 2550, 3900, 3980, 4070];

      //canyon variables
      canyons = [{ x_pos: 400, width: 850 },
          { x_pos: 1775, width: 400 },
          { x_pos: 2775, width: 900 }

      ];

      //mountain variables
      mountains = [{ x_pos: 80, y_pos: 432, size: 50 },
          { x_pos: 240, y_pos: 432, size: 50 },
          { x_pos: 1500, y_pos: 432, size: 50 },
          { x_pos: 1650, y_pos: 432, size: 50 },
          { x_pos: 2450, y_pos: 432, size: 50 },
          { x_pos: 2600, y_pos: 432, size: 50 }

      ];
      //clouds variables
      clouds = [{ x_pos: 100, y_pos: 120, size: 60 },
          { x_pos: 700, y_pos: 150, size: 60 },
          { x_pos: 930, y_pos: 100, size: 65 },
          { x_pos: 1500, y_pos: 120, size: 60 },
          { x_pos: 1640, y_pos: 110, size: 60 },
          { x_pos: 2440, y_pos: 150, size: 60 },
          { x_pos: 2140, y_pos: 120, size: 60 },
          { x_pos: 2840, y_pos: 150, size: 60 },
          { x_pos: 3040, y_pos: 110, size: 60 },
          { x_pos: 3640, y_pos: 150, size: 60 },
          { x_pos: 4240, y_pos: 120, size: 60 }
      ];
      //game score
      game_score = 0;
      //flagpole
      flagpole = { isReached: false, x_pos: 4200 };
      //collectable variables
      collectables = [{ x_pos: 1530, y_pos: floorPos_y - 100, size: 70, isFound: false },
          { x_pos: 2500, y_pos: floorPos_y - 100, size: 70, isFound: false },
          { x_pos: 3900, y_pos: floorPos_y - 100, size: 70, isFound: false }
      ];
  }

  // Function to check character is over a canyon.
  function checkCanyon() {
      for (var i = 0; i < canyons.length; i++) {
          if ((canyons[i].x_pos + canyons[i].width + 95 > gameChar_world_x) &&
              (gameChar_world_x > canyons[i].x_pos) &&
              gameChar_y <= floorPos_y) {
              isInCanyon = true;
              if (gameChar_y == floorPos_y || abs(gameChar_y - floorPos_y) < 10) {
                  isPlummeting = true;
              } else if (gameChar_y > floorPos_y) {
                  isPlummeting = true;
              } else {
                  isInCanyon = false;
              }
          }
      }
  }

  function drawLifeTokens() {

      for (var t = 0; t < lives; t++) {
          fill(100, 0, 0);
          ellipse(t * 40 + 890 + t * 3, t + 44, 40, 40)
          fill(255, 0, 0);
          ellipse(t * 40 + 890 + t * 3, t + 40, 30, 30)
      }


  }

  // ---------------------------------

  //final game

  function drawPlatforms() {
      for (var n = 0; n < platform.length; n++) {
          fill(83, 140, 119);
          stroke(114, 41, 115);
          strokeWeight(0.5);
          rect(platform[n].x_pos, platform[n].y_pos, platform[n].large, platform[n].size, 10);
      }
  }

  function checkPlatform() {
      //if platform.isReached
      for (var n = 0; n < platform.length; n++) {
          if (platform[n].x_pos < gameChar_world_x && gameChar_world_x < platform[n].x_pos + platform[n].large &&
              platform[n].y_pos < gameChar_y && gameChar_y <= platform[n].y_pos + platform[n].size) {
              platform[n].isReached = true;
              return platform[n];
          } else {
              platform[n].isReached = false;
          }
      }
  }

  function Enemy(platform) {
      this.size = 50;
      this.x = platform.x_pos + 50;
      this.y = platform.y_pos - 5 - this.size / 2;
      this.isReached = false;
      this.collisioned = false;
      this.rem = false;

      this.display = function() {
          fill(174, 219, 79);
          stroke(111, 143, 44);
          strokeWeight(1.5);
          ellipse(this.x, this.y, this.size, this.size);
          fill(200);
          stroke(100);
          ellipse(this.x - 10, this.y + 5, 18, 18);
          ellipse(this.x + 10, this.y + 5, 18, 18);
          fill(0);
          ellipse(this.x - 10, this.y + 5, 5, 5);
          ellipse(this.x + 10, this.y + 5, 5, 5);
          stroke(0);
          line(this.x - 18, this.y - 10, this.x - 5, this.y);
          line(this.x + 18, this.y - 10, this.x + 5, this.y);
          //   decor
          fill(174, 219, 79);
          stroke(111, 143, 44);
          strokeWeight(1.5);
          ellipse(this.x - 30, this.y - 5, 15, 15);
          ellipse(this.x + 30, this.y - 5, 15, 15);


      }

      this.move = function() {
          if (this.isReached) {
              this.x -= 1;
          } else if (!this.isReached) {
              this.x += 1;
          }
          this.update();
      }
      this.update = function() {
          if (this.x == platform.x_pos + platform.large) {
              this.isReached = true;
          } else if (this.x == platform.x_pos) {
              this.isReached = false;
          }
      }
      this.check = function() {
          var d = dist(gameChar_world_x, gameChar_y, this.x, this.y);
          if (d < 60) {
              this.collisioned = true;
              this.rem = true;
              lives -= 1;
              checkPlayerDie();

          } else {
              this.collisioned = false;
              this.rem = false;
          }
      }

      this.remove = function() {
          if (this.rem) {
              return true
          } else {
              return false
          }
      }
  }