import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'https://covid-tracker-news-graphql.aregee.now.sh/',
});

