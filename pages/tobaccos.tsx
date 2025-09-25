import { GetServerSideProps } from 'next';

export default function TobaccosRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/tabacos',
      permanent: true,
    },
  };
};