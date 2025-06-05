import '../public/style/App.scss';
import Layout from './layouts/Layout';
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <Layout>
      <AppRouter />
    </Layout>
  )
}

export default App