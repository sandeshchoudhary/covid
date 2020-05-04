import { gql } from 'apollo-boost';

const query = {
  summary: {
    india: gql`
      {
        country(name: "India") {
          name
          mostRecent {
            confirmed
            deaths
            recovered
          }
        }
      }
    `,
    world: gql`
      {
        summary {
          confirmed
          deaths
          recovered
        }
      }
    `
  },
  stats: {
    world: gql`
      {
        countries(names: []) {
          name
          mostRecent {
            confirmed
            deaths
            recovered
          }
        }
      }
    `,
    india: gql`
      {
        states(country: "India", names: []) {
          name
          mostRecent {
            confirmed
            deaths
            recovered
          }
        }
      }
    `
  },
  districts: gql`
    {
      districts {
        state
        districtData {
          district
          confirmed
          recovered
          deceased
          lastupdatedtime
        }
      }
    }
  `,
  india: gql`
    {
      india {
        statewise {
          active
          confirmed
          deaths
          deltaconfirmed
          deltadeaths
          deltarecovered
          lastupdatedtime
          recovered
          state
          statecode
          statenotes
        }
        casesTimeSeries {
          dailyconfirmed
          dailydeceased
          dailyrecovered
          date
          totalconfirmed
          totaldeceased
          totalrecovered
        }
        tested {
          positivecasesfromsamplesreported
          samplereportedtoday
          source
          testsconductedbyprivatelabs
          totalindividualstested
          totalpositivecases
          totalsamplestested
          updatetimestamp
        }
      }
    }
  `,
  tests: gql`
    {
      tests {
        negative
        numcallsstatehelpline
        numicubeds
        numisolationbeds
        numventilators
        positive
        positiveratebytests
        source
        source2
        state
        testsperthousand
        totalpeopleinquarantine
        totalpeoplereleasedfromquarantine
        totaltested
        unconfirmed
        updatedon
      }
    }
  `,
  world: gql`
    {
      summary {
        confirmed
        deaths
        recovered
      }
    }
  `,
  countries: gql`
    {
      countries(names: []) {
        name
        mostRecent {
          confirmed
          deaths
          recovered
        }
      }
    }
  `,
  indiaStats: gql`
    {
      districts {
        state
        districtData {
          district
          confirmed
          active
          deceased
          lastupdatedtime
          recovered
        }
      }
      india {
        statewise {
          active
          confirmed
          deaths
          deltaconfirmed
          deltadeaths
          deltarecovered
          lastupdatedtime
          recovered
          state
          statecode
          statenotes
        }
        casesTimeSeries {
          dailyconfirmed
          dailydeceased
          dailyrecovered
          date
          totalconfirmed
          totaldeceased
          totalrecovered
        }
        tested {
          positivecasesfromsamplesreported
          samplereportedtoday
          source
          testsconductedbyprivatelabs
          totalindividualstested
          totalpositivecases
          totalsamplestested
          updatetimestamp
        }
      }
      tests {
        negative
        numcallsstatehelpline
        numicubeds
        numisolationbeds
        numventilators
        positive
        positiveratebytests
        source
        source2
        state
        testsperthousand
        totalpeopleinquarantine
        totalpeoplereleasedfromquarantine
        totaltested
        unconfirmed
        updatedon
      }
    }
  `
};

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
  `;
  } else if (type === 'state') {
    return gql`
      {
        india {
          statewise {
            active
            confirmed
            deaths
            recovered
            state
            statecode
          }
          casesTimeSeries {
            dailyconfirmed
            dailydeceased
            dailyrecovered
            date
            totalconfirmed
            totaldeceased
            totalrecovered
          }
        }
      }
    `;
  } else if (type === 'district') {
    return gql`
      {district(stateName: "${id}") { state, districtData {district, confirmed, recovered, deceased, lastupdatedtime} }}
    `;
  } else if (type === 'country' && id === 'india') {
    return gql`
      {
        india {
          statewise {
            active
            confirmed
            deaths
            recovered
            state
            statecode
          }
          casesTimeSeries {
            dailyconfirmed
            dailydeceased
            dailyrecovered
            date
            totalconfirmed
            totaldeceased
            totalrecovered
          }
        }
      }
    `;
  }
};

export default query;
