## In Progress / Experimental

Convert back and forth between JavaScript data objects and
natural-language sentences with the same intended meaning, using
templates you provide.

It's like JSON.parse() and JSON.stringify(), except instead of the
text being JSON it's normal English, or whatever languages are
appropriate for your environment.

Advantages:
- non-experts (eg end users) can read the data
- arbitrary semantic precision (see below)
- serialization is self-documenting, like XML and JSON, but much more so

Disadvantages:
- serialization is verbose (but gzip can take care of much of that)
- you need code to read and write the data (but now you have this library)
- you need to write a schema (but maybe that'll improve your code, like
  writing test cases and eating your vegetables)

## Example

See examples directory

## Semantics

The essential insight behind this approach is that conventional
well-defined XML, JSON, and RDF formats often have each component
(each property, element, attribute, class, token value, etc) defined
in one normative sentence or paraphrase (each) in a specification
document.  There are often associated examples and background and
discussion, but the key is a small bit of text per term.  If
everything is perfectly in sync, that works pretty well.

But what happens when the definitional text isn't perfect?  Maybe it's
early in the life cycle and people are still trying to figure out a
reasonable version.  Or maybe it's late in the life cycle, after years
of heavy use, and an evolving understanding of the problem space
causes people to start to bend the meaning a little.  In either case,
how is one to understand data sent using a vocabulary whose meaning is
unclear or in flux?

(more tbd)

