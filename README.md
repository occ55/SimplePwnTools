# SimplePwnTools
Simple collection of tools for nodejs that help with CTF challanges. This is alpha version with bugs. Still in development

This library uses Promises, async/await and Buffers extensively. Currently only has 2 main features.  
* Communicating through any socket, child process or terminal with async/await
* Converting any decimal, hex or character to buffer interpreting them as Little-endian or Big-endian or converting buffer back to those types

And there are some small features too  
* Construct payload with ease
* Construct escaped string from buffer to copy paste

Example Code For Conv Module:
```ts
  const Hex1 = 0xdeadbeef;
  const Hex2 = 0xdeadc0de;
  const Num1 = 42;
  console.log(Conv.ToBuffer(Hex1), Hex1); //<Buffer ef be ad de> 3735928559
  console.log(Conv.ToBuffer(`${Hex1}`), `${Hex1}`); //<Buffer ef be ad de> '3735928559'
  console.log(Conv.ToBuffer(`${Hex1} ${Hex2}`), `${Hex1} ${Hex2}`); //<Buffer ef be ad de de c0 ad de> '3735928559 3735929054'
  console.log(Conv.ToBuffer(`0xdeadbeef 0xdeadc0de`), `0xdeadc0de 0xdeadc0de`); //<Buffer ef be ad de de c0 ad de> '0xdeadc0de 0xdeadc0de'
  console.log(Conv.ToBuffer(Hex1, "BE")); //<Buffer de ad be ef>
  console.log(Conv.ToBuffer(Num1)); //<Buffer 2a>
  console.log(Conv.ToBuffer(`0xdeadbeef 42 ABCD 0xdeadc0de`)); //<Buffer ef be ad de 2a 41 42 43 44 de c0 ad de>
  console.log(Conv.ToBuffer("72 101 108 108 111 32 87 111 114 108 100 33").toString()); //Hello World!
  
  const Buff1 = Conv.ToBuffer(`0xdeadbeef 0xdeadc0de 0x41`);
  console.log(Conv.BufferToHexes(Buff1)); //0xdeadbeef 0xdeadc0de 0x00000041
  console.log(Conv.BufferToHexes(Buff1, 2)); //0xbeef 0xdead 0xc0de 0xdead 0x0041
  console.log(Conv.BufferToHexes(Buff1, 4, "BE")); //0xefbeadde 0xdec0adde 0x41000000
  console.log(Conv.BufferToInts(Buff1)); //239 190 173 222 222 192 173 222 65
  console.log(Conv.BufferToEscapedString(Buff1)); //239 190 173 222 222 192 173 222 65

  //This is actually just Buff1.toString("binary")
  console.log(Conv.BufferToByteCode(Buff1)); //ï¾­ÞÞÀ­ÞA
```

