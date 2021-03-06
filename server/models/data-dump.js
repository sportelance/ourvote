// execute this file using CLI command "node -r dotenv/config server/models/data-dump.js"
const fetch = require('node-fetch');
const { constructURI, encodeCode } = require('../../URIMethods.js');
const db = require('./model.js');

// Given the output of a query to the Google Civic Info API, deconstruct off of it the array of political offices and array of political officials. Produce a SQL prepared statement containing the relevant values from each to insert into the politicans table.
const assembleSql = (obj) => {
  const {offices, officials} = obj;
  let str = '';
  
  // iterate over offices
  for(let i = 0; i < offices.length; i += 1){
    // iterate over officials who hold that office
    for (let j = 0; j < offices[i].officialIndices.length; j++) {
      const k = offices[i].officialIndices[j];

      str += '('
      str += '\'' + offices[i].name + '\', ';
      str += '\'' + offices[i].divisionId + '\', ';
      str += '\'' + officials[k].name + '\', ';
      str += '\'' + officials[k].party + '\', ';
      str += officials[k].photoUrl ? '\'' + officials[k].photoUrl + '\', ': 'null, ';
      str += officials[k].urls ? '\'' + officials[k].urls[0] + '\', ' : 'null, ';
      str += '\'' + officials[k].phones[0] + '\', ';
      str += officials[k].emails ? '\'' + officials[k].emails[0] + '\'' : 'null';
      str += '), \n'
    }
 }
 str = str.slice(0, -3);
 str += '\n'

 return str;
}

const civicKey = 'AIzaSyAxaluH_KPljnz_Sj2QjajtpS_iFSZbxJY'; //civicInfo
const govKey = 'XQCd43rhRd1uncpfnaqnN75XdE2obNI9pVpYOVyT'; //api.data.gov
const congressKey = 'iIIQ7PZtABCsnlm6ac2pBteEqSbKuaMz0W3ja8jT'; //propublica
const ciceroKey = '4850765344a02ae2d5b0e20602ca8186a97f251b';
let address = '68 White St 5th floor, New York, NY 10013' // Codesmith office 
encodedAddress = encodeCode(address);
const params = {
  key: civicKey,
  address: encodedAddress
}
const paramString = constructURI(params);

let dataReturn = ''

fetch('https://api.maplight.org/maplight-api/fec/contributions?candidate_name=Hillary Clinton')
  .then(res => res.json())
  .then(data => console.log('data.data: ', data.data))
  .catch(err => console.error('Error querying Google Civic Info API.', err));
/*
UPDATE  politicians
SET     fec = 'P80000722'
WHERE   name = 'Joseph R. Biden';
Kamala D. Harris
 Charles E. Schumer
 Kirsten E. Gillibrand
 Jerrold Nadler + cid: H2NY17071
 Andrew M. Cuomo
 Kathleen C. Hochul
 Brian P. Kavanagh
 Deborah Glick
 Letitia James
 Thomas P. DiNapoli
 Cyrus R. Vance, Jr.
 Gale Brewer
 Bill de Blasio + cid: P00012054
 Scott M. Stringer
 Jumaane D. Williams
 Margaret S. Chin 
 Joseph R. Biden + cid: P80000722

 Kamala D. Harris - P00009423
 Charles E. Schumer - S8NY00082
 Kirsten E. Gillibrand - P00009290
 Kathleen C. Hochul - H2NY00036
 Deborah Glick - H8NY08077
*/

// fetch('https://www.googleapis.com/civicinfo/v2/representatives?' + paramString)
//   .then(res => res.json())
//   .then(data => {
//     dataReturn = assembleSql(data)

//     const query = `INSERT INTO politicians (
//       office, 
//       division, 
//       name,   
//       party,  
//       photo,  
//       website,
//       phone,
//       email
//     ) 
//     VALUES
//     ` + dataReturn + 'RETURNING *;'
  
//     db.query(query, (err, res) => {
//       if (err) console.log('ERROR performing data insertion.', err);
//       else console.log('Result of data insertion:', res.rows);
//     })
//   })
//   .catch(err => console.error('Error querying Google Civic Info API.', err));




/*
// office at offices[i] describes official at officials[i]

{
  normalizedInput,  // address entered
  kind, // 'civicinfo#representativeInfoResponse'
  divisions: object,
  offices: [
    {
      name: string,
      divisionId: string,
      levels: Array,
      roles: Array,
      officialIndices: Array
    }
  ], 
  officials : [
    {
      name: string,
      address: [{
        line1: string,
        city: string,
        state: string,
        zip: string
      }],
      party: string,
      phones: [
        string
      ],
      urls: [
        string
      ],
      photoUrl: string,
      channels: [
        {
          type: string,
          id: string
        }
      ]
    }
  ]
}
*/




/*
  INSERT INTO politicians (
    office, -- offices[i].name
    division, -- offices[i].divisionId
    name,   -- officials[i].name
    party,  -- officials[i].party
    photo,  -- officials[i].photoUrl
    website, -- officials[i].urls[0]
    phone, -- officials[i].phones[0]
    email -- officials[i].emails[0]
  ) 
  VALUES (
    <string variable>
  )
  RETURNING *;
*/