import { useQuery } from "react-query";
import axios from "axios";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

const useSuperHeroesData = (onSuccess, onError, ...option) => {
  return useQuery("super-heroes", fetchSuperHeroes, {
    onSuccess,
    onError,
    select: (data) => {
      const superHeroNames = data.data.map((hero) => hero.name);
      return superHeroNames;
    },
    ...option,
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
    // staleTime: 10000,
    // cacheTime: 5000,
  });
};

export default useSuperHeroesData;
