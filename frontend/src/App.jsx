import React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from "./components/Dashboard/"
import EventRegistration from "./components/EventRegistration.jsx"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/event-registration" element={<EventRegistration/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;