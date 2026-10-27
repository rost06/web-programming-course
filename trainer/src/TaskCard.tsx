import type { Task } from "./domain";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#fff" }}>
      <h3 style={{ color: "#555", fontSize: "14px", textTransform: "uppercase" }}>
        Тема: {task.topic}
      </h3>
      <p style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}>
        {task.text}
      </p>

      {/* Безопасный показ кода, если он есть */}
      {task.code && (
        <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px", overflowX: "auto" }}>
          {task.code}
        </pre>
      )}

      {/* проверяем kind */}
      {task.kind === "single-choice" ? (
        <ul style={{ marginTop: "15px", paddingLeft: "20px" }}>
          {task.options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#666", fontStyle: "italic", marginTop: "15px" }}>
          (Здесь будет поле для текстового ответа)
        </p>
      )}
    </div>
  );
}