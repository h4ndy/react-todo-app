import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import tick from "../assets/tick.png";
import not_tick from "../assets/not_tick.png";
import delete_icon from "../assets/delete.png";

const TodoItems = ({ text, id, isComplete, deleteTodo, toggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center my-1 py-2 gap-2 bg-white rounded-md ${
        isDragging ? "opacity-50 shadow-lg relative z-10" : ""
      }`}
    >
      {/* drag handle */}
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="text-slate-400 cursor-grab active:cursor-grabbing px-1 touch-none select-none"
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </button>

      <div
        onClick={() => {
          toggle(id);
        }}
        className="flex flex-1 items-center gap-2 cursor-pointer "
      >
        <img src={isComplete ? tick : not_tick} alt="" className="w-7" />
        <p
          className={
            isComplete
              ? "text-slate-700 ml-4 text-[17px] line-through"
              : "text-slate-700 ml-4 text-[17px]"
          }
        >
          {text}
        </p>
      </div>

      <div>
        <img
          src={delete_icon}
          alt=""
          className="w-3.5 cursor-pointer"
          onClick={() => {
            deleteTodo(id);
          }}
        />
      </div>
    </div>
  );
};

export default TodoItems;
