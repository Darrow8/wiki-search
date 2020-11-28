import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // * base of link
  private baseLink = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&formatversion=2'
  

  // * list of pages
  private pageArr = []; 

  constructor() {}


  async ngOnInit() {

    // * init page
    this.pageArr.push('Nelson_Mandela')
    console.log('Nelson Mandela Page added!')
    console.log(this.pageArr);

    let ret = await this.getPage(this.pageArr[0]);
    console.log(ret)
    // for (let i = 0; i < 3; i++) {
    //   let newLink = await this.getPage(this.pageArr[i]);
    //   this.pageArr.push(newLink);

    //   // // * anti-clogging methods
    //   // if (i > 3) {
    //   //   if (this.pageArr[i - 4] == )
    //   // }

    //   console.log(this.pageArr);
    // }

    


  }

  cut(str, cutStart, cutEnd){
    return str.substr(0,cutStart) + str.substr(cutEnd+1);
  }

  async getPage(page: string){
    // let req = await fetch('https://cors-anywhere.herokuapp.com/' + this.baseLink + '&page=' + page)
    // return await req.json().then((data) => {
    // return (() => {

      let html: string; //= data['parse']['text'];
      html = `
      <html>
        good1
        <table>
          bad2
        </table>
        good3
        <table>
          bad4
        </table>
        good5
        <table>
          bad6
          <table>
            bad7
            <table>
              bad8
            </table>
            bad9
          </table>
          bad10
        </table>
        good11
        <table>
          bad12
          <table>
            bad13
          </table>
          bad14
        </table>
        good15
      </html>
      `

      let finalVal: string;
      // * filter system
      let filterList = [
        {
          start: '<div role="note"',
          end: '</div>'
        },
        {
          start: '<table>',
          end: '</table>'
        },
        
      ]


      console.log('BEFORE: ' + html);

    filterList.forEach((exception) => {
      let limit = 0;
      
      while (html.includes(exception.start)) {
          if (limit > 100) {
            break;
          }
        console.log('filtering')
        console.log('DURING: ' + html)
          limit++;
          let startPoint = html.indexOf(exception.start)
          let endPoint;
          // * for indexing possible endPoints
          let possible1 = html.indexOf(exception.end, startPoint + exception.start.length);
          let possible2 = html.indexOf(exception.start, startPoint + exception.start.length);

          if (possible1 > possible2) {
            // * there is another start tag before the end tag -- pyramid
            if (possible2 != -1) {

              console.log('PYRAMID')
              // * skip until we get to the end of the pyramid
              let currentPos = possible2 + exception.start.length;
              // * the number of layers in our pyramid that we've gone up
              let countOfLayers = 2;

              let findStart = html.indexOf(exception.start, currentPos);
              let findEnd = html.indexOf(exception.end, currentPos);
              
              while (countOfLayers > 0) {
                // * reset findStart & findEnd
                findStart = html.indexOf(exception.start, currentPos);
                findEnd = html.indexOf(exception.end, currentPos);

                if (findStart == -1) {
                  // * no more start tags
                  if (findEnd == -1) {
                    // * no more end tags, we are done
                    break;
                  } else {
                    console.log('on last pyramid!')
                  }
                }
              
                console.log(`findEnd: ${findEnd}`)
                console.log(`findStart: ${findStart}`)
                if (findStart < findEnd && findStart != -1) {
                  // * while we are still going up the pyramid (hitting starts)
                  countOfLayers++;
                  currentPos = findStart + exception.start.length;
                  console.log(`up a layer! Now to ${countOfLayers} layers and index ${currentPos}`)
                  limit++;
                }
  
                if (findStart > findEnd || findStart == -1) {
                  // * we are going down the pyramid
                  countOfLayers--;
                  currentPos = findEnd + exception.end.length;
                  if (countOfLayers == 0) {
                    endPoint = currentPos;
                    console.log('ENDPOINT SET!')
                    break;
                  }  
                  console.log(`down a layer! Now to ${countOfLayers} layers and index ${currentPos}`)
                  limit++;
                }
            
                // }
                }
                
              // endPoint = possible2

            } else {
              console.log('NO MORE START TAGS?')
              console.log('CHECK: ' + html);
              endPoint = possible1
            }




          } else {
            // * there is a end tag before the start tag -- normal
            if (possible1 == -1) {
              console.log('NO MORE END TAGS?')
              console.log('CHECK: ' + html);
              endPoint = possible2
            } else {
              console.log('NORMAL')
              endPoint = possible1 + exception.end.length
            }
          }

          console.log(`possible1: ${html.indexOf(exception.start, startPoint + exception.start.length)}`)
          console.log(`possible2: ${html.indexOf(exception.end, startPoint + exception.start.length)}`)

          console.log(`Start point: ${startPoint}`)
          console.log(`End point: ${endPoint}`)
          html = this.cut(html, startPoint, endPoint)
        }





      })
      console.log('AFTER: ' + html);




      // let splitList = html.split('<a href="/wiki/')

      // splitList.shift();
      // for(let string of splitList){
      //   let link = string.split('"')
      //   if (link[0].includes('Help:') || link[0].includes('(disambiguation)') || link[0].includes('File:') || link[0].includes('Wikipedia:') || link[0].includes('Template:')) {
      //     // console.log(`bad! ${link[0]}`)
      //   } else {
      //     // console.log(`found! ${link[0]}`)
      //     finalVal = link[0];
      //     break;
      //   }

      // }
      return finalVal;
    // })  
  }
}
