import React, { useState, useEffect, useRef } from "react";
import axios from "axios"

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [allQuestions, setAllQuestions] = useState(0);
  const [rightAnswers, setRightAnswers] = useState(0);
  const [difficulty, setDifficulty] = useState( localStorage.getItem("difficulty") || "easy" );

  const [questions, setQuestions] = useState([]);
  const stepperRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`
        );
        const data = await response.data;
  
        const formattedQuestions = data.results.map((question, index) => {
          const options = [...question.incorrect_answers, question.correct_answer];
          const randomizedOptions = shuffleArray(options);
  
          return {
            id: index + 1,
            question: question.question,
            options: randomizedOptions,
            answer: randomizedOptions.indexOf(question.correct_answer),
            selectedAnswer: undefined,
          };
        });
  
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    checkQuizPlayed();
    fetchQuestions();
  }, []);

  useEffect(() => {
    stepperRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentQuestion]);

  const checkQuizPlayed = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('token'));
      const userId = user ? user.user.id : null;

      const res = await axios.get(`http://localhost:3000/result?userId=${userId}`);
      if (res.data.length > 0) {
        setShowResult(true);
        setAllQuestions(res.data[0].totalQuestions);
        setRightAnswers(res.data[0].correctAnswers);

      }
    } catch (error) {
      console.error( error);
    }

  };

  const saveQuizResults = async () => {
    try {
      const totalQuestions = questions.length;
      const correctAnswers = questions.filter(
        (question) => question.selectedAnswer === question.answer
      ).length;

      const data = JSON.parse(localStorage.getItem('token'));
      const userId = data ? data.user.id : null;

      const response = await axios.post("http://localhost:3000/result", {
        userId,
        // answers: questions.map((question) => question.selectedAnswer),
        totalQuestions,
        correctAnswers,
        difficulty,
        questions: questions.map(
          ({ id, question, options, answer, selectedAnswer }) => ({
            id,
            question,
            options,
            // answer,
            selectedAnswer,
            correctAnswer: options[answer],
          })
        ),
      });


      console.log(response.data);
    } catch (error) {
      console.error( error);
    }
    checkQuizPlayed()
  };

  const deleteQuizResults = async (userId) => {
    try {
      const res = await axios.get('http://localhost:3000/result');
      const results = res.data;
      const getId = results.find((result) => result.userId === userId);

      const response = await axios.delete(`http://localhost:3000/result/${getId.id}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerSelect = (answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].selectedAnswer = answer;
    setQuestions(updatedQuestions);

  };

  const handleNextQuestion = () => {
    if (questions[currentQuestion].selectedAnswer === undefined) {
      return alert("please select answer");
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveQuizResults();
      setShowResult(true);
    }
  };

  const getIncorrectAnswers = () => {
    return questions.filter((question, index) => selectedAnswers[index] !== question.answer);
  };
  

  const handlePageRefresh = async () => {
    if (showResult) {
      setCurrentQuestion(0);
      setShowResult(false);
      try {
        const user = JSON.parse(localStorage.getItem('token'));
        const userId = user.user.id;
        

        await deleteQuizResults(userId);
      } catch (error) {
        console.error('Error deleting quiz results:', error);
      }

    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i]
      ];
    }
    return shuffledArray;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="max-w-xl">
        <h1 className="text-3xl mb-4 text-center font-bold text-white">
          Quiz App
        </h1>
        {!showResult ? (
          <div className="bg-white px-5 py-6 rounded-xl w-[600px]">
            <ol className="flex items-center w-full my-4">
              {questions.map((_, index) => (
                <li
                  key={index}
                  className="flex w-full"
                  id={`stepper-${index + 1}`}
                  ref={currentQuestion === index ? stepperRef : null}
                >
                  <span
                    className={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 dark:bg-gray-800 shrink-0 ${
                      currentQuestion === index
                        ? "bg-gray-800 dark:bg-gray-100 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                </li>
              ))}
            </ol>

            <h2 className="text-xl my-6  text-gray-900">
              {questions[currentQuestion]?.question}
            </h2>
            <div className="options-container">
              
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  className={`block w-full text-gray-200 rounded-lg px-4 py-2 my-2 transition-colors duration-300 ${
                    questions[currentQuestion].selectedAnswer === index
                      ? "bg-gray-900"
                      : "bg-gray-600 hover:bg-gray-900"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>
            <br />
              <button
              className="block w-full text-gray-200 bg-gray-800 hover:bg-gray-900 rounded-lg px-4 py-2 my-2 transition-colors duration-300"
              onClick={handleNextQuestion}
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        ) : (
          <div className="text-center w-[500px] mx-auto py-5  overflow-hidden text-sm font-medium text-gray-900 bg-gray-200 rounded-xl px-6">
            <h2 className="text-5xl mb-2 text-gray-800 py-5">Quiz Result</h2>
            <p className="text-2xl text-gray-600 mb-4 ">Total Questions: {allQuestions}</p>
            <p className="text-2xl text-gray-600 mb-4">Correct Answers: {rightAnswers}</p>
            <button
className="block w-full text-gray-200 bg-gray-800 hover:bg-gray-900 rounded-lg px-4 py-2 my-2 transition-colors duration-300"              onClick={handlePageRefresh}
            >
              Restart Quiz
            </button>
            {/* {getIncorrectAnswers().length > 0 && (
              <div>
                <h3 className="text-2xl text-black">Incorrect Answers:</h3>
                {getIncorrectAnswers().map((question) => (
                  <div key={question.id} className="text-white text-lg ">
                    <div className="bg-gray-900">
                    <p>{question.question}</p>
                    <p>Correct Answer: {question.options[question.answer]}</p>
                    <p>Your Answer: {question.options[selectedAnswers[question.id - 1]]}</p>
                    <br />
                    </div>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
