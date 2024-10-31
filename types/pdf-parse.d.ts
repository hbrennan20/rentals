// app/@types/pdf-parse.d.ts
declare module 'pdf-parse' {
    interface PDFData {
      text: string;
      numpages: number;
      info: object;
      metadata: object;
    }
  
    function pdf(buffer: Buffer): Promise<PDFData>;
  
    export default pdf;
  }