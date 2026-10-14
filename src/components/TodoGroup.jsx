import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TodoItems from "./TodoItems";

const TodoGroup = ({
  group,
  todos,
  deleteGroup,
  renameGroup,
  deleteTodo,
  editTodo,
  toggle,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: `group-${group.id}` });
  const doneCount = todos.filter((todo) => todo.isComplete).length;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(group.name);

  const startEdit = () => {
    setDraft(group.name);
    setIsEditing(true);
  };

  const saveEdit = () => {
    renameGroup(group.id, draft);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 p-3 transition-colors ${
        isOver ? "border-orange-400 bg-orange-50" : "border-gray-200"
      }`}
    >
      {/* ----- group header ----- */}
      <div className="flex items-center justify-between gap-2 mb-1">
        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="flex-1 min-w-0 bg-gray-100 rounded-md px-2 py-0.5 outline-none font-semibold text-slate-800 focus:ring-2 focus:ring-orange-400"
          />
        ) : (
          <h2 className="font-semibold text-slate-800">
            {group.name}{" "}
            <span className="text-sm font-normal text-slate-500">
              ({doneCount}/{todos.length})
            </span>
          </h2>
        )}
        {!isEditing && (
          <div className="flex items-center gap-3">
            <button
              onClick={startEdit}
              className="text-xs text-slate-400 hover:text-orange-600"
            >
              Ubah nama
            </button>
            {deleteGroup && (
              <button
                onClick={() => deleteGroup(group.id)}
                className="text-xs text-slate-400 hover:text-red-600"
              >
                Hapus grup
              </button>
            )}
          </div>
        )}
      </div>

      {/* ----- group items ----- */}
      <SortableContext
        items={todos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        {todos.length === 0 ? (
          <p className="text-sm text-slate-400 py-3 text-center">
            Seret task ke sini
          </p>
        ) : (
          todos.map((item) => (
            <TodoItems
              key={item.id}
              text={item.text}
              id={item.id}
              isComplete={item.isComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              toggle={toggle}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
};

export default TodoGroup;
