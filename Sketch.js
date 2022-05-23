kaboom({
  scale: 1,
  background: [10, 150, 200],
});
loadSpriteAtlas("https://kaboomjs.com/sprites/dungeon.png", "atlas.json");

let score = 0;
let time = 0;

const levelConfig = {
  width: 16,
  height: 16,
  pos: vec2(32, 32),
  w: () => ["wall", sprite("wall"), area(), solid()],
  b: () => ["barrier", sprite("wall"), area(), opacity(0, 3)],
  o: () => [
    "enemy",
    sprite("ogre", {
      anim: "run",
    }),
    area({
      scale: 0.5,
    }),
    origin("center"),
    {
      xVel: 30,
    },
  ],
  D: () => [
    "door",
    sprite("closed_door"),
    area({
      scale: 0.99,
    }),
    solid(),
    origin("center"),
  ],
  c: () => [
    "chest",
    sprite("chest", {
      frame: 2,
    }),
    area(),
    solid(),
    origin("top"),
  ],
  $: () => [
    "coin",
    sprite("coin", {
      anim: "spin",
    }),
    area(),
    solid(),
    origin("top"),
  ],
  "+": () => [
    "healthPotion",
    sprite("healthPotion", {
      anim: "spin",
    }),
    area(),
    solid(),
    origin("top"),
  ],
};

//levels
const levels = [
  [
    "     c    ",
    "    ww    ",
    "     b o$    +     $ob$",
    "www   wwwwwwwwwwwwwwwwD",
  ],
  [
    "    $c$      ",
    "    www     w",
    "  bbbbo o$  + $b  $",
    "www   wwwwwwwww wwwD",
  ],
  [
    "   $c$       ",
    "  wwwww    ww",
    "  bbbb o$ + $ b  +$",
    "ww   wwwwwwwww wwwD",
    "  $$+$$       ",
    "  wwww       ",
  ],
  [
    "   $$$       ",
    "  wwwww    ww",
    "  bbbb o$$ b  +$",
    "ww   wwwwwww  wwD",
    "                  $$$c$$$",
    "                  wwwwwww",
  ],
  [
    "    $        ",
    "  w w w    ww",
    "    b o  b ob   ",
    "ww   www www  wwD",
    "  $$$             $$ c $$",
    "  www             ww w ww",
  ],
  [
    "    c  $$+$$                 ",
    "wwwwwwwwwwwwwwwwwwwwwww      ",
    "                             ",
    "                             ",
    "    $$  b oooo+oob  $$       ",
    "   wwwwwwwwwwwwwwwwwwwwwwwwww",
    "     $$$            $$   $$  ",
    "wwwwwwwwwwwwwwwwwwwwwwwwww  ",
    "    $$$$$$$$+$$$$$$$$$$$$    ",
    "   wwwwwwwwwwwwwwwwwwwwwwwwww",
    "      $$    +      $$        ",
    "wwwwwwwwwwwwwwwwwwwwwwwwww   ",
    "                             ",
    "                             ",
    "                             ",
    "Dwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ],
  [
    "  $    $c$   $+    $$    $   bob$$      ++   $c$    $   bob    $$$$     +$   bob$  $   +  $$$  c      $   $    $  $+",
    "www  wwww  wwww  wwww  www  wwwwwwww  wwww  wwwww  www  wwwww wwwwww  wwww  wwww www www www www www www www www wD",
  ],
  ["    $c$      +  ", "www wwwwww  wwwwD"],
];

let levelNum = 0;

scene("game", () => {
  let hp = 2;

  let hasKey = false;

  //Score counter
  let scoreLabel = add([
    text("Score: 0", {
      size: 30,
    }),
    pos(130, 1),
    fixed(),
  ]);
  //Time counter
  let timeLabel = add([
    text("Time: 0", {
      size: 30,
    }),
    pos(350, 1),
    fixed(),
    loop(1, () => {
      wait(1, () => {
        time += 1;
        timeLabel.text = "Time: " + time;
      });
    }),
  ]);

  const level = addLevel(levels[levelNum], levelConfig);

  const hpLabel = add([
    text("Hp: " + hp, {
      size: 30,
    }),
    pos(15, 1),
    fixed(),
  ]);

  const player = add([
    sprite("hero"),
    pos(level.getPos(2, 0)),
    area({ scale: 0.5 }),
    solid(),
    origin("bot"),
    body(),
    {
      speed: 150,
      jumpforce: 350,
    },
  ]);
  player.play("idle");

  onUpdate("enemy", (e) => {
    e.move(e.xVel, 0);
  });

  onCollide("enemy", "barrier", (e, b) => {
    e.xVel = -e.xVel;
    if (e.xVel < 0) {
      e.flipX(true);
    } else {
      e.flipX(false);
    }
  });
    spawnCoins()

  //KillBox
  const killbox = add([
    pos(150, 888),
    "killBox",
    rect(5000, 350),
    opacity(0),
    area(),
    origin("bot"),
  ]);

  //Camera ViewPoint
  player.onUpdate(() => {
    camPos(player.pos);
  });

  //Controls
  onKeyPress("up", () => {
    if (player.isGrounded()) {
      player.jump(player.jumpforce);
      player.play("hit");
    }
  });
    onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(player.jumpforce);
      player.play("hit");
    }
  });
  onKeyPress("w", () => {
    if (player.isGrounded()) {
      player.jump(player.jumpforce);
      player.play("hit");
    }
  });

  player.onCollide("wall", () => {
    player.play("idle");
  });

  player.onCollide("enemy", () => {
    addKaboom(player.pos);
    hp--;
    hpLabel.text = "hp: " + hp;
    if (hp == 0) {
      destroy(player);
      wait(1, () => {
        go("lose");
      });
    }
  });
  player.onCollide("killBox", () => {
    addKaboom(player.pos);
    destroy(player);
    wait(1, () => {
      go("lose");
    });
  }),
    player.onCollide("coin", ($) => {
      destroy($);
      score += 10;
      scoreLabel.text = "score: " + score;
    }),
    player.onCollide("healthPotion", (H) => {
      destroy(H);
      hp += 2;
      player.speed += 50;
      hpLabel.text = "hp: " + hp;
    }),
    player.onCollide("chest", (c) => {
      c.play("open");
      hasKey = true;
      destroy(c);
      score += 160;
      scoreLabel.text = "score: " + score;
    }),
    player.onCollide("door", () => {
      debugger;
      if (hasKey) {
        if (levelNum == levels.length - 1) {
          go("win",{time});
        } else {
          levelNum++;
          localStorage.setItem("level", levelNum);
          go("game");
        }
      }
    }),
    //Controls 2
    onKeyDown(["right","d"], () => {
      player.move(player.speed, 0);
      player.flipX(false);
    }),
    onKeyDown(["left","a"], () => {
      player.move(-player.speed, 0);
      player.flipX(true);
    }),
    onKeyPress(["right","d","left","a"], () => {
      player.play("run");
    }),
    onKeyRelease(["right","d","left","a"], () => {
      player.play("idle");
    });
  
}); //CLOSE game

