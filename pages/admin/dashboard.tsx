import { GetServerSideProps } from 'next';

export default function DashboardRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/admin',
      permanent: true,
    },
  };
};