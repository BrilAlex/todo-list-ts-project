import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {
  addTodoListTC, changeTodoListFilterAC,
  changeTodoListTitleTC,
  fetchTodoListsTC, FilterValueType, removeTodoListTC,
  TodoListDomainType
} from "./todoListsReducer";
import {addTaskTC, removeTaskTC, TasksType, updateTaskTC} from "./tasksReducer";
import React, {FC, useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/todoListsApi";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./ToDoList/TodoList";
import {Navigate} from "react-router-dom";

type PropsType = {
  demoMode?: boolean
};

export const TodoListsList: FC<PropsType> = ({demoMode = false}) => {
  const isLoggedIn = useSelector<AppStateType, boolean>(state => state.auth.isLoggedIn);
  const todoLists = useSelector<AppStateType, Array<TodoListDomainType>>(state => state.todoLists);
  const tasks = useSelector<AppStateType, TasksType>(state => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (demoMode || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodoListsTC());
  }, [dispatch, demoMode, isLoggedIn]);

  const addTask = useCallback((todoList_ID: string, title: string) => {
    dispatch(addTaskTC(todoList_ID, title));
  }, [dispatch]);

  const changeTaskTitle = useCallback((todoList_ID: string, task_ID: string, newTitle: string) => {
    dispatch(updateTaskTC(todoList_ID, task_ID, {title: newTitle}));
  }, [dispatch]);

  const changeTaskStatus = useCallback((todoList_ID: string, task_ID: string, newStatus: TaskStatuses) => {
    dispatch(updateTaskTC(todoList_ID, task_ID, {status: newStatus}));
  }, [dispatch]);

  const removeTask = useCallback((todoList_ID: string, task_ID: string) => {
    const thunk = removeTaskTC(todoList_ID, task_ID);
    dispatch(thunk);
  }, [dispatch]);

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodoListTC(title));
  }, [dispatch]);

  const changeTodoListTitle = useCallback((todoList_ID: string, newTitle: string) => {
    dispatch(changeTodoListTitleTC(todoList_ID, newTitle));
  }, [dispatch]);

  const changeFilter = useCallback((todoList_ID: string, filterValue: FilterValueType) => {
    dispatch(changeTodoListFilterAC(todoList_ID, filterValue));
  }, [dispatch]);

  const removeTodoList = useCallback((todoList_ID: string) => {
    dispatch(removeTodoListTC(todoList_ID));
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>;
  }

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm addItem={addTodoList}/>
      </Grid>
      <Grid container spacing={3}>
        {todoLists.map(tl => {
          return (
            <Grid key={tl.id} item>
              <Paper elevation={5} style={{padding: "15px"}}>
                <TodoList
                  todoList={tl}
                  tasks={tasks[tl.id]}
                  addTask={addTask}
                  changeTaskTitle={changeTaskTitle}
                  changeTodoListTitle={changeTodoListTitle}
                  changeTaskStatus={changeTaskStatus}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  removeTodoList={removeTodoList}
                  demoMode={demoMode}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
