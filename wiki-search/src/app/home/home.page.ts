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
  public pageArr = []; 

  constructor() {}


  async ngOnInit() {
    // * init page
    // * next: Aleph_number#Aleph-one
    this.pageArr.push('Nelson_Mandela')
    console.log('First Page added!')
    console.log(this.pageArr);
    await this.requestList();
  }

  async loadMore() {
    await this.requestList();
  }

  cut(str, cutStart, cutEnd){
    return str.substr(0,cutStart) + str.substr(cutEnd+1);
  }


  async requestList() {
    let startPoint = this.pageArr.length - 1
    let count = 0;
    let limit = 500;
    let clogged = false;
    console.log('here!')
    while (clogged == false && count < limit) {
      // * add new link
      console.log(this.pageArr[this.pageArr.length-1])

      let newLink = await this.getPage(this.pageArr[this.pageArr.length-1]);
      console.log('here3!')
      if (this.pageArr.includes(newLink)) {
        //* Already has it
        clogged = true;
        break;
      }
      this.pageArr.push(newLink);
      count++;
    }

    if (clogged) {
      console.log('You have finished! You have reached a clog, start again')
      console.log(`Your total number is ${this.pageArr.length}`)
    }


        // for (let i = startPoint; i < count + startPoint; i++) {
          // * anti-clogging methods
          // let isClogged = false;


          
          // if (i >= 6) {
          //   console.log('clog searching!')
            // // * level 1 clog
            // if (this.pageArr[i] == this.pageArr[i - 1]) {
            //   // * same article over and over again
            //   console.log('level 1 clog!')
            //   isClogged = true;
            // }
            // // * level 2 clog
            // if (this.pageArr[i] == this.pageArr[i - 2]) {
            //   // * same 2 articles over and over again
            //   console.log('level 2 clog!')
            //   isClogged = true;
    
            // }
            // // * level 3 clog
            // if (this.pageArr[i] == this.pageArr[i - 3]) {
            //   // * same 3 articles over and over again
            //   console.log('level 3 clog!')
            //   isClogged = true;
            // }
    

            

            // // * more advanced clog methods
    
            // if (this.pageArr.includes(this.pageArr[i-1])) {
            //   console.log('advanced level clog!')
            //   this.pageArr.pop();
            //   isClogged = true;
            // }
    
          // }

          // isClogged = false;
        //   console.log(this.pageArr);
        // }
  }



  async getPage(page: string){
    let req = await fetch('https://cors-anywhere.herokuapp.com/' + this.baseLink + '&page=' + page)
    return await req.json().then((data) => {
      let html: string = data['parse']['text'];

      let finalVal: string;
      // * filter system
      let filterList = [
        {
          start: '<table',
          end: '</table>'
        },
        {
          start: '<div role="note"',
          end: '</div>'
        },
        {
          start: '<div class="thumb',
          end: '</div>'
        },
        {
          start: '(',
          end: ')'
        },
        
      ]



    filterList.forEach((exception) => {
      let limit = 0;
      
      while (html.includes(exception.start)) {
          if (limit > 100) {
            break;
          }
          limit++;
          let startPoint = html.indexOf(exception.start)
          let endPoint;
          // * for indexing possible endPoints
          let possible1 = html.indexOf(exception.end, startPoint + exception.start.length);
          let possible2 = html.indexOf(exception.start, startPoint + exception.start.length);

          if (possible1 > possible2) {
            // * there is another start tag before the end tag -- pyramid
            if (possible2 != -1) {

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
                  }
                }

                if (findStart < findEnd && findStart != -1) {
                  // * while we are still going up the pyramid (hitting starts)
                  countOfLayers++;
                  currentPos = findStart + exception.start.length;
                  limit++;
                }
  
                if (findStart > findEnd || findStart == -1) {
                  // * we are going down the pyramid
                  countOfLayers--;
                  currentPos = findEnd + exception.end.length;
                  if (countOfLayers == 0) {
                    endPoint = currentPos;
                    break;
                  }  
                  limit++;
                }
            
                // }
                }
                
              // endPoint = possible2

            } else {
              endPoint = possible1
            }




          } else {
            // * there is a end tag before the start tag -- normal
            if (possible1 == -1) {
              endPoint = possible2
            } else {
              endPoint = possible1 + exception.end.length
            }
          }
          html = this.cut(html, startPoint, endPoint)
        }





      })
      console.log('AFTER: ' + html);




      let splitList = html.split('<a href="/wiki/')

      splitList.shift();

      // if (clogged) { 
      //   // * shift random times to get rid of junk
      //     splitList.shift();
      //     splitList.shift();
      // }

      for(let string of splitList){
        let link = string.split('"')
        if (link[0].includes('Help:') || link[0].includes('(disambiguation)') || link[0].includes('File:') || link[0].includes('Wikipedia:') || link[0].includes('Template:')) {
        } else {

          finalVal = link[0];
          break;
        }

      }
      return finalVal;
    })  
  }
}
