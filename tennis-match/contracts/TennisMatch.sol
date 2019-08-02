pragma solidity >=0.4.21 <0.6.0;

contract TennisMatch {
  address public owner;

  uint8 public playerAScore = 0;
  uint8 public playerAGamesWon = 0;

  uint8 public playerBScore = 0;
  uint8 public playerBGamesWon = 0;


  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function addPoints(uint8 player) public onlyOwner {
    require(player <= 1);

    uint8 newScore;

    if (player == 0) {
      playerAScore += playerAScore < 30 ? 15 : 10;
      newScore = playerAScore;
    } else {
      playerBScore += playerBScore < 30 ? 15 : 10;
      newScore = playerBScore;
    }

    _maybeIncrementGame(player, newScore);
  }

  function _maybeIncrementGame(uint8 player, uint8 newScore) private {
    if (player == 0 && newScore == 50) {
      playerAGamesWon++;
      _resetScore();
    } else if (player == 1 && newScore == 50) {
      playerBGamesWon++;
      _resetScore();
    }
  }

  function resetGame() public onlyOwner {
    playerAGamesWon = 0;
    playerBGamesWon = 0;
    _resetScore();
  }

  function _resetScore() private {
    playerAScore = 0;
    playerBScore = 0;
  }
}