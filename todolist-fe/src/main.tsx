import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
})
createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
