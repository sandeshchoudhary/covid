import { gql } from 'apollo-boost';

const query = {
  summary: {
    india: gql`
      {country(name: \"India\") { name, mostRecent { confirmed, deaths, recovered}}}
    `,
    world: gql`
      { summary{
        confirmed,
        deaths,
        recovered } }
    `
  },
  stats: {
    world: gql`
      {countries(names: []){ name, mostRecent { confirmed, deaths, recovered}}}    
    `,
    india: gql`
      {states(country: "India", names: []){ name, mostRecent { confirmed, deaths, recovered, growthRate}}}
    `
  }
}

export const getQuery = (type, id) => {
  if (type === 'country' && id !== 'india') {
    return gql`
    {
      country(name: "${id}") {
        name
        mostRecent{
          confirmed
          recovered
          deaths
        }
      }
    }
  `
  } else if (type === 'state') {
    return gql`
      {
        states(country: "India", names: []) {
          name
        }
      
        state(country: "India", name: "${id}") {
          name
          mostRecent {
            confirmed
            deaths
            recovered
          }
        }
      }
    `
  } else if (type === 'world') {
    return gql`
      { summary{
        confirmed,
        deaths,
        recovered } }
    `
  } else if (type === 'country' && id === 'india') {
    return gql`
      {country(name: \"India\") { name, mostRecent { confirmed, deaths, recovered}}}
    `
  }
}

export default query;