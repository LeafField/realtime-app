import { NextPage } from 'next';
import { useEffect } from 'react';
import useStore from '../store';
import { supabase } from '../utils/supabase';
import { Layout } from '../components/Layout';
import { Auth } from '../components/Auth';
import { DashBoard } from '../components/DashBoard';

const Home: NextPage = () => {
  const { session, setSession } = useStore();

  useEffect(() => {
    const getSession = async () => {
      const { data: auth } = await supabase.auth.getSession();
      setSession(auth.session);
      supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
      });
    };
    getSession();
  }, [setSession]);

  return (
    <Layout title="Dashboard">{!session ? <Auth /> : <DashBoard />}</Layout>
  );
};

export default Home;
