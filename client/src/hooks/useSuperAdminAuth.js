import { useContext } from "react";
import SuperAdminAuthContext from "../context/SuperAdminAuthContext";

const useSuperAdminAuth = () => useContext(SuperAdminAuthContext);

export default useSuperAdminAuth;
