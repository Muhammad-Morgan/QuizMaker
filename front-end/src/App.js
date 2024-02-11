import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Alert from "./components/Alert";
import Nav from "./components/Nav";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Createquiz from "./pages/Createquiz";
import Allquizes from "./pages/Allquizes";
import Singlequiz from "./pages/Singlequiz";
import Results from "./pages/Results";
import About from "./pages/About";
function App() {
  return (
    <>
      <Router>
        <main>
          <Nav />
          <Alert />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/createquiz' element={<Createquiz />} />
            <Route path='/allquizes' element={<Allquizes />} />
            <Route path='/about' element={<About />} />
            <Route path='/results/:id' element={<Results />} />
            <Route path='/quizez/:id' element={<Singlequiz />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
