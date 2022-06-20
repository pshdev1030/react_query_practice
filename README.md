멋쟁이토마토 토마토

# 1. Introduction

React Query에 대해 간단하게 알아보자

## What?

React Query는 React에 적용할 수 있는 data fetching 라이브러리이다.

## Why

1. React는 ui 라이브러리이기 때문에 data fetching에 정형화된 패턴이 없다.

2. 때문에 useEffect를 사용하여 data를 fetching하고 loading, error, result와 같은 상태를 나타내기 위해 useState를 사용한다.

3. 만약 data가 어플리케이션 전체에서 필요하다면, 상태관리 라이브러리 사용을 고려해보아야 한다.

4. 대부분의 상태관리 라이브러리는 클라이언트 상태 관리에 적합하다.
   ex) 테마나 모달 열고 닫는 것 처럼

5. 상태관리 라이브러리는 비동기나 서버 상태 관리에는 그다지 적합하지 않다.

## Client vs Server

Client State와 Server State는 다음과 같은 특징이 있다.

### Client State

app memory에 저장(유지) 되고 접근이나 업데이트가 동기화된다.

### Server state

database에 연결되어 유지되며 fetching이나 업데이트를 위해 비동기 API 필요

### 결론

이러한 차이 때문에 Server State가 Client 모르게 업데이트 되어 Client State가 Server State가 동기화되지 않을 수 있다.

이러한 차이는 캐싱, 중복된 데이터에 대한 요청 제어, 백그라운드에서의 state 업데이트, 성능개선(페이지네이션, lazy loading)에 대해 여러 도전 과제를 제공한다. 이것들을 도와주는 라이브러리가 react query이다.

# 2 Project Setup

프로젝트를 위한 기본 셋업을 하였다.

useState와 useEffect를 이용한 기본적인 Server State 관리하는 코드를 작성하였다.

```js
import { useState, useEffect } from "react";
import axios from "axios";

export const SuperHeroesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/superheroes").then((res) => {
      setData(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h2>Super Heroes Page</h2>
      {data.map((hero) => {
        return <div>{hero.name}</div>;
      })}
    </>
  );
};
```

# 3 Fetching Data with useQuery

## 3-1 설치하기

```
npm i react-query
```

## 3-2 적용하기

어플리케이션을 QueryClientProvider로 랩핑 해주어야 한다.

```jsx
import { QueryClientProvider, QueryClient } from "react-query";

function App() {
  return <QueryClientProvider>...</QueryClientProvider>;
}
```

이후 QueryClient의 인스턴스를 생성한다.

