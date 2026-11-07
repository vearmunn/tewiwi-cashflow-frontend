
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import supabase from '../api/supabase';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data, error }) => {
            if (!active) return;

            setSession(error ? null : data.session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div className='h-screen w-screen items-center mx-auto'><LoadingSpinner /></div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <Outlet />
        </div>
    );
}

