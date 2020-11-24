const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const default_headers = [
  '_fbp=fb.1.1587238122444.1434216063',
  'UTGv2=D-h44a76e990bdd1afc445f592e0bd81b49e28',
  'cdn.unipin.100149.ka.ck=e21a380edd1b2451e29bdba8aa367ea9eae30c71d63942c1762a8baeb5ad5dec05c9b260e5f5177c9698c0d417101577f6fd3150e06208f23acbdc570e623b847af9a7a874b2fd367453bfe7d2c74aebd1cf958bf137d0b1099f7ae427f999fb104b343a3022edb11d4ba1b9c93b2cd8c267ac916b94103e9b7e3b95f4e717231ede3d4570e0e2b542b6b3d848431f3c545bb333faa79efcc1e670',
  '_gcl_au=1.1.704961040.1606123105',
  '_gid=GA1.2.483313835.1606123105',
  '__cfduid=d42003e8f4bde2a747fc50ef9dff8c2a91606123105',
  'RT="z=1&dm=unipin.com&si=y8evqvau5xk&ss=khuc86zf&sl=0&tt=0"',
  '_gat_UA-81857948-3=1'
]

const parsing_headers = (headers) => {
  let res = '_ga=GA1.2.1065441151.1587238121';
  headers['set-cookie'].join('; ').split('; ').forEach(e => {
    const [att, val] = e.split('=');
    if (att !== 'expires' && att !== 'Max-Age' && att !== 'path' && att !== 'developer_mode' && val) {
      res += `; ${att}=${val}`;
    }
  });
  default_headers.forEach(e => {
    const [att, val] = e.split('=');
    res += `; ${att}=${val}`;
  })
  return res;
}

const app = async () => {
  try {
    var { headers, data } = await axios.get('https://www.unipin.com/login');

    const $ = cheerio.load(data);
    const email_attr = $('#loginEmail').attr('name');
    const pass_attr = $('#loginPassword').attr('name');
    const token_val = $('input[name=_token]').attr('value');
    const undf_attr = $('input[type="hidden"]').get('2').attribs.name;
    const undf_val = $('input[type="hidden"]').get('2').attribs.value;
    
    if (email_attr && pass_attr && token_val && undf_attr && undf_val) {
      let fd = new FormData();

      fd.append('_token', token_val);
      fd.append(undf_attr, undf_val);
      fd.append(email_attr, process.env.UNIPIN_ID);
      fd.append(pass_attr, process.env.UNIPIN_PW);

      const parse_headers = parsing_headers(headers)

      await axios.post('https://www.unipin.com/login', fd, {
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'content-type': 'application/x-www-form-urlencoded',
          'accept-encoding': 'gzip, deflate, br',
          origin: 'https://www.unipin.com',
          referer: 'https://www.unipin.com/login',
          cookie: parse_headers,
        }
      });
      
    } else throw 'attr required';
  } catch (err) {
    console.log(err);
  }
}

app();