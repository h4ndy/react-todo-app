import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import todo_icon from "../assets/todo_icon.png";
import TodoGroup from "./TodoGroup";

const DEFAULT_GROUP = { id: "default", name: "Umum" };
const GROUP_PREFIX = "group-";

const Todo = () => {
  const [todoList, setTodoList] = useState(() =>
    (localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
    ).map((todo) => ({ groupId: DEFAULT_GROUP.id, ...todo }))
  );
  const [groups, setGroups] = useState(() =>
    localStorage.getItem("groups")
      ? JSON.parse(localStorage.getItem("groups"))
      : [DEFAULT_GROUP]
  );
  const [selectedGroup, setSelectedGroup] = useState(DEFAULT_GROUP.id);
  const inputRef = useRef();
  const groupInputRef = useRef();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //add task
  const addTask = () => {
    const inputText = inputRef.current.value.trim();

    if (inputText === "") {
      return null;
    }

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
      groupId: selectedGroup,
    };

    setTodoList((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
  };

  //delete task
  const deleteTodo = (id) => {
    setTodoList((prvTodos) => {
      return prvTodos.filter((todo) => todo.id !== id);
    });
  };

  // toggle
  const toggle = (id) => {
    setTodoList((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    });
  };

  //edit task
  const editTodo = (id, newText) => {
    const text = newText.trim();
    if (text === "") return;

    setTodoList((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  //add group
  const addGroup = () => {
    const name = groupInputRef.current.value.trim();

    if (name === "") {
      return null;
    }

    const newGroup = { id: String(Date.now()), name };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroup(newGroup.id);
    groupInputRef.current.value = "";
  };

  //rename group
  const renameGroup = (groupId, newName) => {
    const name = newName.trim();
    if (name === "") return;

    setGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, name } : group))
    );
  };

  //delete group, its tasks move to the default group
  const deleteGroup = (groupId) => {
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.groupId === groupId ? { ...todo, groupId: DEFAULT_GROUP.id } : todo
      )
    );
    if (selectedGroup === groupId) {
      setSelectedGroup(DEFAULT_GROUP.id);
    }
  };

  // group id of a droppable: either a group container or a task
  const findGroupId = (id) => {
    if (typeof id === "string" && id.startsWith(GROUP_PREFIX)) {
      return id.slice(GROUP_PREFIX.length);
    }
    return todoList.find((todo) => todo.id === id)?.groupId;
  };

  // move task to another group while dragging
  const handleDragOver = ({ active, over }) => {
    if (!over) return;

    const activeGroup = findGroupId(active.id);
    const overGroup = findGroupId(over.id);
    if (!overGroup || activeGroup === overGroup) return;

    setTodoList((prev) => {
      const activeTodo = prev.find((todo) => todo.id === active.id);
      const rest = prev.filter((todo) => todo.id !== active.id);
      const moved = { ...activeTodo, groupId: overGroup };

      let insertAt;
      const overIndex = rest.findIndex((todo) => todo.id === over.id);
      if (overIndex >= 0) {
        const translated = active.rect.current.translated;
        const isBelow =
          translated && translated.top > over.rect.top + over.rect.height / 2;
        insertAt = overIndex + (isBelow ? 1 : 0);
      } else {
        // dropped on the group container: put it after the group's last task
        const lastIndex = rest.findLastIndex(
          (todo) => todo.groupId === overGroup
        );
        insertAt = lastIndex >= 0 ? lastIndex + 1 : rest.length;
      }

      return [...rest.slice(0, insertAt), moved, ...rest.slice(insertAt)];
    });
  };

  // reorder task within its group
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setTodoList((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === active.id);
      const newIndex = prev.findIndex((todo) => todo.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // save to local storage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  return (
    <div
      className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7
    min-h-[550px] rounded-xl"
    >
      {/* ----- title ---- */}
      <div className="flex items-center mt-7 gap-2">
        <img className="w-8 h-8" src={todo_icon} alt="" />
        <h1 className="text-3xl font-semibold">To-Do List</h1>
      </div>

      {/* ------ input ----- */}
      <div className="flex items-center mt-7 mb-3 bg-gray-200 rounded-full">
        <input
          ref={inputRef}
          className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
          type="text"
          placeholder="Add your task"
        />
        <button
          onClick={addTask}
          className="border-none round-full bg-orange-600 text-white text-lg font-medium cursor-pointer h-14 w-32 rounded-full"
        >
          Add +
        </button>
      </div>

      {/* ------ group controls ----- */}
      <div className="flex items-center gap-2 mb-7 text-sm">
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-gray-200 rounded-full h-9 px-3 outline-none"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <input
          ref={groupInputRef}
          className="bg-gray-200 rounded-full h-9 px-3 outline-none flex-1 min-w-0 placeholder:text-slate-600"
          type="text"
          placeholder="New group"
        />
        <button
          onClick={addGroup}
          className="border border-orange-600 text-orange-600 rounded-full h-9 px-3 font-medium"
        >
          + Group
        </button>
      </div>

      {/* ----- Todo List ----- */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <TodoGroup
              key={group.id}
              group={group}
              todos={todoList.filter((todo) => todo.groupId === group.id)}
              deleteGroup={group.id === DEFAULT_GROUP.id ? null : deleteGroup}
              renameGroup={renameGroup}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              toggle={toggle}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Todo;
