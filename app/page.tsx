"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Question = {
  id: number;
  text: string;
  options: { value: string; label: string }[];
  correctAnswer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the primary gas that makes up the Earth's atmosphere?",
    options: [
      { value: "Oxygen", label: "Oxygen" },
      { value: "Carbon Dioxide", label: "Carbon Dioxide" },
      { value: "Nitrogen", label: "Nitrogen" },
      { value: "Argon", label: "Argon" },
    ],
    correctAnswer: "Nitrogen",
  },
  {
    id: 2,
    text: "What is the name for the study of stars, planets, and the universe?",
    options: [
      { value: "Geology", label: "Geology" },
      { value: "Meteorology", label: "Meteorology" },
      { value: "Astronomy", label: "Astronomy" },
      { value: "Oceanography", label: "Oceanography" },
    ],
    correctAnswer: "Astronomy",
  },
  {
    id: 3,
    text: "Why does the sky appear blue during the day?",
    options: [
      {
        value: "The atmosphere absorbs all other colors of light.",
        label: "The atmosphere absorbs all other colors of light.",
      },
      {
        value: "Water vapor in the atmosphere is naturally blue.",
        label: "Water vapor in the atmosphere is naturally blue.",
      },
      {
        value: "It is an optical illusion.",
        label: "It is an optical illusion.",
      },
      {
        value: "Rayleigh scattering of sunlight by gas molecules.",
        label: "Rayleigh scattering of sunlight by gas molecules.",
      },
    ],
    correctAnswer: "Rayleigh scattering of sunlight by gas molecules.",
  },
  {
    id: 4,
    text: "What type of cloud is associated with thunderstorms and heavy rain?",
    options: [
      { value: "Cirrus", label: "Cirrus" },
      { value: "Cumulonimbus", label: "Cumulonimbus" },
      { value: "Stratus", label: "Stratus" },
      { value: "Cumulus", label: "Cumulus" },
    ],
    correctAnswer: "Cumulonimbus",
  },
  {
    id: 5,
    text: "What celestial body is a natural satellite of the Earth?",
    options: [
      { value: "Mars", label: "Mars" },
      { value: "The Sun", label: "The Sun" },
      { value: "The Moon", label: "The Moon" },
      { value: "Jupiter", label: "Jupiter" },
    ],
    correctAnswer: "The Moon",
  },
];

