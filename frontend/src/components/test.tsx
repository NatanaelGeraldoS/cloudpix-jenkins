import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/actions/dataActions";
import { RootState, AppDispatch } from "../redux/store";
import { useEffect } from "react";

const DataComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch here
  const data = useSelector((state: RootState) => state.data.items);
  const loading = useSelector((state: RootState) => state.data.loading);
  const error = useSelector((state: RootState) => state.data.error);

  useEffect(() => {
    dispatch(fetchData()); // Now dispatch is correctly typed
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <ul>
        {data.map((item: any, index: any) => (
          <li key={index}>{item.name}</li> // Adjust `item.name` if needed
        ))}
      </ul>
    </div>
  );
};

export default DataComponent;
