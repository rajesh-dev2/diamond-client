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
import CasinoPage from '../pages/casino'

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
          <Route path="/casino-results/:gameId" element={<CasinoResults />} />
          <Route path="/live-casino-bets" element={<LiveCasinoBets />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/casino/:gameId" element={<CasinoPage />} />
          <Route path="/card32" element={<Navigate to="/casino/card32" replace />} />
          <Route path="/card32eu" element={<Navigate to="/casino/card32eu" replace />} />
          <Route path="/cards32" element={<Navigate to="/casino/card32" replace />} />
          <Route path="/cards32a" element={<Navigate to="/casino/card32" replace />} />
          <Route path="/cards32b" element={<Navigate to="/casino/card32eu" replace />} />
          <Route path="/lucky7" element={<Navigate to="/casino/lucky7" replace />} />
          <Route path="/lucky7eu" element={<Navigate to="/casino/lucky7eu" replace />} />
          <Route path="/lucky7eu2" element={<Navigate to="/casino/lucky7eu2" replace />} />
          <Route path="/casino-list/*" element={<Home />} />
          <Route path="/live-casino-list/*" element={<Home />} />
          <Route path="/sports-book/*" element={<Home />} />
          <Route path="/all-sports/*" element={<Home />} />
          <Route path="/slot-list" element={<Home />} />
          <Route path="/fantasy-list" element={<Home />} />
          <Route path="/aviator-list" element={<Home />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
