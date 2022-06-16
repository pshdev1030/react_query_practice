import { useQuery } from "react-query";
import axios from "axios";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  const onSuccess = (data) => {
    console.log("Perfome side effect after data fetching", data);
  };

  const onError = (err) => {
    console.log("Perfome side effect after encountering error", err);
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "super-heroes",
    fetchSuperHeroes,
    {
      onSuccess,
      onError,
      // refetchOnMount: true,
      // refetchOnWindowFocus: true,
      // staleTime: 10000,
      // cacheTime: 5000,
    }
  );

  console.log(isLoading, isFetching);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      {data?.data.map((hero) => {
        return <div key={hero.name}>{hero.name}</div>;
      })}
    </>
  );
};
