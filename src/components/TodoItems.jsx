
import tick from "../assets/tick.png";
import not_tick from "../assets/not_tick.png";
import delete_icon from "../assets/delete.png";

const TodoItems = ({ text, id, isComplete, deleteTodo, toggle }) => {
  return (
    <div className="flex items-center my-3 gap-2">
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
