import { AppProvider } from './state/AppContext.jsx';
import Layout from './components/Layout.jsx';
import Wizard from './components/wizard/Wizard.jsx';

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Wizard />
      </Layout>
    </AppProvider>
  );
}
