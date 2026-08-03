import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import Task from '../pages/Task'
import Expenses from '../pages/Expenses'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/Tasks" element={<Task />} />
          <Route path="/Expenses" element={<Expenses />} /> 
          <Route path="/settings" element={<Settings />} /> 
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}