scene("menu", () => {
  add([
    text("Dragon World"),
    "playButton",
    pos(width() / 2, height() / 2),
    origin("center"),
    area(),
  ]);
  add([
    text("Play"),
    "playButton",
    pos(width() / 2, height() / 2 + 75),
    origin("center"),
    area(),
  ]);
  add([
    text("continue?"),
    "continue",
    pos(width() / 2, height() / 2 + 150),
    origin("center"),
    area(),
  ]);

  onClick("playButton", () => {
    levelNum = 0;
    go("game");
  });
  onClick("continue", () => {
    (levelNum = 0), localStorage.getItem("level") || 1;
    go("game");
  });
});

scene("win", ({time}) => {
  add([text("You Win!"), 
       pos(width() / 2, height() / 2),                  origin("center")]);
  add([
    text("Play Again"),
    "playButton",
    (levelNum = 0),
    pos(width() / 2, height() / 2 + 150),
    origin("center"),
    area(),
  ]);
  add([
    text(`Time: ${time}`),
    pos(width() / 2, height() / 2+75),
    origin("center"),
    area(),
  ]);

  onClick("playButton", () => {
    go("game");
  });
});

scene("lose", () => {
  add([text("You Lose!"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("RETRY"),
    "playButton",
    pos(width() / 2, height() / 2 + 75),
    origin("center"),
    area(),
  ]);

  onClick("playButton", () => {
    go("game");
  });
});
       function spawnCoins() {
       let x = 100
       let y = 270
       for(let i = 0; i < 5; i++) {
         add([
           "coin",
           sprite("coin",{
             width: 10,
             height: 10,
             anim:"spin"
             }),
           pos(x,y),
           score += 50 ,
           origin("center"),
           area(),
           solid(),
           ])

           x += 60
           if (x + 125 > width()) {
           y += 270
           x = 100
         }
      }
   }
go("menu");
