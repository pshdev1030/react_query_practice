import useSuperHeroesData from "../hooks/useSuperHeroesData";

const onSuccess = (data) => {
  console.log("Perfome side effect after data fetching", data);
};

const onError = (err) => {
  console.log("Perfome side effect after encountering error", err);
};

export const RQSuperHeroesPage = () => {
  const { isLoading, isError, error, data } = useSuperHeroesData(
    onSuccess,
    onError
  );
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      {/* {data?.data.map((hero) => {
        return <div key={hero.name}>{hero.name}</div>;
      })} */}

      {data.map((heroName) => {
        return <div key={heroName}>{heroName}</div>;
      })}
    </>
  );
};
