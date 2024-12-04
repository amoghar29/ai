import { silentRefresh } from "@/store/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const RootWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(silentRefresh());
  }, [dispatch]);

  return <Outlet />;
};

export default RootWrapper;
