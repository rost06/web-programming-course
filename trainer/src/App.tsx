import { useState } from "react";
import type { TrainingSet } from "./domain";
import { TaskList } from "./TaskList";
import { TaskCard } from "./TaskCard";

// Тестовые данные
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

export default function App() {

  const initialId = mainSet.tasks.length > 0 ? mainSet.tasks[0].id : null;
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialId);

  const currentTask = mainSet.tasks.find((task) => task.id === selectedTaskId);

  // интерфейс
  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1>{mainSet.title}</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Всего заданий: {mainSet.tasks.length}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
        {/* Левая колонка: Список заданий */}
        <aside>
          <h2>Список заданий</h2>
          <TaskList 
            tasks={mainSet.tasks} 
            selectedId={selectedTaskId} 
            onSelect={setSelectedTaskId} 
          />
        </aside>

        {/* Правая колонка: Карточка текущего задания */}
        <section>
          <h2>Текущее задание</h2>
          {currentTask ? (
            <TaskCard task={currentTask} />
          ) : (
            <p style={{ color: "#888" }}>Выберите задание из списка.</p>
          )}
        </section>
      </div>
    </main>
  );
}