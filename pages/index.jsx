import Head from "next/head";
import Landing from "../components/index-components/Landing";

export default function Home({ dummyUsers }) {
  return (
    <div>
      <Head>
        <title>Welcome</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing dummyUsers={dummyUsers} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const response = await fetch("https://reqres.in/api/users/", {
    method: "GET",
  });

  const data = await response.json();

  return {
    props: {
      dummyUsers: data,
    },
  };
}
