var gameData = {
  gold: 0,
  goldTotal: 0,
  goldPerClick: 1,
  minerPerClick: 0,
  minerPerClickCost: 10,
  buttonCost: 50,
  visualLevel: 0,
  lastTick: Date.now()
}

var gameReset = {
  gold: 0,
  goldTotal: 0,
  goldPerClick: 1,
  minerPerClick: 0,
  minerPerClickCost: 10,
  buttonCost: 5,
  visualLevel: 0,
  lastTick: Date.now()
}

function toggle_visibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}

function mineGold() {
  gameData.gold += gameData.goldPerClick
  gameData.goldTotal += gameData.goldPerClick
  document.getElementById("goldMined").innerHTML = format(gameData.gold, "scientific") + " Gold Mined"
  document.getElementById("goldTotal").innerHTML = format(gameData.goldTotal, "scientific") + " Total Gold Mined"
}

function minerGold() {
  gameData.gold += gameData.minerPerClick * (diff / 1000)
  gameData.goldTotal += gameData.minerPerClick * (diff / 1000)
  document.getElementById("goldMined").innerHTML = format(gameData.gold, "scientific") + " Gold Mined"
  document.getElementById("goldTotal").innerHTML = format(gameData.goldTotal, "scientific") + " Total Gold Mined"
}

function buyMinerPerClick() {
  if (gameData.gold >= gameData.minerPerClickCost) {
    gameData.gold -= gameData.minerPerClickCost
    gameData.minerPerClick += 1
    gameData.minerPerClickCost *= 1.15
    document.getElementById("goldMined").innerHTML = gameData.goldMined + " Gold Mined"
    document.getElementById("goldTotal").innerHTML = gameData.goldTotal + " Total Gold Mined"
    document.getElementById("perClickUpgrade").innerHTML = "Currently " + format(gameData.minerPerClick, "scientific") + " miners. Another miner costs " + format(gameData.minerPerClickCost, "scientific") + " Gold."
  }
}

var mainGameLoop = window.setInterval(function() {
  diff = Date.now() - gameData.lastTick;
  gameData.lastTick = Date.now()
  minerGold();
  if(gameData.goldTotal >= 1000000) {
    document.getElementById("epilogue").style.display = "block";
  }
}, 1000)

var saveGameLoop = window.setInterval(function() {
  localStorage.setItem('goldMinerSave', JSON.stringify(gameData))
}, 15000)

var savegame = JSON.parse(localStorage.getItem("goldMinerSave"))
if (savegame !== null) {
  gameData = savegame
  var loadGameLoop = window.setInterval(function() {
    document.getElementById("goldMined").innerHTML = format(gameData.gold, "scientific") + " Gold Mined"
    document.getElementById("goldTotal").innerHTML = format(gameData.goldTotal, "scientific") + " Total Gold Mined"
    if (gameData.minerPerClick == 0) {
      document.getElementById("perClickUpgrade").innerHTML = "Currently 0 miners. Another miner costs 10 Gold."
    } else {
      document.getElementById("perClickUpgrade").innerHTML = "Currently " + format(gameData.minerPerClick, "scientific") + " miners. Another miner costs " + format(gameData.minerPerClickCost, "scientific") + " Gold."
    }
    visualCheck()
  }, 10)
}

function resetGame() {
  localStorage.setItem('goldMinerSave', JSON.stringify(gameReset))
  window.location.reload(false);
}

function visualBuy() {
  if (gameData.gold >= gameData.buttonCost) {
    gameData.gold -= gameData.buttonCost
    gameData.visualLevel += 1
    visualCheck()
  }
}

function visualCheck() {
  if (gameData.visualLevel > 0) {
    document.getElementById("heading1").style.display = "block";
    document.getElementById("heading2").style.display = "block";
    document.getElementById("heading3").style.display = "block";
    document.getElementById("heading4").style.display = "block";
  }
  if (gameData.visualLevel > 1) {
    document.getElementById("section1").style.backgroundColor = "lightblue"
    document.getElementById("section2").style.backgroundColor = "lightblue"
    document.getElementById("section3").style.backgroundColor = "lightblue"
    document.getElementById("section4").style.backgroundColor = "lightblue"
  }
  if (gameData.visualLevel > 2) {
    document.getElementById("line1").style.display = "block";
    document.getElementById("line2").style.display = "block";
    document.getElementById("line3").style.display = "block";
  }
  if (gameData.visualLevel > 3) {
    document.getElementById("button2a").style.display = "none";
    document.getElementById("button2b").style.display = "block";
    document.getElementById("button3a").style.display = "none";
    document.getElementById("button3b").style.display = "block";
    document.getElementById("button4a").style.display = "none";
    document.getElementById("button4b").style.display = "block";
  }
  if (gameData.visualLevel == 0) {
    document.getElementById("headingButton").style.display = "block";
  }
  if (gameData.visualLevel == 1) {
    document.getElementById("headingButton").style.display = "none";
    document.getElementById("backgroundButton").style.display = "block";
  }
  if (gameData.visualLevel == 2) {
    document.getElementById("backgroundButton").style.display = "none";
    document.getElementById("lineButton").style.display = "block";
  }
  if (gameData.visualLevel == 3) {
    document.getElementById("lineButton").style.display = "none";
    document.getElementById("buttonButton").style.display = "block";
  }
}

function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 6) return number.toFixed(0)
	if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}