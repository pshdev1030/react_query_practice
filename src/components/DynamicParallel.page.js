import { useQueries } from "react-query";
import axios from "axios";

const fetchSuperHeroes = (id) => {
  return axios.get(`http://localhost:4000/superheroes/${id}`);
};

export const DynamicParallelPage = ({ heroIds }) => {
  const queryResults = useQueries(
    heroIds.map((id) => {
      return {
        queryKey: ["super-hero", id],
        queryFn: () => fetchSuperHeroes(id),
      };
    })
  );
  console.log(queryResults);
  return <div>ParallelQueriesPage</div>;
};
