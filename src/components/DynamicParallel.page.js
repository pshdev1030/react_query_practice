import { useQueries } from "react-query";
import axios from "axios";

const fetchSuperHeroes = (queryKey) => {
  const { id } = queryKey;
  return axios.get(`http://localhost:4000/superheroes/${id}`);
};

export const DynamicParallelPage = ({ heroIds }) => {
  const queryResults = useQueries(
    heroIds.map((id) => {
      return {
        queryKey: ["super-hero", id],
        queryFn: fetchSuperHeroes,
      };
    })
  );
  console.log(queryResults);
  return <div>ParallelQueriesPage</div>;
};
