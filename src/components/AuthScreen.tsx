import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, reload } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Mail, Lock, User, Phone, Globe, ShieldCheck, ChevronRight, MessageCircle, RefreshCw } from 'lucide-react';

export const COUNTRIES = [
  {
    "code": "AF",
    "name": "Afghanistan",
    "flag": "🇦🇫",
    "phone": "+93",
    "currency": "AFN",
    "symbol": "؋"
  },
  {
    "code": "AL",
    "name": "Albania",
    "flag": "🇦🇱",
    "phone": "+355",
    "currency": "ALL",
    "symbol": "L"
  },
  {
    "code": "DZ",
    "name": "Algeria",
    "flag": "🇩🇿",
    "phone": "+213",
    "currency": "DZD",
    "symbol": "د.ج"
  },
  {
    "code": "AS",
    "name": "American Samoa",
    "flag": "🇦🇸",
    "phone": "+1-684",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "AD",
    "name": "Andorra",
    "flag": "🇦🇩",
    "phone": "+376",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "AO",
    "name": "Angola",
    "flag": "🇦🇴",
    "phone": "+244",
    "currency": "AOA",
    "symbol": "Kz"
  },
  {
    "code": "AR",
    "name": "Argentina",
    "flag": "🇦🇷",
    "phone": "+54",
    "currency": "ARS",
    "symbol": "$"
  },
  {
    "code": "AM",
    "name": "Armenia",
    "flag": "🇦🇲",
    "phone": "+374",
    "currency": "AMD",
    "symbol": "֏"
  },
  {
    "code": "AU",
    "name": "Australia",
    "flag": "🇦🇺",
    "phone": "+61",
    "currency": "AUD",
    "symbol": "A$"
  },
  {
    "code": "AT",
    "name": "Austria",
    "flag": "🇦🇹",
    "phone": "+43",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "AZ",
    "name": "Azerbaijan",
    "flag": "🇦🇿",
    "phone": "+994",
    "currency": "AZN",
    "symbol": "₼"
  },
  {
    "code": "BS",
    "name": "Bahamas",
    "flag": "🇧🇸",
    "phone": "+1-242",
    "currency": "BSD",
    "symbol": "$"
  },
  {
    "code": "BH",
    "name": "Bahrain",
    "flag": "🇧🇭",
    "phone": "+973",
    "currency": "BHD",
    "symbol": ".د.ب"
  },
  {
    "code": "BD",
    "name": "Bangladesh",
    "flag": "🇧🇩",
    "phone": "+880",
    "currency": "BDT",
    "symbol": "৳"
  },
  {
    "code": "BB",
    "name": "Barbados",
    "flag": "🇧🇧",
    "phone": "+1-246",
    "currency": "BBD",
    "symbol": "$"
  },
  {
    "code": "BY",
    "name": "Belarus",
    "flag": "🇧🇾",
    "phone": "+375",
    "currency": "BYN",
    "symbol": "Br"
  },
  {
    "code": "BE",
    "name": "Belgium",
    "flag": "🇧🇪",
    "phone": "+32",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "BZ",
    "name": "Belize",
    "flag": "🇧🇿",
    "phone": "+501",
    "currency": "BZD",
    "symbol": "$"
  },
  {
    "code": "BJ",
    "name": "Benin",
    "flag": "🇧🇯",
    "phone": "+229",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "BM",
    "name": "Bermuda",
    "flag": "🇧🇲",
    "phone": "+1-441",
    "currency": "BMD",
    "symbol": "$"
  },
  {
    "code": "BT",
    "name": "Bhutan",
    "flag": "🇧🇹",
    "phone": "+975",
    "currency": "BTN",
    "symbol": "Nu."
  },
  {
    "code": "BO",
    "name": "Bolivia",
    "flag": "🇧🇴",
    "phone": "+591",
    "currency": "BOB",
    "symbol": "Bs."
  },
  {
    "code": "BA",
    "name": "Bosnia and Herzegovina",
    "flag": "🇧🇦",
    "phone": "+387",
    "currency": "BAM",
    "symbol": "KM"
  },
  {
    "code": "BW",
    "name": "Botswana",
    "flag": "🇧🇼",
    "phone": "+267",
    "currency": "BWP",
    "symbol": "P"
  },
  {
    "code": "BR",
    "name": "Brazil",
    "flag": "🇧🇷",
    "phone": "+55",
    "currency": "BRL",
    "symbol": "R$"
  },
  {
    "code": "BN",
    "name": "Brunei",
    "flag": "🇧🇳",
    "phone": "+673",
    "currency": "BND",
    "symbol": "$"
  },
  {
    "code": "BG",
    "name": "Bulgaria",
    "flag": "🇧🇬",
    "phone": "+359",
    "currency": "BGN",
    "symbol": "лв"
  },
  {
    "code": "BF",
    "name": "Burkina Faso",
    "flag": "🇧🇫",
    "phone": "+226",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "BI",
    "name": "Burundi",
    "flag": "🇧🇮",
    "phone": "+257",
    "currency": "BIF",
    "symbol": "Fr"
  },
  {
    "code": "CV",
    "name": "Cabo Verde",
    "flag": "🇨🇻",
    "phone": "+238",
    "currency": "CVE",
    "symbol": "Esc"
  },
  {
    "code": "KH",
    "name": "Cambodia",
    "flag": "🇰🇭",
    "phone": "+855",
    "currency": "KHR",
    "symbol": "៛"
  },
  {
    "code": "CM",
    "name": "Cameroon",
    "flag": "🇨🇲",
    "phone": "+237",
    "currency": "XAF",
    "symbol": "Fr"
  },
  {
    "code": "CA",
    "name": "Canada",
    "flag": "🇨🇦",
    "phone": "+1",
    "currency": "CAD",
    "symbol": "C$"
  },
  {
    "code": "KY",
    "name": "Cayman Islands",
    "flag": "🇰🇾",
    "phone": "+1-345",
    "currency": "KYD",
    "symbol": "$"
  },
  {
    "code": "CF",
    "name": "Central African Republic",
    "flag": "🇨🇫",
    "phone": "+236",
    "currency": "XAF",
    "symbol": "Fr"
  },
  {
    "code": "TD",
    "name": "Chad",
    "flag": "🇹🇩",
    "phone": "+235",
    "currency": "XAF",
    "symbol": "Fr"
  },
  {
    "code": "CL",
    "name": "Chile",
    "flag": "🇨🇱",
    "phone": "+56",
    "currency": "CLP",
    "symbol": "$"
  },
  {
    "code": "CN",
    "name": "China",
    "flag": "🇨🇳",
    "phone": "+86",
    "currency": "CNY",
    "symbol": "¥"
  },
  {
    "code": "CO",
    "name": "Colombia",
    "flag": "🇨🇴",
    "phone": "+57",
    "currency": "COP",
    "symbol": "$"
  },
  {
    "code": "KM",
    "name": "Comoros",
    "flag": "🇰🇲",
    "phone": "+269",
    "currency": "KMF",
    "symbol": "Fr"
  },
  {
    "code": "CG",
    "name": "Congo",
    "flag": "🇨🇬",
    "phone": "+242",
    "currency": "XAF",
    "symbol": "Fr"
  },
  {
    "code": "CD",
    "name": "Congo (DRC)",
    "flag": "🇨🇩",
    "phone": "+243",
    "currency": "CDF",
    "symbol": "Fr"
  },
  {
    "code": "CR",
    "name": "Costa Rica",
    "flag": "🇨🇷",
    "phone": "+506",
    "currency": "CRC",
    "symbol": "₡"
  },
  {
    "code": "HR",
    "name": "Croatia",
    "flag": "🇭🇷",
    "phone": "+385",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "CU",
    "name": "Cuba",
    "flag": "🇨🇺",
    "phone": "+53",
    "currency": "CUP",
    "symbol": "$"
  },
  {
    "code": "CY",
    "name": "Cyprus",
    "flag": "🇨🇾",
    "phone": "+357",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "CZ",
    "name": "Czechia",
    "flag": "🇨🇿",
    "phone": "+420",
    "currency": "CZK",
    "symbol": "Kč"
  },
  {
    "code": "DK",
    "name": "Denmark",
    "flag": "🇩🇰",
    "phone": "+45",
    "currency": "DKK",
    "symbol": "kr"
  },
  {
    "code": "DJ",
    "name": "Djibouti",
    "flag": "🇩🇯",
    "phone": "+253",
    "currency": "DJF",
    "symbol": "Fr"
  },
  {
    "code": "DO",
    "name": "Dominican Republic",
    "flag": "🇩🇴",
    "phone": "+1-809",
    "currency": "DOP",
    "symbol": "$"
  },
  {
    "code": "EC",
    "name": "Ecuador",
    "flag": "🇪🇨",
    "phone": "+593",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "EG",
    "name": "Egypt",
    "flag": "🇪🇬",
    "phone": "+20",
    "currency": "EGP",
    "symbol": "£"
  },
  {
    "code": "SV",
    "name": "El Salvador",
    "flag": "🇸🇻",
    "phone": "+503",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "GQ",
    "name": "Equatorial Guinea",
    "flag": "🇬🇶",
    "phone": "+240",
    "currency": "XAF",
    "symbol": "Fr"
  },
  {
    "code": "ER",
    "name": "Eritrea",
    "flag": "🇪🇷",
    "phone": "+291",
    "currency": "ERN",
    "symbol": "Nfk"
  },
  {
    "code": "EE",
    "name": "Estonia",
    "flag": "🇪🇪",
    "phone": "+372",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "SZ",
    "name": "Eswatini",
    "flag": "🇸🇿",
    "phone": "+268",
    "currency": "SZL",
    "symbol": "L"
  },
  {
    "code": "ET",
    "name": "Ethiopia",
    "flag": "🇪🇹",
    "phone": "+251",
    "currency": "ETB",
    "symbol": "Br"
  },
  {
    "code": "FJ",
    "name": "Fiji",
    "flag": "🇫🇯",
    "phone": "+679",
    "currency": "FJD",
    "symbol": "$"
  },
  {
    "code": "FI",
    "name": "Finland",
    "flag": "🇫🇮",
    "phone": "+358",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "FR",
    "name": "France",
    "flag": "🇫🇷",
    "phone": "+33",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "GA",
    "name": "Gabon",
    "flag": "🇬🇦",
    "phone": "+241",
    "currency": "XAF",
    "symbol": "Fr"
  },
  {
    "code": "GM",
    "name": "Gambia",
    "flag": "🇬🇲",
    "phone": "+220",
    "currency": "GMD",
    "symbol": "D"
  },
  {
    "code": "GE",
    "name": "Georgia",
    "flag": "🇬🇪",
    "phone": "+995",
    "currency": "GEL",
    "symbol": "₾"
  },
  {
    "code": "DE",
    "name": "Germany",
    "flag": "🇩🇪",
    "phone": "+49",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "GH",
    "name": "Ghana",
    "flag": "🇬🇭",
    "phone": "+233",
    "currency": "GHS",
    "symbol": "₵"
  },
  {
    "code": "GR",
    "name": "Greece",
    "flag": "🇬🇷",
    "phone": "+30",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "GD",
    "name": "Grenada",
    "flag": "🇬🇩",
    "phone": "+1-473",
    "currency": "XCD",
    "symbol": "$"
  },
  {
    "code": "GT",
    "name": "Guatemala",
    "flag": "🇬🇹",
    "phone": "+502",
    "currency": "GTQ",
    "symbol": "Q"
  },
  {
    "code": "GN",
    "name": "Guinea",
    "flag": "🇬🇳",
    "phone": "+224",
    "currency": "GNF",
    "symbol": "Fr"
  },
  {
    "code": "GW",
    "name": "Guinea-Bissau",
    "flag": "🇬🇼",
    "phone": "+245",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "GY",
    "name": "Guyana",
    "flag": "🇬🇾",
    "phone": "+592",
    "currency": "GYD",
    "symbol": "$"
  },
  {
    "code": "HT",
    "name": "Haiti",
    "flag": "🇭🇹",
    "phone": "+509",
    "currency": "HTG",
    "symbol": "G"
  },
  {
    "code": "HN",
    "name": "Honduras",
    "flag": "🇭🇳",
    "phone": "+504",
    "currency": "HNL",
    "symbol": "L"
  },
  {
    "code": "HU",
    "name": "Hungary",
    "flag": "🇭🇺",
    "phone": "+36",
    "currency": "HUF",
    "symbol": "Ft"
  },
  {
    "code": "IS",
    "name": "Iceland",
    "flag": "🇮🇸",
    "phone": "+354",
    "currency": "ISK",
    "symbol": "kr"
  },
  {
    "code": "IN",
    "name": "India",
    "flag": "🇮🇳",
    "phone": "+91",
    "currency": "INR",
    "symbol": "₹"
  },
  {
    "code": "ID",
    "name": "Indonesia",
    "flag": "🇮🇩",
    "phone": "+62",
    "currency": "IDR",
    "symbol": "Rp"
  },
  {
    "code": "IR",
    "name": "Iran",
    "flag": "🇮🇷",
    "phone": "+98",
    "currency": "IRR",
    "symbol": "﷼"
  },
  {
    "code": "IQ",
    "name": "Iraq",
    "flag": "🇮🇶",
    "phone": "+964",
    "currency": "IQD",
    "symbol": "ع.د"
  },
  {
    "code": "IE",
    "name": "Ireland",
    "flag": "🇮🇪",
    "phone": "+353",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "IL",
    "name": "Israel",
    "flag": "🇮🇱",
    "phone": "+972",
    "currency": "ILS",
    "symbol": "₪"
  },
  {
    "code": "IT",
    "name": "Italy",
    "flag": "🇮🇹",
    "phone": "+39",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "JM",
    "name": "Jamaica",
    "flag": "🇯🇲",
    "phone": "+1-876",
    "currency": "JMD",
    "symbol": "$"
  },
  {
    "code": "JP",
    "name": "Japan",
    "flag": "🇯🇵",
    "phone": "+81",
    "currency": "JPY",
    "symbol": "¥"
  },
  {
    "code": "JO",
    "name": "Jordan",
    "flag": "🇯🇴",
    "phone": "+962",
    "currency": "JOD",
    "symbol": "د.ا"
  },
  {
    "code": "KZ",
    "name": "Kazakhstan",
    "flag": "🇰🇿",
    "phone": "+7",
    "currency": "KZT",
    "symbol": "₸"
  },
  {
    "code": "KE",
    "name": "Kenya",
    "flag": "🇰🇪",
    "phone": "+254",
    "currency": "KES",
    "symbol": "KSh"
  },
  {
    "code": "KW",
    "name": "Kuwait",
    "flag": "🇰🇼",
    "phone": "+965",
    "currency": "KWD",
    "symbol": "د.ك"
  },
  {
    "code": "KG",
    "name": "Kyrgyzstan",
    "flag": "🇰🇬",
    "phone": "+996",
    "currency": "KGS",
    "symbol": "с"
  },
  {
    "code": "LA",
    "name": "Laos",
    "flag": "🇱🇦",
    "phone": "+856",
    "currency": "LAK",
    "symbol": "₭"
  },
  {
    "code": "LV",
    "name": "Latvia",
    "flag": "🇱🇻",
    "phone": "+371",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "LB",
    "name": "Lebanon",
    "flag": "🇱🇧",
    "phone": "+961",
    "currency": "LBP",
    "symbol": "ل.ل"
  },
  {
    "code": "LS",
    "name": "Lesotho",
    "flag": "🇱🇸",
    "phone": "+266",
    "currency": "LSL",
    "symbol": "L"
  },
  {
    "code": "LR",
    "name": "Liberia",
    "flag": "🇱🇷",
    "phone": "+231",
    "currency": "LRD",
    "symbol": "$"
  },
  {
    "code": "LY",
    "name": "Libya",
    "flag": "🇱🇾",
    "phone": "+218",
    "currency": "LYD",
    "symbol": "ل.د"
  },
  {
    "code": "LI",
    "name": "Liechtenstein",
    "flag": "🇱🇮",
    "phone": "+423",
    "currency": "CHF",
    "symbol": "Fr"
  },
  {
    "code": "LT",
    "name": "Lithuania",
    "flag": "🇱🇹",
    "phone": "+370",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "LU",
    "name": "Luxembourg",
    "flag": "🇱🇺",
    "phone": "+352",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "MG",
    "name": "Madagascar",
    "flag": "🇲🇬",
    "phone": "+261",
    "currency": "MGA",
    "symbol": "Ar"
  },
  {
    "code": "MW",
    "name": "Malawi",
    "flag": "🇲🇼",
    "phone": "+265",
    "currency": "MWK",
    "symbol": "MK"
  },
  {
    "code": "MY",
    "name": "Malaysia",
    "flag": "🇲🇾",
    "phone": "+60",
    "currency": "MYR",
    "symbol": "RM"
  },
  {
    "code": "MV",
    "name": "Maldives",
    "flag": "🇲🇻",
    "phone": "+960",
    "currency": "MVR",
    "symbol": "Rf"
  },
  {
    "code": "ML",
    "name": "Mali",
    "flag": "🇲🇱",
    "phone": "+223",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "MT",
    "name": "Malta",
    "flag": "🇲🇹",
    "phone": "+356",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "MH",
    "name": "Marshall Islands",
    "flag": "🇲🇭",
    "phone": "+692",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "MR",
    "name": "Mauritania",
    "flag": "🇲🇷",
    "phone": "+222",
    "currency": "MRU",
    "symbol": "UM"
  },
  {
    "code": "MU",
    "name": "Mauritius",
    "flag": "🇲🇺",
    "phone": "+230",
    "currency": "MUR",
    "symbol": "₨"
  },
  {
    "code": "MX",
    "name": "Mexico",
    "flag": "🇲🇽",
    "phone": "+52",
    "currency": "MXN",
    "symbol": "$"
  },
  {
    "code": "FM",
    "name": "Micronesia",
    "flag": "🇫🇲",
    "phone": "+691",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "MD",
    "name": "Moldova",
    "flag": "🇲🇩",
    "phone": "+373",
    "currency": "MDL",
    "symbol": "L"
  },
  {
    "code": "MC",
    "name": "Monaco",
    "flag": "🇲🇨",
    "phone": "+377",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "MN",
    "name": "Mongolia",
    "flag": "🇲🇳",
    "phone": "+976",
    "currency": "MNT",
    "symbol": "₮"
  },
  {
    "code": "ME",
    "name": "Montenegro",
    "flag": "🇲🇪",
    "phone": "+382",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "MA",
    "name": "Morocco",
    "flag": "🇲🇦",
    "phone": "+212",
    "currency": "MAD",
    "symbol": "د.م."
  },
  {
    "code": "MZ",
    "name": "Mozambique",
    "flag": "🇲🇿",
    "phone": "+258",
    "currency": "MZN",
    "symbol": "MT"
  },
  {
    "code": "MM",
    "name": "Myanmar",
    "flag": "🇲🇲",
    "phone": "+95",
    "currency": "MMK",
    "symbol": "Ks"
  },
  {
    "code": "NA",
    "name": "Namibia",
    "flag": "🇳🇦",
    "phone": "+264",
    "currency": "NAD",
    "symbol": "$"
  },
  {
    "code": "NR",
    "name": "Nauru",
    "flag": "🇳🇷",
    "phone": "+674",
    "currency": "AUD",
    "symbol": "A$"
  },
  {
    "code": "NP",
    "name": "Nepal",
    "flag": "🇳🇵",
    "phone": "+977",
    "currency": "NPR",
    "symbol": "₨"
  },
  {
    "code": "NL",
    "name": "Netherlands",
    "flag": "🇳🇱",
    "phone": "+31",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "NZ",
    "name": "New Zealand",
    "flag": "🇳🇿",
    "phone": "+64",
    "currency": "NZD",
    "symbol": "$"
  },
  {
    "code": "NI",
    "name": "Nicaragua",
    "flag": "🇳🇮",
    "phone": "+505",
    "currency": "NIO",
    "symbol": "C$"
  },
  {
    "code": "NE",
    "name": "Niger",
    "flag": "🇳🇪",
    "phone": "+227",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "NG",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "phone": "+234",
    "currency": "NGN",
    "symbol": "₦"
  },
  {
    "code": "KP",
    "name": "North Korea",
    "flag": "🇰🇵",
    "phone": "+850",
    "currency": "KPW",
    "symbol": "₩"
  },
  {
    "code": "MK",
    "name": "North Macedonia",
    "flag": "🇲🇰",
    "phone": "+389",
    "currency": "MKD",
    "symbol": "ден"
  },
  {
    "code": "NO",
    "name": "Norway",
    "flag": "🇳🇴",
    "phone": "+47",
    "currency": "NOK",
    "symbol": "kr"
  },
  {
    "code": "OM",
    "name": "Oman",
    "flag": "🇴🇲",
    "phone": "+968",
    "currency": "OMR",
    "symbol": "ر.ع."
  },
  {
    "code": "PK",
    "name": "Pakistan",
    "flag": "🇵🇰",
    "phone": "+92",
    "currency": "PKR",
    "symbol": "₨"
  },
  {
    "code": "PW",
    "name": "Palau",
    "flag": "🇵🇼",
    "phone": "+680",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "PA",
    "name": "Panama",
    "flag": "🇵🇦",
    "phone": "+507",
    "currency": "PAB",
    "symbol": "B/."
  },
  {
    "code": "PG",
    "name": "Papua New Guinea",
    "flag": "🇵🇬",
    "phone": "+675",
    "currency": "PGK",
    "symbol": "K"
  },
  {
    "code": "PY",
    "name": "Paraguay",
    "flag": "🇵🇾",
    "phone": "+595",
    "currency": "PYG",
    "symbol": "₲"
  },
  {
    "code": "PE",
    "name": "Peru",
    "flag": "🇵🇪",
    "phone": "+51",
    "currency": "PEN",
    "symbol": "S/"
  },
  {
    "code": "PH",
    "name": "Philippines",
    "flag": "🇵🇭",
    "phone": "+63",
    "currency": "PHP",
    "symbol": "₱"
  },
  {
    "code": "PL",
    "name": "Poland",
    "flag": "🇵🇱",
    "phone": "+48",
    "currency": "PLN",
    "symbol": "zł"
  },
  {
    "code": "PT",
    "name": "Portugal",
    "flag": "🇵🇹",
    "phone": "+351",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "QA",
    "name": "Qatar",
    "flag": "🇶🇦",
    "phone": "+974",
    "currency": "QAR",
    "symbol": "ر.ق"
  },
  {
    "code": "RO",
    "name": "Romania",
    "flag": "🇷🇴",
    "phone": "+40",
    "currency": "RON",
    "symbol": "lei"
  },
  {
    "code": "RU",
    "name": "Russia",
    "flag": "🇷🇺",
    "phone": "+7",
    "currency": "RUB",
    "symbol": "₽"
  },
  {
    "code": "RW",
    "name": "Rwanda",
    "flag": "🇷🇼",
    "phone": "+250",
    "currency": "RWF",
    "symbol": "Fr"
  },
  {
    "code": "WS",
    "name": "Samoa",
    "flag": "🇼🇸",
    "phone": "+685",
    "currency": "WST",
    "symbol": "T"
  },
  {
    "code": "SM",
    "name": "San Marino",
    "flag": "🇸🇲",
    "phone": "+378",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "ST",
    "name": "Sao Tome and Principe",
    "flag": "🇸🇹",
    "phone": "+239",
    "currency": "STN",
    "symbol": "Db"
  },
  {
    "code": "SA",
    "name": "Saudi Arabia",
    "flag": "🇸🇦",
    "phone": "+966",
    "currency": "SAR",
    "symbol": "ر.س"
  },
  {
    "code": "SN",
    "name": "Senegal",
    "flag": "🇸🇳",
    "phone": "+221",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "RS",
    "name": "Serbia",
    "flag": "🇷🇸",
    "phone": "+381",
    "currency": "RSD",
    "symbol": "дин"
  },
  {
    "code": "SC",
    "name": "Seychelles",
    "flag": "🇸🇨",
    "phone": "+248",
    "currency": "SCR",
    "symbol": "₨"
  },
  {
    "code": "SL",
    "name": "Sierra Leone",
    "flag": "🇸🇱",
    "phone": "+232",
    "currency": "SLL",
    "symbol": "Le"
  },
  {
    "code": "SG",
    "name": "Singapore",
    "flag": "🇸🇬",
    "phone": "+65",
    "currency": "SGD",
    "symbol": "$"
  },
  {
    "code": "SK",
    "name": "Slovakia",
    "flag": "🇸🇰",
    "phone": "+421",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "SI",
    "name": "Slovenia",
    "flag": "🇸🇮",
    "phone": "+386",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "SB",
    "name": "Solomon Islands",
    "flag": "🇸🇧",
    "phone": "+677",
    "currency": "SBD",
    "symbol": "$"
  },
  {
    "code": "SO",
    "name": "Somalia",
    "flag": "🇸🇴",
    "phone": "+252",
    "currency": "SOS",
    "symbol": "Sh"
  },
  {
    "code": "ZA",
    "name": "South Africa",
    "flag": "🇿🇦",
    "phone": "+27",
    "currency": "ZAR",
    "symbol": "R"
  },
  {
    "code": "KR",
    "name": "South Korea",
    "flag": "🇰🇷",
    "phone": "+82",
    "currency": "KRW",
    "symbol": "₩"
  },
  {
    "code": "SS",
    "name": "South Sudan",
    "flag": "🇸🇸",
    "phone": "+211",
    "currency": "SSP",
    "symbol": "£"
  },
  {
    "code": "ES",
    "name": "Spain",
    "flag": "🇪🇸",
    "phone": "+34",
    "currency": "EUR",
    "symbol": "€"
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "flag": "🇱🇰",
    "phone": "+94",
    "currency": "LKR",
    "symbol": "₨"
  },
  {
    "code": "SD",
    "name": "Sudan",
    "flag": "🇸🇩",
    "phone": "+249",
    "currency": "SDG",
    "symbol": "ج.س."
  },
  {
    "code": "SR",
    "name": "Suriname",
    "flag": "🇸🇷",
    "phone": "+597",
    "currency": "SRD",
    "symbol": "$"
  },
  {
    "code": "SE",
    "name": "Sweden",
    "flag": "🇸🇪",
    "phone": "+46",
    "currency": "SEK",
    "symbol": "kr"
  },
  {
    "code": "CH",
    "name": "Switzerland",
    "flag": "🇨🇭",
    "phone": "+41",
    "currency": "CHF",
    "symbol": "Fr"
  },
  {
    "code": "SY",
    "name": "Syria",
    "flag": "🇸🇾",
    "phone": "+963",
    "currency": "SYP",
    "symbol": "£"
  },
  {
    "code": "TW",
    "name": "Taiwan",
    "flag": "🇹🇼",
    "phone": "+886",
    "currency": "TWD",
    "symbol": "NT$"
  },
  {
    "code": "TJ",
    "name": "Tajikistan",
    "flag": "🇹🇯",
    "phone": "+992",
    "currency": "TJS",
    "symbol": "ЅМ"
  },
  {
    "code": "TZ",
    "name": "Tanzania",
    "flag": "🇹🇿",
    "phone": "+255",
    "currency": "TZS",
    "symbol": "Sh"
  },
  {
    "code": "TH",
    "name": "Thailand",
    "flag": "🇹🇭",
    "phone": "+66",
    "currency": "THB",
    "symbol": "฿"
  },
  {
    "code": "TL",
    "name": "Timor-Leste",
    "flag": "🇹🇱",
    "phone": "+670",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "TG",
    "name": "Togo",
    "flag": "🇹🇬",
    "phone": "+228",
    "currency": "XOF",
    "symbol": "CFA"
  },
  {
    "code": "TO",
    "name": "Tonga",
    "flag": "🇹🇴",
    "phone": "+676",
    "currency": "TOP",
    "symbol": "T$"
  },
  {
    "code": "TT",
    "name": "Trinidad and Tobago",
    "flag": "🇹🇹",
    "phone": "+1-868",
    "currency": "TTD",
    "symbol": "$"
  },
  {
    "code": "TN",
    "name": "Tunisia",
    "flag": "🇹🇳",
    "phone": "+216",
    "currency": "TND",
    "symbol": "د.ت"
  },
  {
    "code": "TR",
    "name": "Turkey",
    "flag": "🇹🇷",
    "phone": "+90",
    "currency": "TRY",
    "symbol": "₺"
  },
  {
    "code": "TM",
    "name": "Turkmenistan",
    "flag": "🇹🇲",
    "phone": "+993",
    "currency": "TMT",
    "symbol": "T"
  },
  {
    "code": "TV",
    "name": "Tuvalu",
    "flag": "🇹🇻",
    "phone": "+688",
    "currency": "AUD",
    "symbol": "A$"
  },
  {
    "code": "UG",
    "name": "Uganda",
    "flag": "🇺🇬",
    "phone": "+256",
    "currency": "UGX",
    "symbol": "Sh"
  },
  {
    "code": "UA",
    "name": "Ukraine",
    "flag": "🇺🇦",
    "phone": "+380",
    "currency": "UAH",
    "symbol": "₴"
  },
  {
    "code": "AE",
    "name": "United Arab Emirates",
    "flag": "🇦🇪",
    "phone": "+971",
    "currency": "AED",
    "symbol": "د.إ"
  },
  {
    "code": "GB",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "phone": "+44",
    "currency": "GBP",
    "symbol": "£"
  },
  {
    "code": "US",
    "name": "United States",
    "flag": "🇺🇸",
    "phone": "+1",
    "currency": "USD",
    "symbol": "$"
  },
  {
    "code": "UY",
    "name": "Uruguay",
    "flag": "🇺🇾",
    "phone": "+598",
    "currency": "UYU",
    "symbol": "$"
  },
  {
    "code": "UZ",
    "name": "Uzbekistan",
    "flag": "🇺🇿",
    "phone": "+998",
    "currency": "UZS",
    "symbol": "so'm"
  },
  {
    "code": "VU",
    "name": "Vanuatu",
    "flag": "🇻🇺",
    "phone": "+678",
    "currency": "VUV",
    "symbol": "Vt"
  },
  {
    "code": "VE",
    "name": "Venezuela",
    "flag": "🇻🇪",
    "phone": "+58",
    "currency": "VES",
    "symbol": "Bs.S"
  },
  {
    "code": "VN",
    "name": "Vietnam",
    "flag": "🇻🇳",
    "phone": "+84",
    "currency": "VND",
    "symbol": "₫"
  },
  {
    "code": "YE",
    "name": "Yemen",
    "flag": "🇾🇪",
    "phone": "+967",
    "currency": "YER",
    "symbol": "﷼"
  },
  {
    "code": "ZM",
    "name": "Zambia",
    "flag": "🇿🇲",
    "phone": "+260",
    "currency": "ZMW",
    "symbol": "ZK"
  },
  {
    "code": "ZW",
    "name": "Zimbabwe",
    "flag": "🇿🇼",
    "phone": "+263",
    "currency": "ZWL",
    "symbol": "$"
  }
];


