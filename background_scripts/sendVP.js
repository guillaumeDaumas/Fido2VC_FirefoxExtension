/*
  Copyright: Copyright (c) 2019 University of Toulouse, France and
  University of Kent, UK
*/

/*
  Two default structures for tests purpose
*/
var jsonStruc = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.gov/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu",
  "issuanceDate": "2010-01-01T19:73:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "<span lang='fr-CA'>Baccalauréat en musiques numériques</span>"
    }
  },
  "proof": {
    "type": "RsaSignature2018",
    "created": "2018-06-18T21:19:10Z",
    "verificationMethod": "https://example.com/jdoe/keys/1",
    "signatureValue": "BavEll0/I1zpYw8XNi1bgVg/sCneO4Jugez8RwDg/+MCRVpjOboDoe4SxxKjkCOvKiCHGDvc4krqi6Z1n0UfqzxGfmatCuFibcC1wpsPRdW+gGsutPTLzvueMWmFhwYmfIFpbBu95t501+rSLHIEuujM/+PXr9Cky6Ed+W3JT24="
  }
}

var jsonStruc2 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.gov/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu",
  "issuanceDate": "2010-01-01T19:73:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "Other",
      "name": "<span lang='fr-CA'>Baccalauréat en musiques numériques</span>"
    }
  },
  "proof": {
    "type": "RsaSignature2018",
    "created": "2018-06-18T21:19:10Z",
    "verificationMethod": "https://example.com/jdoe/keys/1",
    "signatureValue": "BavEll0/I1zpYw8XNi1bgVg/sCneO4Jugez8RwDg/+MCRVpjOboDoe4SxxKjkCOvKiCHGDvc4krqi6Z1n0UfqzxGfmatCuFibcC1wpsPRdW+gGsutPTLzvueMWmFhwYmfIFpbBu95t501+rSLHIEuujM/+PXr9Cky6Ed+W3JT24="
  }
}


function utf8_to_b64(str) {
  // console.log(str);
  return window.btoa(unescape(encodeURIComponent(str)));
}

function getStructEncoding(struct) {
  let enc = new TextEncoder();
  return enc.encode(struct); 
}

// IL MANQUE LE RETOUR !!!!!!!!!!!!!!
/*
  Make a VP from VCs
  Hash the VP and sign it
  Return an array with the Base64 VP and the hash signature
*/
function makeVP(...VC) {

  var header = {"alg":"RS256","type":"JWT","kid":"did:example:ebfeb1f712ebc6f1c276e12ec21#keys-1"};
  var payload = {"iss": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "jti": "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
    "aud": "did:example:4a57546973436f6f6c4a4a57573",
    "iat": "1541493724",
    "exp": "1573029723",
    "nonce": "343s$FSFDa-",
    "vp": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "type": ["VerifiablePresentation"],
      "verifiableCredential": []
    }
  };
  for (var loopArguments of arguments) {
    payload['vp']['verifiableCredential'].push(loopArguments);
  }
  console.log(payload);
  let b64Header = utf8_to_b64(JSON.stringify(header));
  let b64Payload = utf8_to_b64(JSON.stringify(payload));
  let b64VP = b64Header+"."+b64Payload;
  console.log(b64VP);
  
  window.crypto.subtle.digest('SHA-256', getStructEncoding(b64VP)).then(function(hashVP) {
    var signatureOptions = {challenge: new Uint8Array([4,101,15]),
                            timeout: 60000,
                            allowCredentials: [{ type: "public-key", id: new Uint8Array([183, 148, 245]) }]
                            };
    navigator.credentials.get({"publicKey" : signatureOptions}).then(function(credentials) {
      console.log("Signature du hash du VP réussi !");
    }).catch(function (err) {
          console.log("Error navigator.credentials.get, wrong credentialID...");
          toSend = 4;
    });
  });
}

function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64.replace(/_/g, '/').replace(/-/g, '+'));
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

 /*
  Send the array from makeVP to the SP server
 */
// function sendViaXHR() {
//  let url = document.location.href;
//  var xhrVP = new XMLHttpRequest();
//  xhrVP.open("POST", url, true);
//  // xhrVP.setRequestHeader("json", );

//  xhrVP.onreadystatechange = function() {
//    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//      console.log("Request send");
//      }
//  }
//  xhrVP.send(makeVP(jsonStruc,jsonStruc2));
// }

/*
  Main part
*/


function test(){
  var ret = makeVP(jsonStruc,jsonStruc2);
  console.log(ret[0]);
  console.log(ret[1]);
}