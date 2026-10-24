import { CanvasProvider } from './state/CanvasContext.jsx';
import Layout from './components/Layout.jsx';
import Canvas from './components/canvas/Canvas.jsx';

export default function App() {
  return (
    <CanvasProvider>
      <Layout>
        <Canvas />
      </Layout>
    </CanvasProvider>
  );
}
