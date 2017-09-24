const DS = require('data-sentence')

const schema = {
  todo: {
    defs: [
      'Here is an item for my to-do list, description: [description]'
    ],
    filter: {
      isToDoItem: true,
      description: { exists: true }
    }
  },
  done: {
    defs: [
      'The to-do list item described at [_selfLink] has now been done'
    ],
    filter: {
      isToDoItem: true,
      done: true
    }
  } /*,
  doneReply: {
    defs: [
      'This item has now been done'
    ],
    subjectOfInReplyTo: '_self',
    filter: {
      isToDoItem: true,
      done: true
    }
  } */
}

const i1 = { isToDoItem: true,
  description: 'Create a simple app to demonstrate Data Sentences and SocDB' }

const ds = new DS(schema)

const out = ds.stringifySplit(i1, 60)
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
