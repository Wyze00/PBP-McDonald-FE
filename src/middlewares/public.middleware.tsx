import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks/useAppSelector';

export default function PublicRoute(): React.JSX.Element {
    const user  = useAppSelector((state) => state.user);

    if (user.username !== '') {
        return (
            <Navigate to={`/${user.role.toLowerCase()}`}/>
        );
    }

    return (
        <Outlet />
    );
}