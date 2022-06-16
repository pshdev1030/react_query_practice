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
