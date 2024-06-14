import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Employee } from "@/types/app.types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    //some basic good to have standard axios practice to avoid component mounting and states side-effects
    let isMounted = true;
    const controller = new AbortController();
    console.log("emp component mounted");
    const getEmployees = async () => {
      try {
        const response = await axiosPrivate.get("/employees", {
          signal: controller.signal,
        });
        //ensuring component is mounted and all good to set the states that is to be used by the compoenent
        isMounted && setEmployees(response.data);
      } catch (err: any) {
        console.log("error fetching employees", err);
        if (err.code !== "ERR_CANCELED") {
          //here the refresh token is expire and user must login again
          //the below code just ensures on log back in user return to same page/route this component exists
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    //make call to get daya
    getEmployees();

    //basic cleanup on component unmount to avoid any pending req and drop/cancel them imediately
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div>
      <h3>Employees</h3>
      {employees?.length > 0 ? (
        <ul>
          {employees?.map((emp: Employee) => (
            <li
              key={emp?.email}
            >{`name:${emp?.firstname}, email:${emp?.email}`}</li>
          ))}
        </ul>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Employees;
