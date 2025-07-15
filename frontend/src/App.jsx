import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LandingPage from './pages/LandingPage';
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import AuthLayout from "./components/AuthLayout";

import InterviewRoom from './pages/InterviewRoom';
import Feedback from './pages/Feedback';
import History from './pages/History';
import Scores from './pages/Scores';
import Dashboard from "./pages/dashboard"


const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	if (!isAuthenticated) return <Navigate to='/login' replace />;
	if (!user.isVerified) return <Navigate to='/verify-email' replace />;
	return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	if (isAuthenticated && user.isVerified) return <Navigate to='/main' replace />;
	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<>
			<Routes>
				<Route path='/' element={<LandingPage />} />

				<Route
					path="/main"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/interview/:id"
					element={
						<ProtectedRoute>
							<InterviewRoom />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/feedback/:id"
					element={
						<ProtectedRoute>
							<Feedback />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/history/:id"
					element={
						<ProtectedRoute>
							<History />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/scores"
					element={
						<ProtectedRoute>
							<Scores />
						</ProtectedRoute>
					}
				/>


				<Route
					path='/main1'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>

				{/* Auth Pages with background layout */}
				<Route
					path='/signup'
					element={
						<AuthLayout>
							<RedirectAuthenticatedUser>
								<SignUpPage />
							</RedirectAuthenticatedUser>
						</AuthLayout>
					}
				/>
				<Route
					path='/login'
					element={
						<AuthLayout>
							<RedirectAuthenticatedUser>
								<LoginPage />
							</RedirectAuthenticatedUser>
						</AuthLayout>
					}
				/>
				<Route
					path='/forgot-password'
					element={
						<AuthLayout>
							<RedirectAuthenticatedUser>
								<ForgotPasswordPage />
							</RedirectAuthenticatedUser>
						</AuthLayout>
					}
				/>
				<Route
					path='/reset-password/:token'
					element={
						<AuthLayout>
							<RedirectAuthenticatedUser>
								<ResetPasswordPage />
							</RedirectAuthenticatedUser>
						</AuthLayout>
					}
				/>
				<Route
					path='/verify-email'
					element={
						<AuthLayout>
							<EmailVerificationPage />
						</AuthLayout>
					}
				/>

				{/* Catch-all redirect */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
