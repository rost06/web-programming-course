// типы 
export type SingleChoiceTask = {
  id: string;
  kind: "single-choice";
  topic: string;
  text: string;
  options: string[];
  code?: string; 
};

export type ShortTextTask = {
  id: string;
  kind: "short-text";
  topic: string;
  text: string;
  code?: string;
};


export type Task = SingleChoiceTask | ShortTextTask;

// типы для ответов
export type ChoiceAnswer = {
  taskId: string;
  kind: "single-choice";
  optionId: string;
};

export type TextAnswer = {
  taskId: string;
  kind: "short-text";
  text: string;
};

export type Answer = ChoiceAnswer | TextAnswer;

//тип для набора
export type TrainingSet = {
  id: string;
  title: string;
  tasks: Task[];
};


// поиск задания
export function findTaskById(set: TrainingSet, id: string): Task | undefined {
  return set.tasks.find((task) => task.id === id);
}

// фильтрация заданий
export function filterTasksByTopic(set: TrainingSet, topic: string): Task[] {
  const lowerTopic = topic.toLowerCase();
  return set.tasks.filter((task) => task.topic.toLowerCase().includes(lowerTopic));
}

// подсчет прогресса
export function calculateProgress(set: TrainingSet, answers: Answer[]): { filled: number; total: number } {
  const total = set.tasks.length;
  
  const filled = set.tasks.filter((task) => {
    // ищем ответ
    const answer = answers.find((a) => a.taskId === task.id);
    
    // если ответа нет задание не заполнено
    if (!answer) return false;

    // если задание текстовое проверяем что на пробелы
    if (task.kind === "short-text" && answer.kind === "short-text") {
      return answer.text.trim() !== ""; 
    }
    
    
    return true;
  }).length;

  return { filled, total };
}


