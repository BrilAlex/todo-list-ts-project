import React from 'react';
import './App.css';
import {TodoList} from "./components/ToDoList/TodoList";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {ButtonAppBar} from "./components/AppBar/ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListAC,
} from "./store/todoListsReducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./store/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store/store";

export type FilterValueType = "all" | "active" | "completed";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
};

export type TasksType = {
  [todoList_ID: string]: Array<TaskType>
}

export type TodoListType = {
  id: string
  title: string
  filter: FilterValueType
};

function App() {
  const todoLists = useSelector<AppStateType, Array<TodoListType>>(state => state.todoLists);
  const tasks = useSelector<AppStateType, TasksType>(state => state.tasks);
  const dispatch = useDispatch();

  const addTask = (todoList_ID: string, title: string) => {
    dispatch(addTaskAC(todoList_ID, title));
  };

  const changeTaskTitle = (todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatch(changeTaskTitleAC(todoList_ID, task_ID, newTitle));
  };

  const changeTaskStatus = (todoList_ID: string, task_ID: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC(todoList_ID, task_ID, isDone));
  };

  const removeTask = (todoList_ID: string, task_ID: string) => {
    dispatch(removeTaskAC(todoList_ID, task_ID));
  };

  const addTodoList = (title: string) => {
    dispatch(addTodoListAC(title));
  };

  const changeTodoListTitle = (todoList_ID: string, newTitle: string) => {
    dispatch(changeTodoListTitleAC(todoList_ID, newTitle));
  };

  const changeFilter = (todoList_ID: string, filterValue: FilterValueType) => {
    dispatch(changeTodoListFilterAC(todoList_ID, filterValue));
  };

  const removeTodoList = (todoList_ID: string) => {
    dispatch(removeTodoListAC(todoList_ID));
  };

  return (
    <div className="App">
      <ButtonAppBar/>
      <Container fixed>
        <Grid container style={{padding: "20px"}}>
          <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={3}>
          {todoLists.map(tl => {
            let tasksForTodoList = tasks[tl.id];

            if (tl.filter === "active") {
              tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
            }

            if (tl.filter === "completed") {
              tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
            }

            return (
              <Grid key={tl.id} item>
                <Paper elevation={5} style={{padding: "15px"}}>
                  <TodoList
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodoList}
                    filter={tl.filter}
                    addTask={addTask}
                    changeTaskTitle={changeTaskTitle}
                    changeTodoListTitle={changeTodoListTitle}
                    changeTaskStatus={changeTaskStatus}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    removeTodoList={removeTodoList}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
