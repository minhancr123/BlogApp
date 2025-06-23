import ClientPage from "./ClientPage";

export default function Page(props: { params: any }) {
  const username = (props.params as { username: string }).username;
  return <ClientPage username={username} />;
}