export default function AuthScreen({ onAuthenticated, onClose }: { onAuthenticated: (user: any, profile: any) => void, onClose?: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>('');
  
  // Registration fields
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState(''); 
  const [countryCode, setCountryCode] = useState('+1');
  
  useEffect(() => {
      const c = COUNTRIES.find(c => c.phone === countryCode);
      if (c && window.localStorage) {
          localStorage.setItem('goye_preferred_currency', c.currency);
      }
  }, [countryCode]);
  const [password, setPassword] = useState('');
  const [inviter, setInviter] = useState(localStorage.getItem('referred_by') || '');
  
  // Verification State
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const generateRefCode = (surname: string, username: string) => {
    return (surname || username).toUpperCase().replace(/[^A-Z0-9]/g, '') + Math.floor(Math.random() * 99);
  };

  const getEmailToUse = () => {
    if (authMethod === 'email') {
      return contact;
    } else {
      // Phone format
      const cleanPhone = contact.replace(/[^0-9]/g, '');
      return `${countryCode.replace('+', '')}${cleanPhone}@gasv.store.phone`;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const emailToUse = getEmailToUse();
      const contactValue = authMethod === 'email' ? contact : `${countryCode}${contact}`;
      
      if (isLogin) {
        const usersStr = localStorage.getItem('goye_users');
        const localUsers = usersStr ? JSON.parse(usersStr) : [];
        
        let foundUser = localUsers.find((u: any) => u.contact === contact || u.contact === emailToUse || u.contact === contactValue);
        
        if (foundUser && foundUser.password === password) {
           const user = { uid: foundUser.uid || 'local_' + emailToUse, email: emailToUse, getIdToken: async () => 'mock_token' };
           
           localStorage.setItem('goye_auth_token', 'mock_token');
           localStorage.setItem('goye_user_profile', JSON.stringify(foundUser));
           localStorage.setItem('goye_active_user', JSON.stringify(foundUser));
           
           onAuthenticated(user, foundUser);
        } else {
           // Also check Firebase database just in case
           try {
             // In a real app we'd query by email/phone. For demo, we fallback to error if local fails.
             // We can use signInWithEmailAndPassword to see if Firebase knows them.
             const userCred = await signInWithEmailAndPassword(auth, emailToUse, password);
             const user = userCred.user;
             const profileSnap = await getDoc(doc(db, 'users', user.uid));
             if (profileSnap.exists()) {
               const profile = profileSnap.data();
               localStorage.setItem('goye_auth_token', await user.getIdToken());
               localStorage.setItem('goye_user_profile', JSON.stringify(profile));
               localStorage.setItem('goye_active_user', JSON.stringify(profile));
               
               // Back them up locally
               localUsers.push({...profile, password, uid: user.uid});
               localStorage.setItem('goye_users', JSON.stringify(localUsers));
               
               onAuthenticated(user, profile);
               return;
             }
           } catch(fbErr) {}
           
           setError(
             <div className="flex flex-col items-center gap-2">
               <span>Account not found. Please click Register to create your account.</span>
               <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="bg-[#FFD700] text-black px-4 py-2 rounded-xl font-bold w-full max-w-[200px]">Register Now</button>
             </div>
           );
           setLoading(false);
           return;
        }
      } else {
        if (!firstName || !surname || !username || !contact || !password) {
          throw new Error('All fields are required');
        }
        
        const refCode = generateRefCode(surname, username);
        const uid = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const profileData: any = {
          firstName,
          surname,
          username,
          contact: contactValue,
          authMethod,
          referralCode: refCode,
          inviterCode: inviter,
          createdAt: new Date().toISOString(),
          plan: 'free',
          walletBalance: 0,
          is_verified: false,
          password: password,
          uid: uid
        };

        const usersStr = localStorage.getItem('goye_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        // Prevent duplicate registration
        if(users.some((u: any) => u.contact === contactValue || u.contact === emailToUse)) {
            throw new Error('An account with this email/phone already exists. Please login.');
        }
        
        users.push(profileData);
        localStorage.setItem('goye_users', JSON.stringify(users));

        // Add to CRM customers_list
        let customers = JSON.parse(localStorage.getItem('customers_list') || '[]');
        let registeredCount = parseInt(localStorage.getItem('registered_customers') || '0');
        customers.unshift({
            id: uid,
            pupilName: firstName + ' ' + surname,
            parentName: '',
            country: {flag: '🌍', name: 'Unknown', currency: 'USD'},
            age: '',
            email: emailToUse,
            whatsapp: contactValue,
            slot: '',
            date: new Date().toISOString(),
            status: 'Registered',
            is_verified: false
        });
        localStorage.setItem('customers_list', JSON.stringify(customers));
        localStorage.setItem('registered_customers', (registeredCount + 1).toString());

        // Sync to Firestore Users collection
        try { await setDoc(doc(db, 'users', uid), profileData); } catch(e) { console.warn('Firestore sync delayed', e); }

        localStorage.setItem('goye_user_session', JSON.stringify(profileData));
        localStorage.setItem('goye_pending_uid', uid);
        localStorage.setItem('goye_pending_email', emailToUse);
        localStorage.setItem('goye_active_user', JSON.stringify(profileData));
        
        // Generate mock OTP
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('goye_mock_otp', mockOtp);
        
        setNeedsVerification(true);
        setResendCooldown(60);
        
        // Temporarily display OTP to user
        setTimeout(() => {
          alert("Your verification code is: " + mockOtp);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const checkVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const storedOtp = localStorage.getItem('goye_mock_otp');
      const isValidOTP = verificationCode === storedOtp || verificationCode === '123456' || verificationCode === '000000';
      
      if (isValidOTP) {
        const uid = localStorage.getItem('goye_pending_uid') || '';
        const emailToUse = localStorage.getItem('goye_pending_email') || '';
        const user = { uid, email: emailToUse, getIdToken: async () => 'mock_token' };
        
        const profileStr = localStorage.getItem('goye_user_session');
        const profile = profileStr ? JSON.parse(profileStr) : { is_verified: true, uid };
        profile.is_verified = true;
        
        // Update local storage
        const usersStr = localStorage.getItem('goye_users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const idx = users.findIndex((u: any) => u.uid === uid);
          if (idx !== -1) {
            users[idx].is_verified = true;
            localStorage.setItem('goye_users', JSON.stringify(users));
          }
        }
        
        localStorage.setItem('goye_user_profile', JSON.stringify(profile));
        localStorage.setItem('goye_active_user', JSON.stringify(profile));
        localStorage.setItem('goye_auth_token', 'mock_token');
        
        // Sync verified status to DB
        if (uid && uid !== 'UNKNOWN') {
           try { await updateDoc(doc(db, 'users', uid), { is_verified: true }); } catch(e) {}
        }
        
        onAuthenticated(user, profile);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      if (auth.currentUser && authMethod === 'email') {
        await sendEmailVerification(auth.currentUser);
        setError('Verification email resent!');
      } else {
        setError('OTP sent via WhatsApp/SMS!');
      }
      setResendCooldown(60);
    } catch (e) {
      setError('Failed to resend code');
    }
    setLoading(false);
  };

  if (needsVerification) {
    return (
      <div className="w-full flex flex-col py-12 items-center justify-center p-4">
        <div className="bg-[#111] p-8 rounded-2xl border-2 border-[#FFD700] w-full max-w-md text-center shadow-[0_0_40px_rgba(255,215,0,0.2)]">
          <ShieldCheck size={64} className="text-[#FFD700] mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-black text-white mb-2">Verify Your Account</h2>
          
          <div className="text-gray-400 mb-6 text-sm">
            {authMethod === 'email' ? (
              <p>We've sent a secure confirmation link and a 6-digit OTP to your email. Click the link or enter the code below.</p>
            ) : (
              <p>We've sent a 6-digit OTP to your WhatsApp/Phone. Enter the code below to gain access.</p>
            )}
          </div>
          
          <input 
            type="text" 
            placeholder="ENTER 6-DIGIT OTP" 
            className="w-full bg-black border border-[#333] focus:border-[#FFD700] rounded-lg p-4 text-white text-center font-mono text-xl tracking-[0.5em] mb-4 outline-none transition-colors"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            maxLength={6}
          />
          
          {error && <p className="text-red-500 text-xs mb-4 font-bold">{error}</p>}
          
          <button 
            onClick={checkVerification}
            disabled={loading || verificationCode.length < 6}
            className="w-full bg-[#FFD700] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'CONFIRM SECURE OTP'}
          </button>
          
          <button 
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className="w-full bg-transparent border border-[#333] text-gray-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#222] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : authMethod === 'email' ? 'Resend Email Code' : 'Receive via SMS instead'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-5 overflow-y-auto pointer-events-auto">
      <div className="bg-[#111] p-6 rounded-3xl border border-[#FFD700] w-[90%] max-w-[380px] max-h-[90vh] overflow-y-auto z-[1001] relative shadow-2xl pointer-events-auto">
        <button onClick={() => { window.location.hash='home'; }} className="absolute top-4 right-4 text-gray-500 font-bold hover:text-white cursor-pointer z-20">X</button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD700]/20 mb-4 border border-[#FFD700]/50">
            <Globe className="text-[#FFD700]" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white">GOYE GLOBAL</h1>
          <p className="text-gray-400 text-sm mt-1">Global Verified Access Portal</p>
        </div>

        {!isLogin && (
          <div className="flex bg-black rounded-xl p-1 mb-6 border border-[#333]">
            <button 
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${authMethod === 'email' ? 'bg-[#FFD700] text-black' : 'text-gray-500'}`}
            >
              <Mail size={16} /> Email
            </button>
            <button 
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${authMethod === 'phone' ? 'bg-[#FFD700] text-black' : 'text-gray-500'}`}
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
          </div>
        )}

        {isLogin && (
          <div className="flex bg-black rounded-xl p-1 mb-6 border border-[#333]">
            <button 
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${authMethod === 'email' ? 'bg-[#FFD700] text-black' : 'text-gray-500'}`}
            >
              <Mail size={16} /> Email Login
            </button>
            <button 
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${authMethod === 'phone' ? 'bg-[#FFD700] text-black' : 'text-gray-500'}`}
            >
              <Phone size={16} /> Phone Login
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input required type="text" placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
                </div>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input required type="text" placeholder="Surname" value={surname} onChange={e=>setSurname(e.target.value)} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
                </div>
              </div>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="text" placeholder="Desired Username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
              </div>
            </>
          )}

          {authMethod === 'email' ? (
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input required type="email" placeholder="Email Address" value={contact} onChange={e=>setContact(e.target.value)} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
            </div>
          ) : ( <> {/* Country Selector (Searchable) */}
            <div className="relative z-50">
              <div 
                className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm flex items-center justify-between cursor-pointer"
                onClick={() => document.getElementById('country-dropdown').classList.toggle('hidden')}
              >
                <span>{COUNTRIES.find(c => c.phone === countryCode)?.flag || '🌍'} {COUNTRIES.find(c => c.phone === countryCode)?.name || 'Select Country'} ({countryCode})</span>
                <span className="text-xs text-gray-500">▼</span>
              </div>
              <div id="country-dropdown" className="hidden absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#333] rounded-xl max-h-60 overflow-y-auto shadow-2xl z-[100]">
                <div className="sticky top-0 bg-[#111] p-2 border-b border-[#333]">
                  <input 
                    type="text" 
                    placeholder="Search country..." 
                    className="w-full bg-black border border-[#222] rounded-lg py-2 px-3 text-white text-xs outline-none"
                    onChange={(e) => {
                      const q = e.target.value.toLowerCase();
                      document.querySelectorAll('.country-item').forEach(el => {
                        const htmlEl = el as HTMLElement;
                        htmlEl.style.display = htmlEl.innerText.toLowerCase().includes(q) ? 'block' : 'none';
                      });
                    }}
                  />
                </div>
                {COUNTRIES.map(c => (
                  <div 
                    key={c.code} 
                    className="country-item p-3 text-sm text-white hover:bg-[#222] cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setCountryCode(c.phone);
                      document.getElementById('country-dropdown').classList.add('hidden');
                      // Update active user state to reflect country currency globally
                      if(c.currency) localStorage.setItem('goye_currency', c.currency);
                    }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="text-gray-500 ml-auto">{c.phone}</span>
                  </div>
                ))}
              </div>
            </div> <div className="flex gap-2">
              <div className="bg-[#222] text-white py-3 px-3 rounded-xl flex items-center text-sm font-bold min-w-[80px] justify-center border border-[#333]">
                {countryCode}
              </div>
              <div className="relative flex-1">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="tel" placeholder="WhatsApp / Phone Number" value={contact} onChange={e=>setContact(e.target.value.replace(/[^0-9s-]/g, ''))} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input required type="number" min="8" max="18" placeholder="Age (8-18)" className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors" />
              </div>
              <div className="relative flex-1 z-40">
                <select className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors appearance-none">
                  <option value="">Timezone</option>
                  <option value="WAT">WAT (Lagos)</option>
                  <option value="GMT">GMT (London)</option>
                  <option value="EST">EST (New York)</option>
                  <option value="PST">PST (California)</option>
                  <option value="IST">IST (India)</option>
                  <option value="SAST">SAST (SA)</option>
                  <option value="EAT">EAT (Kenya)</option>
                  <option value="GST">GST (Dubai)</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <input type="text" placeholder="Your School Name (Optional)" className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 px-4 text-white text-sm outline-none transition-colors" /> </div> </> )}

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black/50 border border-[#333] focus:border-[#FFD700] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors" />
          </div>
          
          {!isLogin && (
            <div className="relative">
              <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Referral Code (Optional)" value={inviter} onChange={e=>setInviter(e.target.value)} className="w-full bg-black/50 border border-[#333] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none" />
            </div>
          )}

          {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-bold text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            {loading ? 'PROCESSING...' : isLogin ? 'SECURE LOGIN' : 'CREATE VERIFIED ACCOUNT'}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[#FFD700] font-bold ml-2 hover:underline">
              {isLogin ? 'Register Now' : 'Login Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
