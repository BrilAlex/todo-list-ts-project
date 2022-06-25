import React, {useEffect} from 'react';
import './App.css';
import {ButtonAppBar} from "../components/AppBar/ButtonAppBar";
import {CircularProgress, Container} from "@mui/material";
import {TodoListsList} from "../features/TodoListsList/TodoListsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Auth/Login";
import {useSelector} from "react-redux";
import {selectAppIsInitialized} from "../features/Application/selectors";
import {useActions} from "../utils/reduxUtils";
import {appActions} from "../features/Application";



type PropsType = {
  demoMode?: boolean
};

function App({demoMode = false}: PropsType) {
  const isInitialized = useSelector(selectAppIsInitialized);
  const {initializeApp} = useActions(appActions);

  useEffect(() => {
    if (!demoMode) {
      initializeApp();
    }
  }, [initializeApp, demoMode]);

  if (!isInitialized) {
    return (
      <div style={{position: "fixed", top: "30%", width: "100%", textAlign: "center"}}>
        <CircularProgress/>
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar/>
      <ButtonAppBar/>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodoListsList demoMode={demoMode}/>}/>
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/error404"} element={<h1>Error 404: Page not found</h1>}/>
          <Route path={"*"} element={<Navigate to={"/error404"}/>}/>
        </Routes>
      </Container>
    </div>
  );
}

export default App;
