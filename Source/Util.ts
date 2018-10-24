import { exec, execSync } from "child_process";
import { Conv } from "Number/Conv";

export class Util {
  static Clipboard(val:string|Buffer|number) {
    let str:Buffer;
    if(typeof val === "string") {
      str = Buffer.from(val, "utf8");
    } else if(typeof val === "number") {
      str = Buffer.from(val.toString(), "utf8");
    } else {  
      str = val;
    }
    const xsel = execSync("xsel -ibv", {input: str});
  }
  /**
   * string ise StringToBuffer dan gecer  
   * number ise sirada harf ile padding yapar A-Z  
   * Buffer ise direkt ekler
   * @param Data 
   */
  static Payload(Endian:"LE" = "LE", ...Data:(string|number|Buffer)[]) {
    let Out = Buffer.alloc(0);
    let CurrPadding = "A";
    for(let part of Data) {
      if(typeof part === "string") {
        if(part[0] == "d") {
          const len = parseInt(part.substr(1));
          const k = Math.ceil(Math.pow(len, 1/4));
          const debruijn = this.DeBruijn(k, 4);
          const str = debruijn.join("").substr(0, len);
          Out = Buffer.concat([Out, Buffer.from(str, "binary")]);
        }
        Out = Buffer.concat([Out, Conv.StringToBuffer(part, Endian)]);
      } else if(typeof part === "number") {
        let str = "";
        for(let k = 0; k < part; k++) {
          str += CurrPadding;
        }
        CurrPadding = String.fromCharCode(CurrPadding.charCodeAt(0) + 1);
        Out = Buffer.concat([Out, Buffer.from(str, "binary")]);
      } else {
        Out = Buffer.concat([Out, part]);        
      }
    }
    return Out;
  }
  static FindInDeBruijn(Length:number, Str:string) {
    const k = Math.ceil(Math.pow(Length, 1/4));
    const debruijn = this.DeBruijn(k, 4);
    const str = debruijn.join("").substr(0, Length);
    return str.indexOf(Str);
  }
  static DeBruijn(k:number, n:number = 4) {
    let a = [];
    for (let i = 0; i < k * n; i++) a.push(0);
    
    let sequence = [];
    (function db (t, p) {
      if (t > n) {
        if (n % p !== 0) return;
        for (let j = 1; j <= p; j++) {
          sequence.push(String.fromCharCode(a[j] + 65));
        }
        return;
      }
      
      a[t] = a[t-p];
      db(t + 1, p);
      for (let j = a[t-p] + 1; j < k; j++) {
        a[t] = j;
        db(t + 1, t);
      }
    })(1,1);
    return sequence
  }
}