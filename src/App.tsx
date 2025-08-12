import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Brain, Star, Play, RotateCcw } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correct: number;
};

type Player = {
  name: string;
  score: number;
  color: string;
};

type GameState = 'setup' | 'playing' | 'results';

const QUIZ_QUESTIONS: Question[] = [
  {
    question: "Which famous play features a character named Romeo?",
    options: ["Hamlet", "Romeo and Juliet", "Macbeth", "Othello"],
    correct: 1
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue whale", "Giraffe", "Hippo"],
    correct: 1
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Onion", "Avocado", "Pepper"],
    correct: 2
  },
  {
    question: "Who is known as the \"Father of the United States\"?",
    options: ["Thomas Jefferson", "George Washington", "Benjamin Franklin", "John Adams"],
    correct: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh"],
    correct: 2
  },
  {
    question: "What is the name of the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
    correct: 1
  },
  {
    question: "What famous music group was John Lennon a part of?",
    options: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Queen"],
    correct: 1
  },
  {
    question: "In the story of Snow White, how many dwarfs are there?",
    options: ["Five", "Six", "Seven", "Eight"],
    correct: 2
  },
  {
    question: "Who is the king of the gods in Greek mythology?",
    options: ["Apollo", "Zeus", "Poseidon", "Hades"],
    correct: 1
  },
  {
    question: "What do bees collect to make honey?",
    options: ["Pollen", "Nectar", "Water", "Sap"],
    correct: 1
  },
  {
    question: "In what galaxy is our solar system located?",
    options: ["Andromeda", "Milky Way", "Orion", "Pegasus"],
    correct: 1
  },
  {
    question: "Which planet is known as the \"Blue Planet\"?",
    options: ["Mars", "Venus", "Neptune", "Earth"],
    correct: 3
  },
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  {
    question: "How many sides does a triangle have?",
    options: ["2", "3", "4", "5"],
    correct: 1
  },
  {
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Horse", "Leopard"],
    correct: 1
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correct: 2
  },
  {
    question: "What is 5 + 7?",
    options: ["10", "11", "12", "13"],
    correct: 2
  },
  {
    question: "Which season comes after winter?",
    options: ["Summer", "Spring", "Fall", "Autumn"],
    correct: 1
  }
];

const PLAYER_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
];

