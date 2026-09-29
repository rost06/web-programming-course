import type { TrainingSet, Answer } from "./domain";
import { findTaskById, filterTasksByTopic, calculateProgress } from "./domain";

// тесты данные 

const mainSet: TrainingSet = {
  id: "set-1",
  title: "Основы TypeScript и React",
  tasks: [
    {
      id: "ts-1",
      kind: "single-choice",
      topic: "TypeScript",
      text: "Какой тип описывает значение",
      options: ["string | number", "string & number", "any"],
    },
    {
      id: "react-1",
      kind: "short-text",
      topic: "React",
      text: "Напишите название хука ",
      
    },
  ],
};

const secondSet: TrainingSet = {
  id: "set-2",
  title: "CSS и вёрстка",
  tasks: [
    {
      id: "css-1",
      kind: "single-choice",
      topic: "CSS",
      text: "Какое свойство меняет цвет текста",
      options: ["color", "background"],
    },
  ],
};

const emptySet: TrainingSet = {
  id: "set-empty",
  title: "Пустой набор",
  tasks: [],
};

// массив ответов юзера
const userAnswers: Answer[] = [
  { taskId: "ts-1", kind: "single-choice", optionId: "string | number" }, 
  { taskId: "react-1", kind: "short-text", text: "   " },                
  { taskId: "unknown-999", kind: "short-text", text: "Лишний ответ" },   
];

// проверка 

console.log("ПОИСК (findTaskById)");
console.log("Найден ts-1:", findTaskById(mainSet, "ts-1")?.id); 
console.log("Несуществующий id:", findTaskById(mainSet, "missing")); 

console.log("\nФИЛЬТР (filterTasksByTopic)");
console.log("Фильтр 'TypeScript':", filterTasksByTopic(mainSet, "TypeScript").length, "шт."); 
console.log("Фильтр 'JavaScript' (нет совпадений):", filterTasksByTopic(mainSet, "JavaScript").length, "шт."); 
console.log("Фильтр в пустом наборе:", filterTasksByTopic(emptySet, "CSS").length, "шт."); 

console.log("\nПРОГРЕСС (calculateProgress)");

console.log("Прогресс основного набора:", calculateProgress(mainSet, userAnswers)); 

console.log("Прогресс пустого набора:", calculateProgress(emptySet, [])); 

console.log("\nПРОВЕРКА ЧИСТОТЫ (Данные не изменились)");
console.log("Длина исходного mainSet.tasks:", mainSet.tasks.length);
console.log("Длина исходного userAnswers:", userAnswers.length); 