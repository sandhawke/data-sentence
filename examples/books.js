const DS = require('data-sentence').Translator

const schema = {
  books: {
    defs: [

      '[id] herein refers to a conceptual entity, the book titled [title], credited to a single author, referred to herein as [author], first published in the year [year]'

      // 'A book exists, with title [title], credited to a single author, referred to here as [author], first published in the year [year]'

    ]
  },
  authors: {
    defs: []
  }
}

const jg = { name: 'John Green', id: 'item_122' }
const book1 = { id: 'item_123',
  title: 'The Fault in our Stars',
  author: jg,
  year: 2012 }

const ds = new DS(schema)

const out = ds.stringifySplit(book1, 60)
console.log(out)
/* =>
[ '[part 1] "item_123" herein refers to a conceptual entity,',
  '[part 2]  the book titled "The Fault in our Stars", credi',
  '[part 3] ted to a single author, referred to herein as it',
  '[last part] em_122, first published in the year 2012' ]
*/

// const inp = ds.parse(out)
// console.log(inp)
// => { id: 'item_123',
//      title: 'The Fault in our Stars',
//      author: undefined,    // match needs the object-ref table
//      year: 2012 }

// use the first template that matches the filter; if no
// filter, then no named fields being absent.
