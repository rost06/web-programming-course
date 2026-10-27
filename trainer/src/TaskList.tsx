import type { Task } from "./domain";

type TaskListProps = {
  tasks: Task[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function TaskList({ tasks, selectedId, onSelect }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>В этом модуле пока нет заданий.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {tasks.map((task) => (
        <button
          key={task.id} 
          onClick={() => onSelect(task.id)}
          style={{
            padding: "12px",
            textAlign: "left",
            border: selectedId === task.id ? "2px solid #007bff" : "1px solid #ccc",
            borderRadius: "6px",
            background: selectedId === task.id ? "#e7f1ff" : "#fff",
            cursor: "pointer",
            fontWeight: selectedId === task.id ? "bold" : "normal",
          }}
        >
          {task.topic}: {task.text.substring(0, 30)}...
        </button>
      ))}
    </div>
  );
}