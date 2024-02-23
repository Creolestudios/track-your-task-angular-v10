import { Injectable } from '@angular/core';
declare var document: any;

interface Scripts {
  name: string;
  src: string;
}  
export const ScriptStore: Scripts[] = [
//   {name: 'main', src: '../../../assets/asset/js/main.js'},
]

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor() { }
}
