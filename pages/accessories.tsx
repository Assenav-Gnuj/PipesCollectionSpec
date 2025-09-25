import { GetServerSideProps } from 'next';

export default function AccessoriesRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/acessorios',
      permanent: true,
    },
  };
};