```jsx
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

데이터가 필요한 컴포넌트에서 react-query가 제공하는 useQuery hook을 호출한다.

useQuery hook은 두 가지 parameter를 받는다.
첫 번째 parameter는 useQuery가 가질 고유한 key이다.
두 번쨰 함수는 fetch하는데에 사용할 callback function이다.

useQuery는 loading과 error같은 Server State를 포함한 객체를 반환한다.

구조분해 할당을 통해 필요한 값만 가져오면 된다.

```jsx
import { useQuery } from "react-query";
import axios from "axios";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  const { isLoading, data } = useQuery("super-heroes", fetchSuperHeroes);

  if (isLoading) {
    return <h2>Loading...</h2>;
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
```

`2`의 코드에 비해 관심사가 잘 분리되었으며 컴포넌트의 코드도 깔끔해졌음을 알 수 있다.

# 4 Handling Query Error

useEffect와 useState를 이용하여 에러를 처리하는 방식(패턴)은 보통 다음과 같이 작성된다.

useState를 이용하여 에러 상태(error)를 정의하고 useEffect의 fetch 부분에서 catchblock을 통해 에러가 발생했을 경우 loading과 error를 설정해준다.

```jsx
import { useState, useEffect } from "react";
import axios from "axios";

export const SuperHeroesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/superheroes")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
      <h2>Super Heroes Page</h2>
      {data.map((hero) => {
        return <div>{hero.name}</div>;
      })}
    </>
  );
};
```

react-query가 제공하는 useQuery의 반환객체는 error도 가지고 있다.

이를 구조분해 할당을 통해 가져온다.

error 객체와 error의 발생여부를 가져오면 된다.

뿐만 아니라 요청에 실패했을 경우 react-query에서 자동으로 다시 fetch한다.

```js
import { useQuery } from "react-query";
import axios from "axios";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  const { isLoading, data, isError, error } = useQuery(
    "super-heroes",
    fetchSuperHeroes
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
      {data?.data.map((hero) => {
        return <div key={hero.name}>{hero.name}</div>;
      })}
    </>
  );
};
```

# 5. React Query Devtools

react query는 디버깅 도구를 제공한다.

열려있는 초기상태롣 되어있을지와 위치등 속성을 지정할 수 있다.

```jsx
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      // ...
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
```

# 6. Query Cache

기본적으로 모든 쿼리 요청은 5분씩 캐싱된다.

때문에 네트워크로의 요청을 줄일 수 있다.

또한 매번 요청을 받아오게 되면 로딩창을 보아야하는데, 캐시해둔 데이터를 보여주고 업데이트 사항은 백그라운드에서 받아와 변경사항만 적용하기 때문에 더 좋은 유저 경험을 제공한다.

서버에 요청해서 데이터를 가져왔는지 여부는 useQuery에서 반환되는 객체의 `isFetching` 속성을 통해 확인할 수 있다.

`isFetching`이 false일 경우 캐시된 데이터를 가져온 것이다.

또한 디버깅 도구에서 캐시에 대한 정보도 확인할 수 있으며 캐시 정책 또한 지정할 수 있다.

캐시 정책을 지정하는 방법은 useQuery의 3번쨰 option parameter를 통해 전달할 수 있다.

```js
export const RQSuperHeroesPage = () => {
  const { isLoading, data, isError, error } = useQuery(
    "super-heroes",
    fetchSuperHeroes,
    {
      cacheTime: 5000,
    }
  );
  // ...
};
```

쿼리가 활성화되어 있을 경우 Observer를 통해 캐시를 유지한다.

캐시가 활성화 상태에서 벗어날 경우 GC의 대상이 되며 cacheTime(5000ms) 뒤에 캐시도 삭제된다.

# 7 Stale Time

react query는 기본적으로 불러온 데이터를 Stale하지 않다고 생각한다.

Stale 하다는 것은 변경대상이 아니라는 것이다. 즉 제일 최신의 데이터라는 의미이다.

이는 useQuery의 3번째 parameter인 option 객체의 staleTime 속성으로 제어한다.

staleTime으로 설정한 시간만큼 데이터가 최신의(신선한) 데이터라고 간주한다.

이 시간이 지나면 변경(refetch)이 필요한 데이터로 간주하기 때문에 같은 데이터를 필요로 할 때 api 요청을 다시 할 수 밖에 없다.

그러나 staleTime을 길게 주어도 저장되는 시간인 cacheTime이 짧다면 데이터가 사라지기 때문에 다시 요청을 해야 한다.

react query의 useQuery의 3번째 option 객체의 staleTime 기본값은 0이고 cacheTime은 5분이다.

```js
const { isLoading, data, isError, error } = useQuery(
  "super-heroes",
  fetchSuperHeroes,
  {
    staleTime: 10000,
    cacheTime: 5000,
  }
);
```

이런 경우 staleTime은 10초로 데이터를 fetch하고 staleTime 내에는 다시 데이터를 불러오더라도 isLoading과 isFetching 모두 false이다.( 즉 서버에 데이터를 요청하지 않고 캐시된 데이터를 신뢰하여 가져온다.)

staleTime이 지나 다시 query에 접근할 경우 데이터를 실제로 요청하기 때문에 isLoading은 false, isFetching은 true가 되어 실제 데이터를 요청하여 다시 캐시한다.

정리하자면 다음과 같은 세 가지 상태를 갖는다.

| isLoading | isFetching | 상태                                            |
| --------- | ---------- | ----------------------------------------------- |
| true      | true       | 캐시가 없어서 서버로부터 전달받은 데이터를 반환 |
| false     | false      | 캐시된 데이터를 반환                            |
| false     | true       | 서버로부터 전달받은 데이터로 재 캐시하여 반환   |

# 8 Refetch Defaults

useQuery의 세 번째 parameter인 option엔 refetchOnMount와 refetchOnWindowFocus 옵션도 있다.

refetchOnMount는 데이터가 stale 상태일 경우 마운트 시 마다 refetch를 실행하는 옵션이다.

기본값은 true이며 always로 설정하면 stale 상태와 상관없이 마운트 시 마다 매번 refetch를 실행한다.

refetchOnWindowFocus는 데이터가 stale 상태일 경우 윈도우가 포커싱 될 때 마다 refetch를 실행하는 옵션이다.

다른 탭을 눌렀다가 다시 돌아왔을 때, 혹은 개발자 도구를 포커싱 하다가 페이지 내부를 다시 포커싱 했을 경우에 해당한다.

마찬가지로 기본값은 true이며 always로 설정하면 stale 상태와 상관없이 윈도우 포커싱마다 refetch를 실행한다.

```js
const { isLoading, data, isError, error, isFetching } = useQuery(
  "super-heroes",
  fetchSuperHeroes,
  {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  }
);
```

# 9 Polling

Polling은 일정 주기마다 데이터를 refetch 하는 것을 의미한다.

Server State와 Client State가 동기화 되어야 할 경우 사용한다.

마찬가지로 useQuery의 option 객체에 refetchInterval 속성을 통해 설정할 수 있다. 기본값은 false이며 정수값(ms)을 가진다.

refetchIntervalInBackground 속성은 브라우저가 focus 되어있지 않아도 주기적으로 데이터를 refetch하는 옵션이다.

기본값은 false이다.

```js
const { isLoading, data, isError, error, isFetching } = useQuery(
  "super-heroes",
  fetchSuperHeroes,
  {
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  }
);
```

# 10 useQuery on Click

useQuery의 option에 enable속성을 false로 하여 이벤트가 발생할 때에만 데이터를 불러오도록 할 수 있다.

useQuery의 결과 객체의 refetch를 통해서 원하는 시점에 데이터를 불러올 수 있다.

```js
const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
  "super-heroes",
  fetchSuperHeroes,
  {
    enabled: false,
  }
);
```

# 11 Success and Error callbacks

useQuery의 option에 onSuccess, onError속성에 callback function을 전달하여, 각각 fetch 성공, 실패 시 실행할 callback function을 전달할 수 있다. callback function의 parameter는 각각 response, error 객체이다.

```js
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
```

# 12 Data Transformation

프론트와 백엔드에는 각자 다른 컨벤션을 가지고 있는 경우가 있다.

프론트엔드에 필요한 데이터를 위해 서버에서 받은 response를 가공하는 과정이 필요하다.

react query에서는 이를 위한 option을 제공한다.

select를 사용하여 필요한 데이터를 필터링할 수 있다.

```js
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
      select: (data) => {
        const superHeroNames = data.data.map((hero) => hero.name);
        return superHeroNames;
      },
    }
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
```

# 13 Custom Query Hook

큰 규모의 어플리케이션을 위해서 재사용 할 수 있는 react query hook을 만들면 좋다.

useSuperHeroesData 라는 커스텀 훅을 만들어 다른 컴포넌트에서도 재사용 할 수 있도록 하였다.

```js
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
```

# 14 Query by Id

useQuery에는 동적 query Key도 제공할 수 있다.

또한 이 동적 query Key를 observer를 통해 캐싱한다.

```js
import axios from "axios";
import { useQuery } from "react-query";

const fetchSuperHero = ({ queryKey }) => {
  // queryKey === ['super-hero',heroId];
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId) => {
  return useQuery(["super-hero", heroId], fetchSuperHero);
};
```
