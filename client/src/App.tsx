import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Policy from "./pages/Policy";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider switchable>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/privacy">
            <Policy kind="privacy" />
          </Route>
          <Route path="/accessibility">
            <Policy kind="accessibility" />
          </Route>
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
