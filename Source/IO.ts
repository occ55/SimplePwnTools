import { Socket } from "net";
import { ChildProcess } from "child_process";


const Wait = function(Time:number, Fn?:Function) {
  return new Promise((res, rej) => {
    setTimeout(async () => {
      if(!Fn) {
        return res();
      }
      try {
        const result = await Fn();
        res(result);
      } catch(ex) {
        rej(ex);
      }
    }, Time);
  });
}

export class IO {
  Buffer:Buffer = Buffer.alloc(0);
  WaitLock:Promise<any>|null = null;
  WaitLockRes:Function|null = null;
  CP?:ChildProcess;
  Wait() {
    this.WaitLock = new Promise(res => this.WaitLockRes = res);
    return this.WaitLock;
  }
  Data(data:Buffer) {
    if(this.CP) {
      process.stdout.write(data.toString("utf8"));
    }
    this.Buffer = Buffer.concat([this.Buffer, data]);
    if(this.WaitLockRes) {
      this.WaitLockRes();
      this.WaitLockRes = null;
    }
  }
  /**
   * Number ise timer  
   * String ve Buffer ise Return sonucuna dahil eder
   */
  async ReadUntilEndof(until:number|string, bString:false, includeUntil:boolean):Promise<Buffer>;
  async ReadUntilEndof(until:number|string, bString:true, includeUntil:boolean):Promise<string>;
  async ReadUntilEndof(until:number|string, bString:boolean = true, includeUntil:boolean = true) {
    if(typeof until === "number") {
      await Wait(until);
      const OldBuffer = this.Buffer;
      this.Buffer = Buffer.alloc(0);
      if(bString) {
        return OldBuffer.toString("utf8");
      }
      return OldBuffer;
    } else {
      const len = Buffer.byteLength(until, "utf8");
      let start;
      let searchStart = 0;
      while(true) {
        const ind = this.Buffer.indexOf(until, searchStart);
        if(ind != -1) {
          start = ind;
          break;
        }
        if(this.Buffer.length != 0) {
          searchStart = this.Buffer.length - 1;
        }
        await this.Wait();
      }
      const nBuff = Buffer.alloc(start+len);
      this.Buffer.copy(nBuff, 0, 0, start+len);
      this.Buffer = this.Buffer.slice(start+len, this.Buffer.length);
      if(bString) {
        const str = nBuff.toString("utf8");
        if(!includeUntil) {
          return str.substr(0, str.length - until.length);
        }
        return str;
      } else {
        if(!includeUntil) {
          return nBuff.slice(0, nBuff.length - len);
        } else {
          return nBuff;
        }
      }
    }
  }
  Send(data:string|Buffer) {
    if(this.CP) {
      this.CP.stdin.write(data);
    } else {
      process.stdin.write(data);
    }
  }
  
  constructor(CP?:ChildProcess) {
    if(!CP) {
      process.stdin.on("data", this.Data.bind(this));
    } else {
      this.CP = CP;
      this.CP.stdout.on("data", this.Data.bind(this));
    }
  }
}