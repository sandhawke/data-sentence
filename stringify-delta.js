/*

  Turn a set of deltas into a set of sentences that convey the same information

  deltas include object reference --- BEFORE vs AFTER vs ugh.  We
  don't really need BEFORE, just after.


  deltas = [   
     { target || targetLocalID
       who
       when
       property
       value
     }
  ]

  Are sents single-subject?  Let's assume so.

  So:
    1.  find all views that apply to this target
    2.  find the BEST set of sentences that covers all the touched properties

*/

function go (deltas, schema) {
  
}

/*
  - find a set of views that conveys all the properties
  - pick the 'best' one, which is ... the smallest set?
 */
function stringifyProperties (obj, properties, schema) {
}

module.exports = go
