class Reader {
    constructor(file) {
        this.lines = file.replaceAll("\r\n", "\n").split("\n");
        this.lineIdx = 0;
    }

    currentLine() {
        if (this.lineIdx < this.lines.length) {
            return this.lines[this.lineIdx]
        }
        return null;
    }

    nextLine() {
        if (this.lineIdx < this.lines.length) {
            this.lineIdx++;
        }
        return this.currentLine();
    }

    cleanCurrentLine() {
        while (true) {
            let line = this.currentLine();

            if (line == null) {
                return null;
            }

            line = line.trim();
            if(line.length === 0) {
                this.nextLine();
                continue;
            }

            return line;
        }
    }
}

export class DotParser {
    static parse(dotData) {
        const lines = dotData.replaceAll("\r\n", "\n").split("\n");
        lines.forEach(element => {
            console.log(element)
        });
    }
}