import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Layout from '../../layout/Layout'

export const RequireAuth = (children: any) => {
    const location = useLocation()
    const auth = useAuth()
    
    if (!auth.isAuthenticated) {
        return <Navigate to='/' state={{ path: location.pathname }} />
    }
    return <Layout>{children}</Layout>
}
