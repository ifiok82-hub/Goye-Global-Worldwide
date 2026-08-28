const fs = require('fs');

const rawCountries = `AF,Afghanistan,🇦🇫,+93,AFN,؋
AL,Albania,🇦🇱,+355,ALL,L
DZ,Algeria,🇩🇿,+213,DZD,د.ج
AS,American Samoa,🇦🇸,+1-684,USD,$
AD,Andorra,🇦🇩,+376,EUR,€
AO,Angola,🇦🇴,+244,AOA,Kz
AR,Argentina,🇦🇷,+54,ARS,$
AM,Armenia,🇦🇲,+374,AMD,֏
AU,Australia,🇦🇺,+61,AUD,A$
AT,Austria,🇦🇹,+43,EUR,€
AZ,Azerbaijan,🇦🇿,+994,AZN,₼
BS,Bahamas,🇧🇸,+1-242,BSD,$
BH,Bahrain,🇧🇭,+973,BHD,.د.ب
BD,Bangladesh,🇧🇩,+880,BDT,৳
BB,Barbados,🇧🇧,+1-246,BBD,$
BY,Belarus,🇧🇾,+375,BYN,Br
BE,Belgium,🇧🇪,+32,EUR,€
BZ,Belize,🇧🇿,+501,BZD,$
BJ,Benin,🇧🇯,+229,XOF,CFA
BM,Bermuda,🇧🇲,+1-441,BMD,$
BT,Bhutan,🇧🇹,+975,BTN,Nu.
BO,Bolivia,🇧🇴,+591,BOB,Bs.
BA,Bosnia and Herzegovina,🇧🇦,+387,BAM,KM
BW,Botswana,🇧🇼,+267,BWP,P
BR,Brazil,🇧🇷,+55,BRL,R$
BN,Brunei,🇧🇳,+673,BND,$
BG,Bulgaria,🇧🇬,+359,BGN,лв
BF,Burkina Faso,🇧🇫,+226,XOF,CFA
BI,Burundi,🇧🇮,+257,BIF,Fr
CV,Cabo Verde,🇨🇻,+238,CVE,Esc
KH,Cambodia,🇰🇭,+855,KHR,៛
CM,Cameroon,🇨🇲,+237,XAF,Fr
CA,Canada,🇨🇦,+1,CAD,C$
KY,Cayman Islands,🇰🇾,+1-345,KYD,$
CF,Central African Republic,🇨🇫,+236,XAF,Fr
TD,Chad,🇹🇩,+235,XAF,Fr
CL,Chile,🇨🇱,+56,CLP,$
CN,China,🇨🇳,+86,CNY,¥
CO,Colombia,🇨🇴,+57,COP,$
KM,Comoros,🇰🇲,+269,KMF,Fr
CG,Congo,🇨🇬,+242,XAF,Fr
CD,Congo (DRC),🇨🇩,+243,CDF,Fr
CR,Costa Rica,🇨🇷,+506,CRC,₡
HR,Croatia,🇭🇷,+385,EUR,€
CU,Cuba,🇨🇺,+53,CUP,$
CY,Cyprus,🇨🇾,+357,EUR,€
CZ,Czechia,🇨🇿,+420,CZK,Kč
DK,Denmark,🇩🇰,+45,DKK,kr
DJ,Djibouti,🇩🇯,+253,DJF,Fr
DO,Dominican Republic,🇩🇴,+1-809,DOP,$
EC,Ecuador,🇪🇨,+593,USD,$
EG,Egypt,🇪🇬,+20,EGP,£
SV,El Salvador,🇸🇻,+503,USD,$
GQ,Equatorial Guinea,🇬🇶,+240,XAF,Fr
ER,Eritrea,🇪🇷,+291,ERN,Nfk
EE,Estonia,🇪🇪,+372,EUR,€
SZ,Eswatini,🇸🇿,+268,SZL,L
ET,Ethiopia,🇪🇹,+251,ETB,Br
FJ,Fiji,🇫🇯,+679,FJD,$
FI,Finland,🇫🇮,+358,EUR,€
FR,France,🇫🇷,+33,EUR,€
GA,Gabon,🇬🇦,+241,XAF,Fr
GM,Gambia,🇬🇲,+220,GMD,D
GE,Georgia,🇬🇪,+995,GEL,₾
DE,Germany,🇩🇪,+49,EUR,€
GH,Ghana,🇬🇭,+233,GHS,₵
GR,Greece,🇬🇷,+30,EUR,€
GD,Grenada,🇬🇩,+1-473,XCD,$
GT,Guatemala,🇬🇹,+502,GTQ,Q
GN,Guinea,🇬🇳,+224,GNF,Fr
GW,Guinea-Bissau,🇬🇼,+245,XOF,CFA
GY,Guyana,🇬🇾,+592,GYD,$
HT,Haiti,🇭🇹,+509,HTG,G
HN,Honduras,🇭🇳,+504,HNL,L
HU,Hungary,🇭🇺,+36,HUF,Ft
IS,Iceland,🇮🇸,+354,ISK,kr
IN,India,🇮🇳,+91,INR,₹
ID,Indonesia,🇮🇩,+62,IDR,Rp
IR,Iran,🇮🇷,+98,IRR,﷼
IQ,Iraq,🇮🇶,+964,IQD,ع.د
IE,Ireland,🇮🇪,+353,EUR,€
IL,Israel,🇮🇱,+972,ILS,₪
IT,Italy,🇮🇹,+39,EUR,€
JM,Jamaica,🇯🇲,+1-876,JMD,$
JP,Japan,🇯🇵,+81,JPY,¥
JO,Jordan,🇯🇴,+962,JOD,د.ا
KZ,Kazakhstan,🇰🇿,+7,KZT,₸
KE,Kenya,🇰🇪,+254,KES,KSh
KW,Kuwait,🇰🇼,+965,KWD,د.ك
KG,Kyrgyzstan,🇰🇬,+996,KGS,с
LA,Laos,🇱🇦,+856,LAK,₭
LV,Latvia,🇱🇻,+371,EUR,€
LB,Lebanon,🇱🇧,+961,LBP,ل.ل
LS,Lesotho,🇱🇸,+266,LSL,L
LR,Liberia,🇱🇷,+231,LRD,$
LY,Libya,🇱🇾,+218,LYD,ل.د
LI,Liechtenstein,🇱🇮,+423,CHF,Fr
LT,Lithuania,🇱🇹,+370,EUR,€
LU,Luxembourg,🇱🇺,+352,EUR,€
MG,Madagascar,🇲🇬,+261,MGA,Ar
MW,Malawi,🇲🇼,+265,MWK,MK
MY,Malaysia,🇲🇾,+60,MYR,RM
MV,Maldives,🇲🇻,+960,MVR,Rf
ML,Mali,🇲🇱,+223,XOF,CFA
MT,Malta,🇲🇹,+356,EUR,€
MH,Marshall Islands,🇲🇭,+692,USD,$
MR,Mauritania,🇲🇷,+222,MRU,UM
MU,Mauritius,🇲🇺,+230,MUR,₨
MX,Mexico,🇲🇽,+52,MXN,$
FM,Micronesia,🇫🇲,+691,USD,$
MD,Moldova,🇲🇩,+373,MDL,L
MC,Monaco,🇲🇨,+377,EUR,€
MN,Mongolia,🇲🇳,+976,MNT,₮
ME,Montenegro,🇲🇪,+382,EUR,€
MA,Morocco,🇲🇦,+212,MAD,د.م.
MZ,Mozambique,🇲🇿,+258,MZN,MT
MM,Myanmar,🇲🇲,+95,MMK,Ks
NA,Namibia,🇳🇦,+264,NAD,$
NR,Nauru,🇳🇷,+674,AUD,A$
NP,Nepal,🇳🇵,+977,NPR,₨
NL,Netherlands,🇳🇱,+31,EUR,€
NZ,New Zealand,🇳🇿,+64,NZD,$
NI,Nicaragua,🇳🇮,+505,NIO,C$
NE,Niger,🇳🇪,+227,XOF,CFA
NG,Nigeria,🇳🇬,+234,NGN,₦
KP,North Korea,🇰🇵,+850,KPW,₩
MK,North Macedonia,🇲🇰,+389,MKD,ден
NO,Norway,🇳🇴,+47,NOK,kr
OM,Oman,🇴🇲,+968,OMR,ر.ع.
PK,Pakistan,🇵🇰,+92,PKR,₨
PW,Palau,🇵🇼,+680,USD,$
PA,Panama,🇵🇦,+507,PAB,B/.
PG,Papua New Guinea,🇵🇬,+675,PGK,K
PY,Paraguay,🇵🇾,+595,PYG,₲
PE,Peru,🇵🇪,+51,PEN,S/
PH,Philippines,🇵🇭,+63,PHP,₱
PL,Poland,🇵🇱,+48,PLN,zł
PT,Portugal,🇵🇹,+351,EUR,€
QA,Qatar,🇶🇦,+974,QAR,ر.ق
RO,Romania,🇷🇴,+40,RON,lei
RU,Russia,🇷🇺,+7,RUB,₽
RW,Rwanda,🇷🇼,+250,RWF,Fr
WS,Samoa,🇼🇸,+685,WST,T
SM,San Marino,🇸🇲,+378,EUR,€
ST,Sao Tome and Principe,🇸🇹,+239,STN,Db
SA,Saudi Arabia,🇸🇦,+966,SAR,ر.س
SN,Senegal,🇸🇳,+221,XOF,CFA
RS,Serbia,🇷🇸,+381,RSD,дин
SC,Seychelles,🇸🇨,+248,SCR,₨
SL,Sierra Leone,🇸🇱,+232,SLL,Le
SG,Singapore,🇸🇬,+65,SGD,$
SK,Slovakia,🇸🇰,+421,EUR,€
SI,Slovenia,🇸🇮,+386,EUR,€
SB,Solomon Islands,🇸🇧,+677,SBD,$
SO,Somalia,🇸🇴,+252,SOS,Sh
ZA,South Africa,🇿🇦,+27,ZAR,R
KR,South Korea,🇰🇷,+82,KRW,₩
SS,South Sudan,🇸🇸,+211,SSP,£
ES,Spain,🇪🇸,+34,EUR,€
LK,Sri Lanka,🇱🇰,+94,LKR,₨
SD,Sudan,🇸🇩,+249,SDG,ج.س.
SR,Suriname,🇸🇷,+597,SRD,$
SE,Sweden,🇸🇪,+46,SEK,kr
CH,Switzerland,🇨🇭,+41,CHF,Fr
SY,Syria,🇸🇾,+963,SYP,£
TW,Taiwan,🇹🇼,+886,TWD,NT$
TJ,Tajikistan,🇹🇯,+992,TJS,ЅМ
TZ,Tanzania,🇹🇿,+255,TZS,Sh
TH,Thailand,🇹🇭,+66,THB,฿
TL,Timor-Leste,🇹🇱,+670,USD,$
TG,Togo,🇹🇬,+228,XOF,CFA
TO,Tonga,🇹🇴,+676,TOP,T$
TT,Trinidad and Tobago,🇹🇹,+1-868,TTD,$
TN,Tunisia,🇹🇳,+216,TND,د.ت
TR,Turkey,🇹🇷,+90,TRY,₺
TM,Turkmenistan,🇹🇲,+993,TMT,T
TV,Tuvalu,🇹🇻,+688,AUD,A$
UG,Uganda,🇺🇬,+256,UGX,Sh
UA,Ukraine,🇺🇦,+380,UAH,₴
AE,United Arab Emirates,🇦🇪,+971,AED,د.إ
GB,United Kingdom,🇬🇧,+44,GBP,£
US,United States,🇺🇸,+1,USD,$
UY,Uruguay,🇺🇾,+598,UYU,$
UZ,Uzbekistan,🇺🇿,+998,UZS,so'm
VU,Vanuatu,🇻🇺,+678,VUV,Vt
VE,Venezuela,🇻🇪,+58,VES,Bs.S
VN,Vietnam,🇻🇳,+84,VND,₫
YE,Yemen,🇾🇪,+967,YER,﷼
ZM,Zambia,🇿🇲,+260,ZMW,ZK
ZW,Zimbabwe,🇿🇼,+263,ZWL,$`;

const formattedCountries = rawCountries.trim().split('\n').map(line => {
  const [code, name, flag, phone, currency, symbol] = line.split(',');
  return { code, name, flag, phone, currency, symbol };
});

let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');
const regex = /export const COUNTRIES = \[.*?\];/s;
code = code.replace(regex, 'export const COUNTRIES = ' + JSON.stringify(formattedCountries, null, 2) + ';');
fs.writeFileSync('src/components/AuthScreen.tsx', code);
console.log('Countries updated!');
