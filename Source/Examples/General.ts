import { Conv, Util } from "../Main";

const Example = async function() {
  const Hex1 = 0xdeadbeef;
  const Hex2 = 0xdeadc0de;
  const Num1 = 42;
  console.log(Conv.ToBuffer("LE", Hex1), Hex1);
  console.log(Conv.ToBufferLE(Hex1), Hex1);
  console.log(Conv.ToBufferLE(`${Hex1}`), `${Hex1}`);
  console.log(Conv.ToBufferLE(`${Hex1} ${Hex2}`), `${Hex1} ${Hex2}`);
  console.log(Conv.ToBufferLE(`0xdeadbeef 0xdeadc0de`), `0xdeadc0de 0xdeadc0de`);
  console.log(Conv.ToBufferBE(Hex1));
  console.log(Conv.ToBufferLE(Num1));
  console.log(Conv.ToBufferLE(`0xdeadbeef 42 ABCD 0xdeadc0de`));
  console.log(Conv.ToBufferLE("72 101 108 108 111 32 87 111 114 108 100 33").toString());
  
  const Buff1 = Conv.ToBufferLE(`0xdeadbeef 0xdeadc0de 0x41`);
  console.log(Conv.BufferToHexes(Buff1));
  console.log(Conv.BufferToHexes(Buff1, 2));
  console.log(Conv.BufferToHexes(Buff1, 4, "BE"));
  console.log(Conv.BufferToInts(Buff1));
  console.log(Conv.BufferToEscapedString(Buff1));

  //This is actually just Buff1.toString("binary")
  console.log(Conv.BufferToByteCode(Buff1));
  
}

Example();