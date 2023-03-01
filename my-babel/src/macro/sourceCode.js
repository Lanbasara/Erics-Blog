const files = require("./files.macro.js");
const myStyle = require("./style.macro.js");

console.log("src files:");
console.log(files("../../src"));
console.log("macro files:");
console.log(files("../macro"));

const style = myStyle`
 color : red;
 fontSize : 14px;
 background : "white";
`;

console.log(style);