type Screen = "frontpage" | "question1" | "question2" | "question3" | "question4" | "question5" | "results";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("frontpage");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [`q${questionId}`]: value }));
  };

  const calculateScore = () => {
    let newScore = 0;
    QUESTIONS.forEach(question => {
      if (answers[`q${question.id}`] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  const navigateTo = (screen: Screen) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsAnimating(false);
      if (screen === "results") {
        calculateScore();
      }
    }, 300);
  };

  const resetQuiz = () => {
    setAnswers({});
    setScore(0);
    navigateTo("frontpage");
  };

  const getScreenTransform = () => {
    const transforms: Record<Screen, string> = {
      frontpage: currentScreen === "frontpage" ? "translate-y-0" : "translate-y-[800px]",
      question1: currentScreen === "question1" ? "translate-y-0" : 
                 currentScreen === "frontpage" ? "-translate-y-[700px]" : "translate-y-[700px]",
      question2: currentScreen === "question2" ? "translate-y-0" : 
                 currentScreen === "question1" ? "translate-y-[700px]" : "-translate-y-[700px]",
      question3: currentScreen === "question3" ? "translate-y-0" : 
                 currentScreen === "question2" ? "translate-y-[700px]" : "-translate-y-[700px]",
      question4: currentScreen === "question4" ? "translate-y-0" : 
                 currentScreen === "question3" ? "translate-y-[700px]" : "-translate-y-[700px]",
      question5: currentScreen === "question5" ? "translate-y-0" : 
                 currentScreen === "question4" ? "translate-y-[700px]" : "-translate-y-[700px]",
      results: currentScreen === "results" ? "translate-y-0" : "translate-y-[900px]",
    };
    return transforms;
  };

  const transforms = getScreenTransform();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[url('/sky.png')] bg-cover bg-no-repeat">
      {/* Clouds */}
      <div className="absolute inset-0 z-0">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className={`absolute scale-40 ${getCloudPosition(num)}`}
          >
            <Image
              src={`/cloud/c${num}.png`}
              alt={`Cloud ${num}`}
              width={300}
              height={150}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Front Page */}
      <div
        className={`absolute w-full h-full z-10 transition-transform duration-1000 ease-in-out ${transforms.frontpage}`}
      >
        <div className="text-center pt-20">
          <h1 className="text-[10rem] text-yellow-400 font-pixelify font-bold text-shadow-custom">
            Quiz
          </h1>
          <h1 className="text-[10rem] text-yellow-400 font-pixelify font-bold text-shadow-custom -mt-[130px]">
            Competition
          </h1>
          <div className="relative -bottom-[200px] left-[480px] w-fit">
            <Image
              src="/start.png"
              alt="Start Quiz"
              width={200}
              height={100}
              className="scale-150 hover:scale-180 transition-transform duration-300 cursor-pointer"
              onClick={() => navigateTo("question1")}
            />
          </div>
        </div>
      </div>

      {/* Question Screens */}
      {QUESTIONS.map((question, index) => (
        <div
          key={question.id}
          className={`absolute left-[300px] top-[200px] w-[900px] h-[500px] z-10 text-center transition-transform duration-1000 ease-in-out ${
            transforms[`question${question.id}` as Screen]
          }`}
        >
          <div className="relative w-full h-full">
            <h2 className="absolute scale-45 text-yellow-400 font-pixelify font-bold text-shadow-custom top-[20px] left-[380px]">
              Question {question.id}
            </h2>
            <p className="absolute scale-25 font-pixelify text-black text-shadow-white top-[150px] left-[200px] w-[600px]">
              {question.text}
            </p>
            <div className="absolute scale-25 font-pixelify text-black text-shadow-white top-[250px] left-[200px] space-y-4">
              {question.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                >
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value={option.value}
                    checked={answers[`q${question.id}`] === option.value}
                    onChange={() => handleAnswer(question.id, option.value)}
                    className="w-4 h-4"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            
            {/* Back Button */}
            {question.id > 1 && (
              <div className="absolute -left-[280px] bottom-0">
                <Image
                  src="/back.png"
                  alt="Back"
                  width={100}
                  height={100}
                  className="scale-100 hover:scale-120 transition-transform duration-300 cursor-pointer"
                  onClick={() => navigateTo(`question${question.id - 1}` as Screen)}
                />
              </div>
            )}
            
            {/* Home Button for Question 1 */}
            {question.id === 1 && (
              <div className="absolute -left-[280px] bottom-0">
                <Image
                  src="/back.png"
                  alt="Home"
                  width={100}
                  height={100}
                  className="scale-100 hover:scale-120 transition-transform duration-300 cursor-pointer"
                  onClick={() => navigateTo("frontpage")}
                />
              </div>
            )}
            
            {/* Next/Finish Button */}
            <div className="absolute left-[580px] bottom-0">
              <Image
                src={question.id === 5 ? "/finish.png" : "/next.png"}
                alt={question.id === 5 ? "Finish" : "Next"}
                width={100}
                height={100}
                className="scale-100 hover:scale-120 transition-transform duration-300 cursor-pointer"
                onClick={() => 
                  question.id === 5 
                    ? navigateTo("results") 
                    : navigateTo(`question${question.id + 1}` as Screen)
                }
              />
            </div>
          </div>
        </div>
      ))}

      {/* Results Page */}
      <div
        className={`absolute w-full h-full z-10 transition-transform duration-1000 ease-in-out ${transforms.results}`}
        onClick={resetQuiz}
      >
        <div className="absolute left-[300px] top-[-150px] p-8 text-center">
          <h2 className="text-[10rem] font-bold text-gray-600 mb-4 relative -top-[-150px]">
            Quiz Results
          </h2>
          <p className="text-[45rem] text-[#FED200] relative -bottom-[-200px]">
            {score}
          </p>
          {/* <div className="absolute scale-10 -left-[3300px] transform -translate-y-[1000px]">
          <Image
            src="/background 1.png"
            alt="Background"
            width={1920}
            height={2080}
            className="object-contain"
          />
        </div> */}
        </div>
        
        <div className="absolute scale-100 -left-[0px] transform -translate-y-[-500px] z-[1]">
          <Image
            src="/background 1.png"
            alt="Background"
            width={1920}
            height={1080}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function getCloudPosition(num: number): string {
  const positions: Record<number, string> = {
    1: "top-[100px] left-[-180px]",
    2: "top-[90px] left-[230px]",
    3: "top-[90px] left-[530px]",
    4: "top-[300px] left-[-230px]",
    5: "top-[300px] left-[730px]",
    6: "top-[180px] left-[730px]",
  };
  return positions[num] || "";
}