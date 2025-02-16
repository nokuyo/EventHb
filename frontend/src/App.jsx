import React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from "./components/Dashboard/"
import EventRegistration from "./components/EventRegistration.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
import Signup from "./components/Signup"
import Login from "./components/Login"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                <Route path="/" 
                        element={
                            <PrivateRoute>
                               <Dashboard/>
                            </PrivateRoute>
                        } 
                    ></Route>
                    <Route path="/dashboard" 
                        element={
                            <PrivateRoute>
                               <Dashboard/>
                            </PrivateRoute>
                        } 
                    ></Route>
                    <Route path="/event-registration" 
                        element={
                            <PrivateRoute>
                                <EventRegistration/>
                            </PrivateRoute>
                        }
                    ></Route>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;

