import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TodoItems from "./TodoItems";

const TodoGroup = ({ group, todos, deleteGroup, deleteTodo, toggle }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `group-${group.id}` });
  const doneCount = todos.filter((todo) => todo.isComplete).length;

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 p-3 transition-colors ${
        isOver ? "border-orange-400 bg-orange-50" : "border-gray-200"
      }`}
    >
      {/* ----- group header ----- */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-slate-800">
          {group.name}{" "}
          <span className="text-sm font-normal text-slate-500">
            ({doneCount}/{todos.length})
          </span>
        </h2>
        {deleteGroup && (
          <button
            onClick={() => deleteGroup(group.id)}
            className="text-xs text-slate-400 hover:text-red-600"
          >
            Hapus grup
          </button>
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
              toggle={toggle}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
};

export default TodoGroup;
