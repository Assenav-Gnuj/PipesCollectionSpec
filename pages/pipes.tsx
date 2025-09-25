import { GetServerSideProps } from 'next';

export default function PipesRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/cachimbos',
      permanent: true,
    },
  };
};