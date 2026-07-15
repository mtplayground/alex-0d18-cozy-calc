import { AppShell } from './components/AppShell';
import { useDocumentTitle } from './hooks/useDocumentTitle';

export function App() {
  useDocumentTitle('Calculator');

  return <AppShell />;
}
