export const MARINETRAFFIC_CONFIG = Symbol('MARINETRAFFIC_CONFIG');

export const DEFAULT_HISTORY_PERIOD = '1';

export const MARINETRAFFIC_HEADERS = {
  authority: 'www.marinetraffic.com',
  accept: 'application/json, text/plain, */*',
  'accept-language': 'en,en-US;q=0.9',
  cookie:
    'qcSxc=1662985172161; euconsent-v2=CPfMKEAPfMKEAAKArAENCgCsAP_AAH_AAAwII_td_H__bW9j-_5_aft0eY1P9_r37uQzDhfNk-8F3L_W_LwX52E7NF36tq4KmR4Eu1LBIQNlHMHUDUmwaokVryHsak2cpzNKJ7JEknMZOydYGF9Pm1tj-YKY7_5_9_bx2D-t_9v239z378Xf3_d5_2_-_vCfV5_9jfn9fV_789KP9_58v-_8_____3____3_79gj-ASYatxAF2ZY4M2gYRQIgRhWEhVAoAIKAYWiAwAcHBTsrAJ9YQMAEAoAjAiBDiCjBgEAAAkASEQASBFggEQBEAgABAAiEQgAYmAQWAFgYBAACAaBiiFAAIEhBkQERSmBAVAkEBrZUIJQV6GmEAdZ4AUGiNioAESSAikAASFg4BgiQErFkgaYo3yAEYIUAolQqAAA.f_gAAAAAAAAA; addtl_consent=1~39.4.3.9.6.9.13.6.4.15.9.5.2.7.4.1.7.1.3.2.10.3.5.4.21.4.6.9.7.10.2.9.2.18.7.6.14.5.20.6.5.1.3.1.11.29.4.14.4.5.3.10.6.2.9.6.6.4.5.4.4.29.4.5.3.1.6.2.2.17.1.17.10.9.1.8.6.2.8.3.4.142.4.8.42.15.1.14.3.1.8.10.25.3.7.25.5.18.9.7.41.2.4.18.21.3.4.2.7.6.5.2.14.18.7.3.2.2.8.20.8.8.6.3.10.4.20.2.13.4.6.4.11.1.3.22.16.2.6.8.2.4.11.6.5.33.11.8.1.10.28.12.1.3.21.2.7.6.1.9.30.17.4.9.15.8.7.3.6.6.7.2.4.1.7.12.13.22.13.2.12.2.10.1.4.15.2.4.9.4.5.4.7.13.5.15.4.13.4.14.8.2.15.2.5.6.2.2.1.2.14.7.4.8.2.9.10.18.12.13.2.18.1.1.3.1.1.9.25.4.1.19.8.4.5.3.5.4.8.4.2.2.2.14.2.13.4.2.6.9.6.3.4.3.5.2.3.6.10.11.6.3.16.3.11.3.1.2.3.9.19.11.15.3.10.7.6.4.3.4.6.3.3.3.3.1.1.1.6.11.3.1.1.11.6.1.10.5.2.6.3.2.2.4.3.2.2.7.15.7.12.2.1.3.3.4.5.4.3.2.2.5.3.1.1.1.2.9.1.6.9.1.5.2.1.7.10.11.1.3.1.1.2.1.3.2.6.1.12.5.3.1.3.1.1.2.2.7.7.1.4.1.2.6.1.2.1.1.3.1.1.4.1.1.2.1.8.1.7.4.3.2.1.3.5.3.9.6.1.15.10.28.1.2.2.12.3.4.1.6.3.4.7.1.3.1.1.3.1.5.3.1.3.2.2.1.1.4.2.1.2.1.2.2.2.4.2.1.2.2.2.4.1.1.1.2.2.1.1.1.1.2.1.1.1.2.2.1.1.2.1.2.1.7.1.2.1.1.1.2.1.1.1.1.2.1.1.3.2.1.1.8.1.1.1.5.2.1.6.5.1.1.1.1.1.2.2.3.1.1.4.1.1.2.2.1.1.4.3.1.2.2.1.2.1.2.3.1.1.2.4.1.1.1.5.1.3.6.3.1.5.2.3.4.1.2.3.1.4.2.1.2.2.2.1.1.1.1.1.1.11.1.3.1.1.2.2.5.2.3.3.5.1.1.1.4.2.1.1.2.5.1.9.4.1.1.3.1.7.1.4.5.1.7.2.1.1.1.2.1.1.1.4.2.1.12.1.1.3.1.2.2.3.1.2.1.1.1.2.1.1.2.1.1.1.1.2.1.3.1.5.1.2.4.3.8.2.2.9.7.2.2.1.2.1.4.6.1.1.6.1.1; __qca=P0-828671235-1662985172155; _ga=GA1.2.1483400118.1662985175; hubspotutk=6bff80f0998020c1e8c9bf746429241b; _gcl_au=1.1.145989550.1662985176; _hjSessionUser_1149958=eyJpZCI6ImUwMDIzMTE4LWZkM2QtNWJlZC05NDNhLTM0ZjQ2MzA0NjY1MiIsImNyZWF0ZWQiOjE2NjI5ODUxNzUxMzgsImV4aXN0aW5nIjp0cnVlfQ==; messagesUtk=9735f3c0e404424380d6c5cff6489587; NPS_86adfcee_last_seen=1663074963886; __zlcmid=1BwlDw4p52yVNxu; vTo=1; CAKEPHP=pkf89o7a814stardflktomkkoe; SERVERID=app4; __hssrc=1; _gid=GA1.2.501662552.1664026624; AUTH=EMAIL=smil1x@mail.ru&CHALLENGE=NQLmbwHgxDCKfamharhH; mt_user[UserID]=5082913; _hjSession_1149958=eyJpZCI6IjhjNzlkNDBlLTU0N2ItNDI2Mi04MjlkLTBmYTY5OWY1Mjg5MiIsImNyZWF0ZWQiOjE2NjQyODAxMzI4NjksImluU2FtcGxlIjp0cnVlfQ==; __hstc=153128807.6bff80f0998020c1e8c9bf746429241b.1662985175077.1664280132838.1664287075865.24; _gat=1; __hssc=153128807.5.1664287075865',
  dnt: '1',
  referer:
    'https://www.marinetraffic.com/en/ais/home/centerx:-53.4/centery:65.0/zoom:7',
  'sec-ch-ua': 'Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  'vessel-image': '00253af6108866c623e26e8ea0a252081922',
  'x-requested-with': 'XMLHttpRequest',
};