export default function QuizGame() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameProgress, setGameProgress] = useState(0);

  // Timer effect for questions
  useEffect(() => {
    if (gameState === 'playing' && !showAnswer && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showAnswer) {
      handleAnswer(null);
    }
  }, [timeLeft, gameState, showAnswer]);

  // Update game progress
  useEffect(() => {
    if (gameState === 'playing') {
      const totalQuestions = gameQuestions.length * players.length;
      const currentQuestion = currentQuestionIndex * players.length + currentPlayerIndex + 1;
      setGameProgress((currentQuestion / totalQuestions) * 100);
    }
  }, [currentQuestionIndex, currentPlayerIndex, players.length, gameQuestions.length, gameState]);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      setPlayers([...players, {
        name: newPlayerName.trim(),
        score: 0,
        color: PLAYER_COLORS[players.length]
      }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (players.length >= 2) {
      const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 8);
      setGameQuestions(shuffled);
      setGameState('playing');
      setCurrentPlayerIndex(0);
      setCurrentQuestionIndex(0);
      setTimeLeft(15);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (answerIndex === gameQuestions[currentQuestionIndex].correct) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 1;
      setPlayers(updatedPlayers);
    }
  };

  const nextQuestion = () => {
    if (currentPlayerIndex < players.length - 1) {
      // Next player's turn
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else if (currentQuestionIndex < gameQuestions.length - 1) {
      // Next question, first player
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentPlayerIndex(0);
    } else {
      // Game over
      setGameState('results');
      return;
    }
    
    setShowAnswer(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCurrentQuestionIndex(0);
    setGameQuestions([]);
    setTimeLeft(15);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setGameProgress(0);
  };

  const getSortedPlayers = () => {
    return [...players].sort((a, b) => b.score - a.score);
  };

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
        <div className="container mx-auto max-w-2xl pt-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Brain className="h-16 w-16 text-purple-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">Quiz Masters</h1>
            <p className="text-xl text-white/90">Local Multiplayer Trivia Fun!</p>
          </div>

          <Card className="shadow-xl quiz-card quiz-entrance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Add Players (2-8 players)
              </CardTitle>
              <CardDescription>
                Enter player names to join the quiz battle!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Enter player name..."
                  maxLength={20}
                />
                <Button 
                  onClick={addPlayer} 
                  disabled={!newPlayerName.trim() || players.length >= 8}
                >
                  Add
                </Button>
              </div>

              {players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Players ({players.length}):</h3>
                  <div className="flex flex-wrap gap-2">
                    {players.map((player, index) => (
                      <Badge 
                        key={index} 
                        className={`${player.color} text-white cursor-pointer hover:opacity-80`}
                        onClick={() => removePlayer(index)}
                      >
                        {player.name} ✕
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {players.length >= 2 && (
                <Button 
                  onClick={startGame} 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Quiz Game!
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing') {
    const currentPlayer = players[currentPlayerIndex];
    const currentQuestion = gameQuestions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
        <div className="container mx-auto max-w-4xl pt-4">
          {/* Game Progress */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Game Progress</span>
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {gameQuestions.length}
              </span>
            </div>
            <Progress value={gameProgress} className="h-2" />
          </div>

          {/* Current Player */}
          <div className="text-center mb-6">
            <div className={`inline-block ${currentPlayer.color} rounded-full px-6 py-3 shadow-lg`}>
              <span className="text-white font-bold text-xl">{currentPlayer.name}'s Turn</span>
            </div>
          </div>

          {/* Timer */}
          {!showAnswer && (
            <div className="text-center mb-6">
              <div className={`inline-block px-4 py-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-orange-500'} text-white font-bold`}>
                Time: {timeLeft}s
              </div>
            </div>
          )}

          {/* Question Card */}
          <Card className="shadow-xl mb-6 quiz-card quiz-entrance">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "h-16 text-lg justify-start";
                  
                  if (showAnswer) {
                    if (index === currentQuestion.correct) {
                      buttonClass += " bg-green-500 hover:bg-green-500 text-white";
                    } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correct) {
                      buttonClass += " bg-red-500 hover:bg-red-500 text-white";
                    }
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={`${buttonClass} quiz-button ${showAnswer && index === currentQuestion.correct ? 'quiz-correct' : ''} ${showAnswer && index === selectedAnswer && selectedAnswer !== currentQuestion.correct ? 'quiz-incorrect' : ''}`}
                      onClick={() => !showAnswer && handleAnswer(index)}
                      disabled={showAnswer}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)})</span>
                      {option}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Button */}
          {showAnswer && (
            <div className="text-center">
              <Button onClick={nextQuestion} size="lg" className="bg-green-600 hover:bg-green-700">
                {currentPlayerIndex < players.length - 1 ? 'Next Player' : 
                 currentQuestionIndex < gameQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </div>
          )}

          {/* Score Board */}
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Current Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {players.map((player, index) => (
                  <div key={index} className={`${player.color} rounded-lg p-3 text-white text-center`}>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-xl">{player.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const sortedPlayers = getSortedPlayers();
    const winner = sortedPlayers[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4">
        <div className="container mx-auto max-w-3xl pt-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Trophy className="h-16 w-16 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Game Over!</h1>
            <div className={`${winner.color} rounded-lg p-6 mx-auto max-w-sm shadow-lg`}>
              <Star className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-white mb-2">
                🏆 {winner.name} Wins!
              </h2>
              <p className="text-white text-lg">
                Score: {winner.score} / {gameQuestions.length}
              </p>
            </div>
          </div>

          <Card className="shadow-xl mb-6 quiz-card quiz-entrance">
            <CardHeader>
              <CardTitle className="text-center">Final Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div key={index} className={`${player.color} rounded-lg p-4 text-white flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">#{index + 1}</span>
                      <span className="text-xl font-semibold">{player.name}</span>
                    </div>
                    <div className="text-xl font-bold">
                      {player.score} / {gameQuestions.length}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={resetGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
