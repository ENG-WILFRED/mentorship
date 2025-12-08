declare module 'formidable' {
  import { IncomingMessage } from 'http';

  export interface File {
    filepath?: string;
    originalFilename?: string | null;
    path?: string;
    [key: string]: unknown;
  }

  export type Files = Record<string, File | File[]>;
  export type Fields = Record<string, string | string[]>;

  export interface IncomingFormOptions {
    multiples?: boolean;
  }

  export default function incomingForm(opts?: IncomingFormOptions): {
    parse(req: IncomingMessage, callback: (err: unknown, fields: Fields, files: Files) => void): void;
  };
}
