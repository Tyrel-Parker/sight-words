import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Home, Play, BookOpen, Trash2 } from 'lucide-react';
import { wordLists, gradeOrder, getCombinedWordList, getWordsByGrade } from './words.jsx';

const SightWordsApp = () => {

  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'game', 'highscores', 'nameEntry', 'review'
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gameWords, setGameWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [highScores, setHighScores] = useState({});
  const [completionTime, setCompletionTime] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [currentScore, setCurrentScore] = useState(null);
  const [isEditingHighScores, setIsEditingHighScores] = useState(false);
  const nameInputRef = useRef(null);

  // Load high scores and last selected grade from localStorage on component mount
  useEffect(() => {
    const savedScores = {};
    gradeOrder.forEach(grade => {
      try {
        const stored = localStorage?.getItem(`highScores_${grade}`);
        savedScores[grade] = stored ? JSON.parse(stored) : [];
      } catch (e) {
        savedScores[grade] = [];
      }
    });
    setHighScores(savedScores);

    // Load last selected grade
    try {
      const lastSelectedGrade = localStorage?.getItem('lastSelectedGrade');
      if (lastSelectedGrade && gradeOrder.includes(lastSelectedGrade)) {
        setSelectedGrade(lastSelectedGrade);
      }
    } catch (e) {
      // Handle localStorage not available
    }
  }, []);

  // Save selected grade to localStorage whenever it changes
  useEffect(() => {
    if (selectedGrade) {
      try {
        localStorage?.setItem('lastSelectedGrade', selectedGrade);
      } catch (e) {
        // Handle localStorage not available
      }
    }
  }, [selectedGrade]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (currentView === 'game' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [currentView, startTime]);

  // Focus name input when entering name entry view
  useEffect(() => {
    if (currentView === 'nameEntry' && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [currentView]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}.${centiseconds.toString().padStart(2, '0')}s`;
  };

  const startGame = () => {
    if (!selectedGrade) return;
    
    const words = getCombinedWordList(selectedGrade);
    if (words.length === 0) {
      alert('No words available for this grade level yet.');
      return;
    }
    
    setGameWords(words);
    setCurrentWordIndex(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCurrentView('game');
  };

  const startGameFromHighScores = (grade) => {
    setSelectedGrade(grade);
    const words = getCombinedWordList(grade);
    if (words.length === 0) {
      alert('No words available for this grade level yet.');
      return;
    }
    
    setGameWords(words);
    setCurrentWordIndex(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCurrentScore(null); // Clear previous score when starting new game
    setCurrentView('game');
  };

  // Improved navigation functions with debouncing to prevent double-firing
  const goToNextWord = useCallback((e) => {
    // Prevent any default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Debounce to prevent rapid multiple calls
    const now = Date.now();
    if (goToNextWord.lastCall && now - goToNextWord.lastCall < 200) {
      return;
    }
    goToNextWord.lastCall = now;

    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Game completed
      const finalTime = Date.now() - startTime;
      setCompletionTime(finalTime);
      checkHighScore(finalTime);
    }
  }, [currentWordIndex, gameWords.length, startTime]);

  const goToPrevWord = useCallback((e) => {
    // Prevent any default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Debounce to prevent rapid multiple calls
    const now = Date.now();
    if (goToPrevWord.lastCall && now - goToPrevWord.lastCall < 200) {
      return;
    }
    goToPrevWord.lastCall = now;

    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  }, [currentWordIndex]);

  const goToMenu = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Debounce to prevent rapid multiple calls
    const now = Date.now();
    if (goToMenu.lastCall && now - goToMenu.lastCall < 200) {
      return;
    }
    goToMenu.lastCall = now;

    setCurrentView('menu');
  }, []);

  const checkHighScore = (finalTime) => {
    const gradeScores = highScores[selectedGrade] || [];
    const newScore = {
      name: '',
      date: new Date().toLocaleDateString(),
      wordsCompleted: gameWords.length,
      timeCompleted: finalTime
    };

    setCurrentScore(newScore);

    // Check if this is a top 5 score
    if (gradeScores.length < 5 || finalTime < gradeScores[gradeScores.length - 1]?.timeCompleted) {
      setCurrentView('nameEntry');
    } else {
      // Not a high score, go directly to high scores view to show comparison
      setCurrentView('highscores');
    }
  };

  const saveHighScore = () => {
    if (!playerName.trim()) return;

    const newScore = {
      name: playerName.trim(),
      date: new Date().toLocaleDateString(),
      wordsCompleted: gameWords.length,
      timeCompleted: completionTime
    };

    const gradeScores = [...(highScores[selectedGrade] || [])];
    gradeScores.push(newScore);
    gradeScores.sort((a, b) => a.timeCompleted - b.timeCompleted);
    gradeScores.splice(5); // Keep only top 5

    const newHighScores = { ...highScores };
    newHighScores[selectedGrade] = gradeScores;
    setHighScores(newHighScores);

    // Save to localStorage
    try {
      localStorage.setItem(`highScores_${selectedGrade}`, JSON.stringify(gradeScores));
    } catch (e) {
      // Handle localStorage not available
    }

    // Update current score with name and go to high scores
    setCurrentScore(newScore);
    setPlayerName('');
    setCurrentView('highscores');
  };

  const deleteHighScore = (grade, scoreIndex) => {
    const gradeScores = [...(highScores[grade] || [])];
    gradeScores.splice(scoreIndex, 1);
    
    const newHighScores = { ...highScores };
    newHighScores[grade] = gradeScores;
    setHighScores(newHighScores);

    // Save to localStorage
    try {
      localStorage.setItem(`highScores_${grade}`, JSON.stringify(gradeScores));
    } catch (e) {
      // Handle localStorage not available
    }
  };

  const MenuView = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Sight Words</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Select Grade Level:</label>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose a grade...</option>
              {gradeOrder.filter(grade => {
                const words = getCombinedWordList(grade);
                return words.length > 0;
              }).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {selectedGrade && (
            <div className="text-center text-gray-600 space-y-1">
              <p className="text-sm">
                <span className="font-medium text-blue-600">{wordLists[selectedGrade]?.length || 0}</span> new words in {selectedGrade}
              </p>
              <p className="text-base font-medium">
                <span className="text-green-600">{getCombinedWordList(selectedGrade).length}</span> total words to practice
              </p>
            </div>
          )}

          <button
            onClick={startGame}
            disabled={!selectedGrade}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Play size={24} />
            Start Practice
          </button>

          <button
            onClick={() => setCurrentView('review')}
            disabled={!selectedGrade}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen size={24} />
            Review Words
          </button>

          <button
            onClick={() => setCurrentView('highscores')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trophy size={24} />
            High Scores
          </button>
        </div>
      </div>
    </div>
  );

  const GameView = () => {
    const currentWord = gameWords[currentWordIndex];
    const progressPercent = Math.round(((currentWordIndex + 1) / gameWords.length) * 100);

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-green-400 to-blue-500 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-3 md:p-4 bg-white bg-opacity-20 flex-shrink-0">
          <div className="text-white font-bold text-base md:text-lg">
            {currentWordIndex + 1}/{gameWords.length}
          </div>
          <div className="text-white font-bold text-lg md:text-xl">
            {progressPercent}%
          </div>
          <div className="text-white font-bold text-base md:text-lg">
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Word Card - Takes remaining space */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl aspect-[4/3] flex items-center justify-center">
            <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-gray-800 leading-none text-center px-4 py-4 break-words">
              {currentWord}
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Single event handler to prevent double-firing */}
        <div className="flex justify-between items-center p-4 md:p-6 flex-shrink-0 pb-safe">
          <button
            type="button"
            onClick={goToPrevWord}
            disabled={currentWordIndex === 0}
            className="nav-button nav-button-white text-white p-4 md:p-5 rounded-full"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              border: 'none'
            }}
          >
            <ChevronLeft size={28} className="md:w-8 md:h-8" />
          </button>

          <button
            type="button"
            onClick={goToMenu}
            className="nav-button nav-button-red text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold flex items-center gap-2"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              border: 'none'
            }}
          >
            <Home size={20} className="md:w-6 md:h-6" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <button
            type="button"
            onClick={goToNextWord}
            className="nav-button nav-button-white text-white p-4 md:p-5 rounded-full"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              border: 'none'
            }}
          >
            <ChevronRight size={28} className="md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    );
  };

  const HighScoresView = () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">High Scores</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditingHighScores(!isEditingHighScores)}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  isEditingHighScores 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {isEditingHighScores ? 'Done Editing' : 'Edit'}
              </button>
              <button
                onClick={() => {
                  setCurrentScore(null);
                  setIsEditingHighScores(false);
                  setCurrentView('menu');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>

          {/* Show current score comparison if available */}
          {currentScore && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">🎯 Your Recent Score</h2>
              <div className="bg-yellow-100 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-800">
                    {currentScore.name || 'Your Score'} - {selectedGrade}
                  </div>
                  <div className="text-sm text-gray-600">{currentScore.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{formatTime(currentScore.timeCompleted)}</div>
                  <div className="text-sm text-gray-600">{currentScore.wordsCompleted} words</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {gradeOrder.filter(grade => {
              const words = getCombinedWordList(grade);
              return words.length > 0;
            }).map(grade => (
              <div key={grade} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{grade}</h2>
                  <button
                    onClick={() => startGameFromHighScores(grade)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                    title={`Challenge ${grade}`}
                  >
                    <Play size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(highScores[grade] || []).map((score, index) => {
                    // Check if this score matches the current score
                    const isCurrentScore = currentScore && 
                      grade === selectedGrade && 
                      score.timeCompleted === currentScore.timeCompleted &&
                      score.name === currentScore.name &&
                      score.date === currentScore.date;
                    
                    return (
                      <div 
                        key={index} 
                        className={`rounded-lg p-3 flex justify-between items-center ${
                          isCurrentScore 
                            ? 'bg-green-100 border-2 border-green-400' 
                            : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className={`font-bold ${isCurrentScore ? 'text-green-800' : 'text-gray-800'}`}>
                            #{index + 1} {score.name}
                            {isCurrentScore && ' 🎉'}
                          </div>
                          <div className="text-sm text-gray-600">{score.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`font-bold ${isCurrentScore ? 'text-green-600' : 'text-blue-600'}`}>
                              {formatTime(score.timeCompleted)}
                            </div>
                            <div className="text-sm text-gray-600">{score.wordsCompleted} words</div>
                          </div>
                          {isEditingHighScores && (
                            <button
                              onClick={() => deleteHighScore(grade, index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors flex items-center justify-center"
                              title="Delete this score"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {(!highScores[grade] || highScores[grade].length === 0) && (
                    <div className="text-center text-gray-500 py-4">No scores yet!</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ReviewWordsView = () => {
    const combinedWords = getCombinedWordList(selectedGrade);
    const wordsByGrade = getWordsByGrade(selectedGrade);
    
    // Sort all combined words alphabetically (case-insensitive)
    const sortedCombinedWords = [...combinedWords].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-purple-500 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{selectedGrade} Words</h1>
                <p className="text-lg text-gray-600">{combinedWords.length} words (alphabetical)</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => startGameFromHighScores(selectedGrade)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                  title={`Challenge ${selectedGrade}`}
                >
                  <Play size={20} />
                  Practice
                </button>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="bg-white rounded-lg p-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {sortedCombinedWords.join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">💡 Parent Tip</h3>
              <p className="text-green-700">
                These sight words are high-frequency words that children encounter often in reading. 
                Mastering them helps improve reading fluency and comprehension. Practice regularly 
                and celebrate progress!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NameEntryView = () => (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h1>
        <p className="text-lg text-gray-600 mb-6">
          You made it to the top 5 for {selectedGrade}!
        </p>
        <p className="text-md text-gray-600 mb-6">
          Time: {formatTime(completionTime)} | Words: {gameWords.length}
        </p>
        
        <div className="space-y-4">
          <input
            ref={nameInputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && playerName.trim() && saveHighScore()}
            placeholder="Enter your name"
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            maxLength={20}
            autoFocus
          />
          
          <div className="flex gap-4">
            <button
              onClick={saveHighScore}
              disabled={!playerName.trim()}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Save Score
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans w-screen overflow-x-hidden">
      {currentView === 'menu' && <MenuView />}
      {currentView === 'game' && <GameView />}
      {currentView === 'highscores' && <HighScoresView />}
      {currentView === 'review' && <ReviewWordsView />}
      {currentView === 'nameEntry' && <NameEntryView />}
    </div>
  );
};

export default SightWordsApp;