import { gql } from 'apollo-boost';

const query = {
  summary: {
    INDIA: gql`
      {country(name: \"India\") { name, mostRecent { confirmed, deaths, recovered}}}
    `,
    WORLD: gql`
      { summary{
        confirmed,
        deaths,
        recovered } }
    `
  },
  stats: {
    WORLD: gql`
      {countries(names: []){ name, mostRecent { confirmed, deaths, recovered}}}    
    `,
    INDIA: gql`
      {states(country: "India", names: []){ name, mostRecent { confirmed, deaths, recovered, growthRate}}}
    `
  }
}

export default query;