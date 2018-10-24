import { IO } from "IO";

//duzgun calismiyor
export class Terminal {
  IO:IO;
  async Run() {
    let Looping = true;
    while(Looping) {
      try {
        const Line = await this.IO.ReadUntilEndof("\n", false, false);
        process.stdout.write(eval(Line.toString("utf8")))
      } catch(e) {
        console.log(e);
      }
    }
  }
  constructor() {
    this.IO = new IO();
    this.Run();
  }
}