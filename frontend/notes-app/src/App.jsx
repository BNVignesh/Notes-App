import React from 'react'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

const routes=(
  <Router>
  <Routes>
    <Route path='/dashboard' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<SignUp/>}/>
  </Routes>

  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
