import type { GetServerSideProps } from 'next';

/**
 * A listagem de comunidades virou `/comunidades`. O caminho antigo continua
 * respondendo para não quebrar links já compartilhados.
 */
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: '/comunidades', permanent: false },
});

const Dashboard = () => null;

export default Dashboard;
