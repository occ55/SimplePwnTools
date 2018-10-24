export class Conv {
  static Hex2Int(val:string|number) {
    return parseInt(val as any);
  }
  static StringToBuffer(Str:string, Endian:"LE"|"BE" = "LE") {
    const Vals = Str.match(/\S+/g) || [];
    let AccBuf = Buffer.alloc(0);
    for(let v of Vals) {
      if(v.substr(0,2) == "0x") {
        v = v.slice(2);
        if(Endian == "LE") {
          let tmp = "";
          for(let k = v.length-2; k >= 0; k -= 2) {
            tmp += v[k] + v[k+1];
          }
          v = tmp;
        }
        const buf = Buffer.from(v, "hex");
        AccBuf = Buffer.concat([AccBuf, buf]);
      } else if(!isNaN(parseInt(v))) {
        let vnum = parseInt(v);
        const bits = [8,16,32];
        const bit = bits.find(b => vnum < Math.pow(2,b)) || 0;
        const buf = Buffer.alloc(bit/8);
        (buf[`write${(vnum < 0 || vnum >= Math.pow(2,bit/2))?"U":""}Int${bit}${bit != 8?Endian:""}` as any] as any)(vnum);
        AccBuf = Buffer.concat([AccBuf, buf]);
      } else {
        
      }
    }
    return AccBuf;
  }
  static BufferToBinary(Buff:Buffer) {
    return Buff.toString("binary");
  }
  static BufferToEscapedString(Buff:Buffer) {
    let result = "";
    for(let k = 0; k < Buff.length; k++) {
      let hex = ReadHex(Buff, k);
      result += `\\x${hex}`;
    } 
    return result;
  }
  static BufferToInt(Buff:Buffer, Bit:32|16|8 = 8, Endian:"LE"|"BE" = "LE", Signed:boolean = false) {
    let result = "";
    if(Buff.length % (Bit/8) != 0) {
      console.log("Buffer is not devidable");
      return "";
    }
    for(let k = 0; k < Buff.length / (Bit/8); k++) {
      result += (Buff[`read${Signed?"":"U"}Int${Bit}${Bit != 8?Endian:""}` as any] as any)(k) + " ";
    }
    return result;
  }
  static BufferToHex(Buff:Buffer, Byte:1|2|3|4|8 = 4, Endian:"LE"|"BE" = "LE") {
    let result = "";
    if(Buff.length % Byte != 0) {
      Buff = Buffer.concat([Buff, Buffer.alloc(Byte - (Buff.length % Byte),0)]);
    }
    for(let hexct = 0; hexct < Buff.length; hexct+=Byte) {
      let hex = "";
      for(let bytect = 0; bytect < Byte; bytect++) {
        let decstr = ReadHex(Buff, hexct + bytect);
        if(Endian == "LE") {
          hex = decstr + hex;
        } else {
          hex = hex + decstr;
        }
      }
      result += `0x${hex} `;
    }
    return result;
  }
}

const ReadHex = function(Buff:Buffer, offset:number) {
  let dec = Buff.readUInt8(offset);
  let decstr = dec.toString(16);
  if(decstr.length == 1) decstr = "0" + decstr;
  return decstr
}