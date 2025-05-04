import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import About from './pages/About/About'
import FieldPage from './pages/FieldPage/FieldPage'
import Fields from './pages/Fields/Fields'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import NotFound from './pages/NotFound/NotFound'
import Profile from './pages/Profile/Profile'
import Register from './pages/Register/Register'
import PrivateRoute from './routes/PrivateRoute'

function App() {
	return (
		<Router>
			<div className='flex flex-col min-h-screen'>
				<Header />

				<main className='flex-grow'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route
							path='/profile'
							element={
								<PrivateRoute>
									<Profile />
								</PrivateRoute>
							}
						/>
						<Route path='/fields' element={<Fields />} />
						<Route path='/field/:placeId' element={<FieldPage />} />
						<Route path='/about' element={<About />} />
						<Route path='*' element={<NotFound />} />
					</Routes>
				</main>

				<Footer />
			</div>

			<ToastContainer position='top-right' autoClose={3000} />
		</Router>
	)
}

export default App
