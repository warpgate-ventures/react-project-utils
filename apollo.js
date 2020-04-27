/**
 * Used for creating an apollo client connected to a Phoenix web application backend.
 */
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-boost'
import { Socket as PhoenixSocket } from 'phoenix'
import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'
import { split } from 'apollo-link'
import { hasSubscription } from '@jumpn/utils-graphql'
import camelcaseKeys from "camelcase-keys"

const getHostname = (host) => {
  const hostname = window.location.hostname

  let isDev = hostname.indexOf('localhost') > -1

  if (hostname.indexOf('192.168') > -1) {
    isDev = true
  }

  if (isDev) {
    host = `http://${hostname}:4000`
  }

  return host
}

const getSocketHost = () => {
  return getHostname().replace('http', 'ws')
}

export const createClient = (host = '', token = '') => {
  const hostname = getHostname(host)
  const socketHost = getSocketHost()

  const httpLink = new HttpLink({
    uri: hostname + '/graphql'
  })

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return forward(operation)
  })

  const authHttpLink = authLink.concat(httpLink)

  const phoenixSocket = new PhoenixSocket(socketHost + '/socket', {
    params: () => {
      return !!token ? { token } : {}
    }
  })

  const absintheSocket = AbsintheSocket.create(phoenixSocket)
  const websocketLink = createAbsintheSocketLink(absintheSocket)

  const link = split(
    operation => hasSubscription(operation.query),
    websocketLink,
    authHttpLink
  )

  const cache = new InMemoryCache()

  const client = new ApolloClient({ link, cache })

  return client
}

/**
 * Maps the GraphQL response from  `useMutation` to an error object.
 * This expects the server to implement the Elixir.Absinthe.HandleChangesetErrors
 * @param {Object} errors 
 * @return {Object}
 */
export const mapErrors = (errors) => {
  const { graphQLErrors } = errors
  if (!graphQLErrors) return errors

  errors = graphQLErrors.reduce((prev, { message }) => {
    const [key, value] = message.split(": ")
    return { ...prev, [key]: value }
  }, {})

  return camelcaseKeys(errors)
}