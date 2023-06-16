// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuthContext from "../hooks/useAuthContext";

// const RequiredAuth = () =>
// {
//     const { auth } = useAuthContext();
//     const location = useLocation();

//     return (
//         auth?.user
//             ? <Outlet />
//             : <Navigate to="/sign-in" state={{ from: location }} replace />
//     );
// }
// export default RequiredAuth;