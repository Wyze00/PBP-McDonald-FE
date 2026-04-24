import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks/useAppSelector';

export default function AdminMiddleware(): React.JSX.Element {
    const user  = useAppSelector((state) => state.user);

    if (user.role !== 'KITCHEN') {
        return (
            <Navigate to="/"/>
        );
    }

    return (
        <Outlet />
    );
}