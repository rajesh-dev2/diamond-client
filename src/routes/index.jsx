import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layout'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/home'
import Login from '../pages/login'
import GameDetails from '../pages/game-details'
import AccountStatement from '../pages/account-statement'
import CurrentBets from '../pages/current-bets'
import ActivityLog from '../pages/activity-log'
import CasinoResults from '../pages/casino-results'
import LiveCasinoBets from '../pages/live-casino-bets'
import ChangePassword from '../pages/change-password'
import ResponsibleGaming from '../pages/responsible-gaming'
import Terms from '../pages/terms'
import NotFound from '../pages/not-found'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/terms-and-conditions" element={<Terms />} />
      <Route path="/responsible-gaming" element={<ResponsibleGaming />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game-details/:sportId/:eventId" element={<GameDetails />} />
          <Route path="/account-statement" element={<AccountStatement />} />
          <Route path="/current-bet" element={<CurrentBets />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/casino-results" element={<CasinoResults />} />
          <Route path="/live-casino-bets" element={<LiveCasinoBets />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
