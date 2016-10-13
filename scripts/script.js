//generates a wrestler object given text input
var genWrestlerTemplate = function(nameInput) {
  return {
    wins: 0,
    losses: 0,
    name: nameInput,
    taunt: function() {
      return "YOU HAVE BEEN DEFEATED BY ME, " + this.name.toUpperCase() + "!!!!!!"
    },
    //assigns a random value between 1 and 10, rounded to nearest int, then asigns to strength property
    strength: Math.floor(Math.random() * 10),
    win: function(){
      this.wins+=1
      return this.taunt()
    },
    lose: function(){
      this.losses+=1
      return this
    }
  }
}

//makes an array of generated wrestler objects
var genWrestlers = function(wrestlerNamesArray) {
  var wrestlerObjects = []
  for (var i = 0; i < wrestlerNamesArray.length; i++){
    var wrestler = genWrestlerTemplate(wrestlerNamesArray[i])
    wrestlerObjects.push(wrestler)
  }
  return wrestlerObjects;
}

var inputLeftName = document.querySelector(".arena-left input[type='text']")
var inputRightName = document.querySelector(".arena-right input[type='text']")
var wrestlerLeftNameNode = document.querySelector(".wrestler-left-name")
var wrestlerRightNameNode = document.querySelector(".wrestler-right-name")

var giveLeftName = function(keyEvent) {
  if (keyEvent.keyCode === 13) {
    var givenName = keyEvent.target,
        nameValue = givenName.value
    wrestlerLeftNameNode.innerHTML = nameValue
    inputLeftName.style.opacity = 0
  }
}

var giveRightName = function(keyEvent) {
  if (keyEvent.keyCode === 13) {
    var givenName = keyEvent.target,
        nameValue = givenName.value
    wrestlerRightNameNode.innerHTML = nameValue
    inputRightName.style.opacity = 0
  }
}

inputLeftName.addEventListener("keydown",giveLeftName)
inputRightName.addEventListener("keydown",giveRightName)

var defaultWrestlerNames = ["theCamelCase", "The Javascript Jerk", "The Mobile Mafioso", "The Dot Net Demolisher", "Hello World of Pain", "The Lorem Ipsum", "Crushing Super Slayer", "He That Makes Losers"]

//used in startMatch event handler to assign a default name if start button is pressed with no given name
var assignWrestlerName = function(name) {
  if (name === ""){
    //make a random method for all instances you need a random int
    name = defaultWrestlerNames[Math.floor(Math.random() * defaultWrestlerNames.length)];
  }
  return name;
}

//need to define wrestlers here so it can be called outside of functions
var wrestlers = []
//used during startMatchButton event handler
var setupMatch = function(leftName,rightName){
  wrestlerLeftNameNode.innerHTML = leftName
  wrestlerRightNameNode.innerHTML = rightName
  //takes names and makes wrestlers
  var wrestlerNames = [leftName,rightName]
  wrestlers = (genWrestlers(wrestlerNames))
}

var startMatchButton = document.querySelector(".start-match-button")
var nextRoundButton = document.querySelector(".next-round-button")
var resetButton = document.querySelector(".reset-button")

var wrestlerImageLeft = document.querySelector(".wrestler-left img")
var wrestlerImageRight = document.querySelector(".wrestler-right img")

startMatchButton.addEventListener("click", function(){
  //fix this: checks if a name has been given when start button is pressed. If not, it gives a random name from the assignWrestlerName function.
  var leftWrestlerName = assignWrestlerName(wrestlerLeftNameNode.innerHTML)
  var rightWrestlerName = assignWrestlerName(wrestlerRightNameNode.innerHTML)
  
  setupMatch(leftWrestlerName,rightWrestlerName)
  wrestlerImageLeft.src = "http://lorempixel.com/100/100/cats/" + Math.floor(Math.random() * 10)
  wrestlerImageRight.src = "http://lorempixel.com/100/100/cats/" + Math.floor(Math.random() * 10)
  //fix this: displays names, hides start button, and shows nextRound/reset button
  inputLeftName.style.opacity = 0
  inputRightName.style.opacity = 0
  nextRoundButton.style.display = "block"
  resetButton.style.display = "block"
  startMatchButton.style.display = "none"
})

  
var cageMatch = function(leftCompetitor,rightCompetitor){
  //win factor adds more randomness so underdog can occasionally win
	var winFactor1 = leftCompetitor.strength + Math.floor(Math.random() * 10)
  var winFactor2 = Math.floor(rightCompetitor.strength + Math.random() * 10)
  if(winFactor1 !== winFactor2){
    return winFactor1 - winFactor2;
  } else {
    return cageMatch(leftCompetitor,rightCompetitor);
  }
}

var wrestlerLeft = document.querySelector(".wrestler-left")
var wrestlerRight = document.querySelector(".wrestler-right")
var wrestlerLeftState = {
  right: 0
}
var wrestlerRightState = {
  left: 0
}

//sets wrestlers position
var syncWrestlersState = function() {
  wrestlerLeft.style.right = wrestlerLeftState.right + "px"
  wrestlerRight.style.left = wrestlerRightState.left + "px"
}

//this is called so wrestlers start together when site loads
syncWrestlersState()

var winnerTauntNode = document.querySelector(".winner-taunt")
var checkWinCondition = function(leftPosition,rightPosition) {
  if (rightPosition >= 200) {
    console.log("leftWrestlerWins!")
    winnerTauntNode.innerHTML = wrestlers[0].taunt()
  } else if (leftPosition >= 200) {
    console.log("rightWrestlerWins!")
    winnerTauntNode.innerHTML = wrestlers[1].taunt()
  } else {
    return null;
  }
  winnerTauntNode.style.display = "block"
  wrestlerLeftNameNode.style.display = "none"
  wrestlerRightNameNode.style.display = "none"
}

nextRoundButton.addEventListener("click", function(){
  var matchResult = cageMatch(wrestlers[0],wrestlers[1])
  //multiplied so wrestlers move further per round
  wrestlerLeftState.right += matchResult * 10
  wrestlerRightState.left -= matchResult * 10
  syncWrestlersState()
  checkWinCondition(wrestlerLeftState.right,wrestlerRightState.left)
})

resetButton.addEventListener("click", function(){
  //fix this: rests everything, but is way too lengthy
  wrestlerLeftState.right = 0
  wrestlerRightState.left = 0
  syncWrestlersState()
  inputLeftName.style.opacity = 1
  inputRightName.style.opacity = 1
  wrestlerLeftNameNode.innerHTML = ""
  wrestlerRightNameNode.innerHTML = ""
  winnerTauntNode.style.display = "none"
  wrestlerLeftNameNode.style.display = "block"
  wrestlerRightNameNode.style.display = "block"
  nextRoundButton.style.display = "none"
  resetButton.style.display = "none"
  startMatchButton.style.display = "block"
  wrestlerImageLeft.src = ""
  wrestlerImageRight.src = ""
})